import fs from 'fs';
import path from 'path';

class AccessToken
{
    public get(): string
    {
        let tokenPath = path.join('..', 'accessToken.txt')
        return fs.readFileSync(tokenPath, {encoding: 'utf-8'});
    }
}

export const accessToken = new AccessToken();
