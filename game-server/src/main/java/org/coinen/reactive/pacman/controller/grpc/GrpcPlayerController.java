package org.coinen.reactive.pacman.controller.grpc;

import com.google.protobuf.Empty;
import io.micrometer.core.instrument.MeterRegistry;
import io.rsocket.rpc.metrics.Metrics;
import org.coinen.pacman.Player;
import org.coinen.pacman.ReactorPlayerServiceGrpc;
import org.coinen.reactive.pacman.service.PlayerService;
import org.lognet.springboot.grpc.GRpcService;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.context.Context;

import org.springframework.beans.factory.annotation.Qualifier;

import static org.coinen.reactive.pacman.controller.grpc.config.UUIDInterceptor.CONTEXT_UUID_KEY;

@GRpcService
public class GrpcPlayerController extends ReactorPlayerServiceGrpc.PlayerServiceImplBase {

    final PlayerService playerService;
    final MeterRegistry registry;

    public GrpcPlayerController(PlayerService playerService,
        @Qualifier("grpc") MeterRegistry registry) {
        this.playerService = playerService;
        this.registry = registry;
    }

    @Override
    public Flux<Player> players(Mono<Empty> message) {
        return playerService
            .players()
            .onBackpressureBuffer()
            .subscriberContext(Context.of("uuid", CONTEXT_UUID_KEY.get()));
    }
}
