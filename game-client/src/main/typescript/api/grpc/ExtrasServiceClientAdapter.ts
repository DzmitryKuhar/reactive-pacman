import ExtrasService from "../ExtrasService";
import { Extra } from "game-idl";
import { Flux } from "reactor-core-js/flux";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import FlowableAdapter from "../FlowableAdapter";
import { GRPCWebServices } from "game-idl";
import { Flowable } from "rsocket-flowable";

export default class ExtrasServiceClientAdapter implements ExtrasService {

    private service: GRPCWebServices.ExtrasServiceClient;

    constructor() {
        const urlParams = new URLSearchParams(window.location.search);
        const endpoint = urlParams.get('endpoint');
        this.service = new GRPCWebServices.ExtrasServiceClient(endpoint || "http://dinoman.netifi.com:8000", {}, {});
    }

    extras(): Flux<Extra.AsObject> {
        return Flux.from<Extra>(FlowableAdapter.wrap(new Flowable(subscriber => {
                const clientReadableStream = this.service.extras(new Empty(), { "uuid": localStorage.getItem("uuid") });

                subscriber.onSubscribe({
                    request: (): void => { },
                    cancel: (): void => clientReadableStream.cancel()
                });

                clientReadableStream.on("data", response => subscriber.onNext(response));
                clientReadableStream.on("end", () => subscriber.onComplete());
                clientReadableStream.on("error", (err) => subscriber.onError(new Error(`An Grpc Error was thrown. Code: [${err.code}]. Message: ${err.message}`)));
            })))
            .map(player => player.toObject())
    }
}