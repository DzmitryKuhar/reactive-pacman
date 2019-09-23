import { Single } from "rsocket-flowable";
import { Map } from "game-idl";
import { GRPCWebServices } from "game-idl";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { ClientReadableStream } from "grpc-web";
import * as uuid from "uuid";

export default class SetupServiceClientAdapter {

    private service: GRPCWebServices.SetupServiceClient;

    constructor() {
        const urlParams = new URLSearchParams(window.location.search);
        const endpoint = urlParams.get('endpoint');
        this.service = new GRPCWebServices.SetupServiceClient(endpoint || "http://dinoman.netifi.com:8000", {}, {});
    }

    map(): Single<Map.AsObject> {
        return new Single(subject => {
            let stream: ClientReadableStream<any>;
            const myId = uuid.v4();
            localStorage.setItem("uuid", myId)
            subject.onSubscribe(() => stream.cancel());
            stream = this.service.get(new Empty(), {"uuid": myId}, (err, response) => {
                if (err) {
                    subject.onError(new Error(`An Grpc Error was thrown. Code: [${err.code}]. Message: ${err.message}`));
                    return;
                }
                subject.onComplete((response.toObject() as any) as Map.AsObject);
            });
        });
    }
}