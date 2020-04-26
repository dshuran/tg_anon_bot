import axios, {AxiosError, AxiosResponse} from 'axios';

export class TransportConnection {

    private readonly accessToken: string;
    private apiUrl = 'https://api.telegram.org/bot';

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }

    private send<TOptions>(commandName: string, options?: TOptions): Promise<unknown>
    {
        const sendingUrl = `${this.apiUrl}${this.accessToken}/${commandName}`;
        return axios.post(sendingUrl, options)
            .then((res: AxiosResponse<unknown>) => {
                return res.data
            })
            .catch((err: AxiosError) => {
                console.log('Error while sending command. If there are more details you will see them below.');
                if (err.isAxiosError)
                    console.log('This is the axios error.');
                if (err.response)
                    console.log(err.response.data);

                throw err;
            });
    }

    public sendCommand<TOptions>(commandName: string, options?: TOptions): Promise<unknown>
    {
        return this.send<TOptions>(commandName, options);
    }

}