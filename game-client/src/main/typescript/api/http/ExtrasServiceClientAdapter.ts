import ExtrasService from "../ExtrasService";
import FlowableAdapter from "../FlowableAdapter";
import { Extra } from "game-idl";
import { Flux } from "reactor-core-js/flux";
import {Flowable} from "rsocket-flowable";

export default class ExtrasServiceClientAdapter implements ExtrasService {

    extras(): Flux<Extra.AsObject> {
        const urlParams = new URLSearchParams(window.location.search);
        const endpoint = urlParams.get('endpoint');
        return Flux.from<Extra>(FlowableAdapter.wrap(new Flowable(subscriber => {
                const eventSource = new EventSource(`${endpoint || "http://dinoman.netifi.com:3000"}/http/extras`, { withCredentials : true });

                subscriber.onSubscribe({
                    request: (): void => {},
                    cancel: (): void => eventSource.close()
                });

                eventSource.onmessage = e => {
                    subscriber.onNext(Extra.deserializeBinary(new Uint8Array(eval(e.data))));
                };

                eventSource.onerror = (e: any) => {
                    subscriber.onError(e.data);
                }
            })))
            .map(extra => extra.toObject());
    }
}