/* eslint-disable @typescript-eslint/no-var-requires */
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
/* eslint-enable @typescript-eslint/no-var-requires */

const adapter = new FileSync('db.json')
const db = low(adapter)


class DatabaseManager
{
    public SetDefaults(): void
    {
        db.defaults({
            users: []
        }).write()
    }

    public addUserToWhitelist(user: string): void
    {
        db.get('users')
            .push({username: user})
            .write()
    }

    public removeUserFromWhilelist(user: string): void
    {
        db.get('users')
            .remove({username: user})
            .write()
    }

    public userInWhitelist(user: string): boolean
    {
        const foundUser = db.get('users')
            .find({username: user})
            .value()
        if (foundUser)
            return true;
        return false
    }
}

export const dbManager = new DatabaseManager();