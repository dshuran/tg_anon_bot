import fs from 'fs';

class AccessToken
{
    public get(): string
    {
        return fs.readFileSync('D:\\accessToken.txt', {encoding: 'utf-8'});
    }
}

export const accessToken = new AccessToken();
