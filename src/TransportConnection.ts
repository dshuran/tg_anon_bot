import axios, {AxiosResponse} from 'axios';

export class TransportConnection {

    private accessToken: string;
    private apiUrl: string = 'https://api.telegram.org/bot';

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }

    private async send(commandName: string, options?: unknown): Promise<unknown>
    {
        let sendingUrl = `${this.apiUrl}${this.accessToken}/${commandName}`;
        let res = await axios.post(sendingUrl, options);
        return res.data;
    }

    public async sendCommand(commandName: string, options?: unknown): Promise<unknown>
    {
        return this.send(commandName, options);
    }

}