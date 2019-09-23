package org.coinen.reactive.pacman;

import java.net.URI;
import java.time.Duration;

import io.micrometer.core.instrument.Tags;
import io.micrometer.core.instrument.binder.jvm.ClassLoaderMetrics;
import io.micrometer.core.instrument.binder.jvm.JvmGcMetrics;
import io.micrometer.core.instrument.binder.jvm.JvmMemoryMetrics;
import io.micrometer.core.instrument.binder.jvm.JvmThreadMetrics;
import io.micrometer.core.instrument.binder.system.FileDescriptorMetrics;
import io.micrometer.core.instrument.binder.system.ProcessorMetrics;
import io.micrometer.core.instrument.binder.system.UptimeMetrics;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import io.rsocket.AbstractRSocket;
import io.rsocket.Payload;
import io.rsocket.RSocketFactory;
import io.rsocket.frame.decoder.PayloadDecoder;
import io.rsocket.transport.netty.client.WebsocketClientTransport;
import org.coinen.pacman.metrics.MetricsSnapshot;
import org.coinen.pacman.metrics.MetricsSnapshotHandlerClient;
import org.coinen.reactive.pacman.metrics.MappingUtils;
import org.coinen.reactive.pacman.metrics.rsocket.ClientMetricsAwareRSocket;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Hooks;
import reactor.core.publisher.Mono;

public class RSocketRpcDoser {

    static final Logger LOGGER = LoggerFactory.getLogger(RSocketRpcDoser.class);

    public static void main(String[] args) throws InterruptedException {

        SimpleMeterRegistry registry = new SimpleMeterRegistry();

        new JvmMemoryMetrics(Tags.empty()).bindTo(registry);
        new JvmGcMetrics(Tags.empty()).bindTo(registry);
        new JvmThreadMetrics(Tags.empty()).bindTo(registry);
        new ClassLoaderMetrics(Tags.empty()).bindTo(registry);
        new ProcessorMetrics(Tags.empty()).bindTo(registry);
        new UptimeMetrics(Tags.empty()).bindTo(registry);
        new FileDescriptorMetrics(Tags.empty()).bindTo(registry);

        Flux<MetricsSnapshot> metricsSnapshotFlux = Flux
            .generate(sink -> sink.next(
                registry
                    .getMeters()
                    .stream()
                    .reduce(
                        MetricsSnapshot.newBuilder(),
                        (ms, meter) -> ms.addMeters(MappingUtils.mapMeter(meter)),
                        (ms1, ms2) -> ms1.addAllMeters(ms2.getMetersList()))
                    .build()
            ));

        Flux.range(0, 200)
            .doOnNext(i -> LOGGER.info("Connecting client number: {}", i))
            .concatMap(__ -> Mono
                .defer(() ->
                    RSocketFactory.connect()
                                  .keepAliveAckTimeout(Duration.ofDays(10000))
                                  .frameDecoder(PayloadDecoder.ZERO_COPY)
                                  .acceptor((___) -> new AbstractRSocket() {
                                      @Override
                                      public Mono<Void> fireAndForget(Payload payload) {
                                          payload.release();
                                          return Mono.empty();
                                      }
                                  })
                                  .transport(WebsocketClientTransport.create(URI.create("http://localhost:3000/")))
                                  .start()
                                  .map(ClientMetricsAwareRSocket::new)
                )
                .doOnError(t -> LOGGER.error("Reconnecting. ", t))
                .retryBackoff(10, Duration.ofSeconds(2), Duration.ofSeconds(5))
                .delaySubscription(Duration.ofMillis(100)),
                1
            )
            .subscribe(rSocket -> {
                MetricsSnapshotHandlerClient client =
                    new MetricsSnapshotHandlerClient(rSocket);

                metricsSnapshotFlux
                    .hide()
                    .transform(client::streamMetricsSnapshots)
                    .doOnError(t -> LOGGER.error("Got Error", t))
                    .retryBackoff(1000, Duration.ofSeconds(1))
                    .subscribe();
            });


        Thread.sleep(10000000);

    }
}