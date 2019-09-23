package org.coinen.reactive.pacman.controller.grpc;

import com.google.protobuf.Empty;
import io.netty.buffer.ByteBuf;
import org.coinen.pacman.metrics.MetricsSnapshot;
import org.coinen.pacman.metrics.MetricsSnapshotHandler;
import org.coinen.pacman.metrics.MetricsSnapshotHandlerClient;
import org.coinen.pacman.metrics.ReactorMetricsSnapshotHandlerGrpc;
import org.lognet.springboot.grpc.GRpcService;
import org.reactivestreams.Publisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@GRpcService
public class GrpcMetricsSnapshotHandlerProxyController extends
                                                       ReactorMetricsSnapshotHandlerGrpc.MetricsSnapshotHandlerImplBase {
    static final Logger LOGGER = LoggerFactory.getLogger(
        GrpcMetricsSnapshotHandlerProxyController.class);

    final ReactorMetricsSnapshotHandlerGrpc.ReactorMetricsSnapshotHandlerStub delegate;

    public GrpcMetricsSnapshotHandlerProxyController(ReactorMetricsSnapshotHandlerGrpc.ReactorMetricsSnapshotHandlerStub delegate) {
        this.delegate = delegate;
    }

    @Override
    public Mono<Empty> streamMetricsSnapshots(Flux<MetricsSnapshot> messages) {
        return delegate.streamMetricsSnapshots(messages.hide());
    }

    @Override
    public Mono<Empty> sendMetricsSnapshot(Mono<MetricsSnapshot> messageMono) {
        return delegate.sendMetricsSnapshot(messageMono);
    }
}
