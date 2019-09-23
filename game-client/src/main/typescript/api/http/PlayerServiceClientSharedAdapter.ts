import PlayerService from "../PlayerService";
import FlowableAdapter from "../FlowableAdapter";
import { Flux, DirectProcessor } from "reactor-core-js/flux";
import { Single, Flowable } from "rsocket-flowable";
import { Player } from "game-idl";
import { Location } from "game-idl";
import { Point } from "game-idl";
import { Disposable } from "reactor-core-js";

export default class PlayerServiceClientSharedAdapter implements PlayerService {
    
    private sharedPlayersStream: DirectProcessor<Player.AsObject>;
    
    locate(locationStream: Flux<Location.AsObject>): Single<void> {
        const urlParams = new URLSearchParams(window.location.search);
        const endpoint = urlParams.get('endpoint');
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
                            fetch(`${endpoint || "http://dinoman.netifi.com:3000"}/http/locate`, {
                                method: "POST",
                                body: location.serializeBinary(),
                                credentials: "include"
                            })
                            .then(__ => isFetching = false, __ => isFetching = false);
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
            const urlParams = new URLSearchParams(window.location.search);
            const endpoint = urlParams.get('endpoint');
            this.sharedPlayersStream = new DirectProcessor();
            
            Flux.from<Player>(FlowableAdapter.wrap(new Flowable(subscriber => {
                const eventSource = new EventSource(`${endpoint || "http://dinoman.netifi.com:3000"}/http/players`, { withCredentials : true });

                subscriber.onSubscribe({
                    request: (): void => {},
                    cancel: (): void => eventSource.close()
                });

                eventSource.onmessage = e => {
                    subscriber.onNext(Player.deserializeBinary(new Uint8Array(eval(e.data))));
                };

                eventSource.onerror = (e: any) => {
                    subscriber.onError(e.data);
                }
            })))
            .map(player => player.toObject())
            .subscribe(this.sharedPlayersStream);
        }

        return this.sharedPlayersStream
    }
}