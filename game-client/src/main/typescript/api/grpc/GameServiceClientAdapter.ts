import GameService from "../GameService";
import { Nickname } from "game-idl";
import { Config } from "game-idl";
import { Single } from "rsocket-flowable";
import { GRPCWebServices } from "game-idl";
import { ClientReadableStream } from "grpc-web";

export default class GameServiceClientAdapter implements GameService {

    private service: GRPCWebServices.GameServiceClient;

    constructor() {
        const urlParams = new URLSearchParams(window.location.search);
        const endpoint = urlParams.get('endpoint');
        this.service = new GRPCWebServices.GameServiceClient(endpoint || "http://dinoman.netifi.com:8000", {}, {});
    }

    start({ value }: Nickname.AsObject): Single<Config.AsObject> {
        const nicknameProto = new Nickname();

        nicknameProto.setValue(value);

        return new Single(subject => {
            let stream: ClientReadableStream<any>;
            subject.onSubscribe(undefined); //TODO: FIXME
            stream = this.service.start(nicknameProto as any, { "uuid": localStorage.getItem("uuid") }, (err, response) => {
                if (err) {
                    subject.onError(new Error(`An Grpc Error was thrown. Code: [${err.code}]. Message: ${err.message}`));
                    return;
                }
                subject.onComplete((response.toObject() as any) as Config.AsObject);
            });
        })
    }
}