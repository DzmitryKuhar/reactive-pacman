import { Flux, DirectProcessor } from "reactor-core-js/flux";
import {Flowable, Single} from "rsocket-flowable";
import { Player } from "game-idl";
import { Location } from "game-idl";
import PlayerService from "../PlayerService";
import { GRPCWebServices } from "game-idl";
import { Point } from "game-idl";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { Disposable } from "reactor-core-js";
import FlowableAdapter from "../FlowableAdapter";

export default class PlayerServiceClientSharedAdapter implements PlayerService {
    private service: GRPCWebServices.PlayerServiceClient;
    private locationServiceFallback: GRPCWebServices.LocationServiceClient;
    private sharedPlayersStream: DirectProcessor<Player.AsObject>;

    constructor() {
        const urlParams = new URLSearchParams(window.location.search);
        const endpoint = urlParams.get('endpoint');
        this.service = new GRPCWebServices.PlayerServiceClient(endpoint || "http://dinoman.netifi.com:8000", {}, {});
        this.locationServiceFallback = new GRPCWebServices.LocationServiceClient(endpoint || "http://dinoman.netifi.com:8000", {}, {});
    }

    locate(locationStream: Flux<Location.AsObject>): Single<void> {
        return new Single(subject => {
            let disposable: Disposable = {
                dispose: () => {}
            };

            subject.onSubscribe(() => disposable.dispose());
            let isFetching = false;
            disposable = locationStream
                .map(location => {
                    const locationProto = new Location();
                    const positionProto = new Point();

                    positionProto.setX(location.position.x);
                    positionProto.setY(location.position.y);
                    locationProto.setPosition(positionProto);
                    locationProto.setDirection(location.direction);

                    return locationProto;
                })
                .consume(
                    (location) => {
                        if(!isFetching) {
                            isFetching = true;
                            this.locationServiceFallback.locate(location as any, {"uuid": localStorage.getItem("uuid")}, (() => isFetching = false));
                        } else {
                            console.warn("Dropped Location", location)
                        }
                    },
                    (e: Error) => subject.onError(e),
                    () => subject.onComplete()
                )
        })
    }

    players(): Flux<Player.AsObject> {
        if (!this.sharedPlayersStream) {
            this.sharedPlayersStream = new DirectProcessor()
            Flux.from<Player>(FlowableAdapter.wrap(new Flowable(subscriber => {
                    const clientReadableStream = this.service.players(new Empty(), {"uuid": localStorage.getItem("uuid")});

                    subscriber.onSubscribe({
                        request: (): void => {},
                        cancel: (): void => clientReadableStream.cancel()
                    });

                    clientReadableStream.on("data", response => subscriber.onNext(response));
                    clientReadableStream.on("end", () => subscriber.onComplete());
                    clientReadableStream.on("error", (err) => subscriber.onError(new Error(`An Grpc Error was thrown. Code: [${err.code}]. Message: ${err.message}`)));
                })))
                .map(player => player.toObject())
                .subscribe(this.sharedPlayersStream);
        }

        return this.sharedPlayersStream;
    }
}