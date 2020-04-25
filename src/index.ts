import {TransportConnection} from './TransportConnection'
import {accessToken} from "./AccessToken";

let connection = new TransportConnection(accessToken.get());
connection.sendCommand('getMe')
    .then((res: any) => {
        console.log(res.status);
        console.log(res.data);
    })
    .catch((err: any) => {
        console.log(err);
    });
