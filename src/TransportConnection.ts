import axios, {AxiosError, AxiosResponse} from 'axios';

export class TransportConnection {

    private accessToken: string;
    private apiUrl: string = 'https://api.telegram.org/bot';

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }

    private send(commandName: string, options?: Object): Promise<unknown>
    {
        let sendingUrl = `${this.apiUrl}${this.accessToken}/${commandName}`;
        return axios.post(sendingUrl, options)
            .then((res:AxiosResponse<any>) => {
                return res.data
            })
            .catch((err: AxiosError) => {
                console.log('Error while sending command. If there are more details you will see them below.');
                if (err.isAxiosError)
                    console.log('This is the axios error.');
                if (err.response)
                    console.log(err.response.data);
            });
    }

    public sendCommand<TOptions>(commandName: string, options?: TOptions): Promise<unknown>
    {
        return this.send(commandName, options);
    }

}