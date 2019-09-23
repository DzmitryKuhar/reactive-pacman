import { Single } from "rsocket-flowable";
import { Map } from "game-idl";

export default class SetupServiceClientAdapter {

    map(): Single<Map.AsObject> {
        const urlParams = new URLSearchParams(window.location.search);
        const endpoint = urlParams.get('endpoint');
        return new Single(subject => {
            subject.onSubscribe(undefined); //TODO: FIXME
            fetch(`${endpoint || "http://dinoman.netifi.com:3000"}/http/setup`, {
                credentials: "include"
            })
            .then(res => {
                console.log('got res', res.body);
                return res;
            })
            .then(response => response.arrayBuffer())
            .then(buffer => subject.onComplete(Map.deserializeBinary(new Uint8Array(buffer)).toObject()), error => subject.onError(error))
        })
    }
}