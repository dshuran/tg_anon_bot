import axios, {AxiosResponse} from 'axios';

export class TransportConnection {

    private accessToken: string;
    private apiUrl: string = 'https://api.telegram.org/bot';

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }

    private send(commandName: string): Promise<AxiosResponse<any>>
    {
        let sendingUrl = `${this.apiUrl}${this.accessToken}/${commandName}`;
        return axios.get(sendingUrl);
    }

    public sendCommand(commandName: string): Promise<AxiosResponse<any>>
    {
        return this.send(commandName);
    }

}