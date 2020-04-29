/* eslint-disable @typescript-eslint/no-var-requires */
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
/* eslint-enable @typescript-eslint/no-var-requires */

const adapter = new FileSync('db.json')
const db = low(adapter)


class DatabaseManager
{
    public setDefaults(): void
    {
        db.defaults({
            users: [],
            moderators: [],
            superusers: [
                {
                    "id": 292584438
                }
            ]
        }).write()
    }

    public addUserToWhitelist(userId: number): void
    {
        db.get('users')
            .push({id: userId})
            .write()
    }

    public removeUserFromWhilelist(userId: number): void
    {
        db.get('users')
            .remove({id: userId})
            .write()
    }

    public userInWhitelist(userId: number): boolean
    {
        const foundUser = db.get('users')
            .find({id: userId})
            .value()

        if (foundUser)
            return true;
        return false
    }

    public addChatModerator(adminId: number)
    {
        db.get('moderators')
            .push({id: adminId})
            .write()
    }

    public removeChatModerator(adminId: number): void
    {
        db.get('moderators')
            .remove({id: adminId})
            .write()
    }

    public userIsModerator(userId: number): boolean
    {
        const foundUser = db.get('moderators')
            .find({id: userId})
            .value()

        if (foundUser)
            return true;
        return false;
    }

    public userIsSuperUser(userId: number): boolean
    {
        const foundUser = db.get('superusers')
            .find({id: userId})
            .value()

        if (foundUser)
            return true;
        return false;
    }
}

export const dbManager = new DatabaseManager();