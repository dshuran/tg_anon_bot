import assert from "assert";
import {CommandsManager, ITelegramUpdate} from "./CommandsManager";
import {dbManager} from "./DatabaseManager";

const maxAdminsCount = 5;

export class ChatManager {

    private cmdManager: CommandsManager;
    private readonly chatId: string;

    constructor(accessToken: string, chatId: string)
    {
        this.cmdManager = new CommandsManager(accessToken, chatId);
        this.chatId = chatId;
    }

    public async addNewAdmin(userId: number, removeOtherAdmin = true): Promise<void>
    {
        const chatAdmins = await this.cmdManager.getChatAdministrators();
        let deletableAdmins: number[] = []; // list of admins' ids
        for (let admin of chatAdmins)
        {
            let userId = admin.user.id;
            if (
                dbManager.userIsSuperUser(userId) ||
                dbManager.userIsModerator(userId) ||
                admin.user.is_bot ||
                admin.status === 'creator'
            )
            {
                continue;
            }
            deletableAdmins.push(userId);
        }
        console.log(deletableAdmins);
        if (removeOtherAdmin && chatAdmins.length > maxAdminsCount)
        {
            let randomNumber = Math.floor(Math.random() * (deletableAdmins.length - 1));
            assert(randomNumber >= 0 && randomNumber < deletableAdmins.length);
            console.log(`Id to delete = ${deletableAdmins[randomNumber]}`)
            await this.cmdManager.demoteChatMember(deletableAdmins[randomNumber]);
        }
        await this.cmdManager.promoteChatMember(userId);
    }

    public async startPolling(): Promise<void>
    {
        let lastUpdateId: number | undefined = undefined;
        setInterval(async () => {
                lastUpdateId = await this.getTelegramUpdates(lastUpdateId)
        }, 5000);
    }

    private async getTelegramUpdates(offset?: number): Promise<number | undefined>
    {
        const updates = await this.cmdManager.getUpdates(offset);
        let lastUpdateId = 0;

        try
        {
            for(const update of updates)
            {
                lastUpdateId = update.update_id;
                await this.handleUpdate(update);
            }
        }
        catch (e)
        {
            return lastUpdateId + 1
        }


        if(lastUpdateId)
            return lastUpdateId + 1;
        return undefined;
    }

    private async handleUpdate(update: ITelegramUpdate): Promise<void>
    {
        if (update.message)
        {
            const message = update.message;
            console.log(`potential command = ${message.text}`)
            // Text and author exist
            if (message.text && message.from)
            {
                const senderId = message.from.id;
                /* eslint-disable no-useless-escape */
                const simpleCommand = new RegExp("^\/[a-zA-Z]+$");
                const complexCommand = new RegExp("^\/[a-zA-Z]+ [0-9]+$");
                /* eslint-enable no-useless-escape */
                // If the message is a command
                if (message.text.match(simpleCommand))
                {
                    const command = message.text;
                    console.log(`NEW command = ${command}`);
                    switch (command)
                    {
                        case '/start':
                        {
                            const text = `Привет! Если ты хочешь написать сообщение в чат ${this.chatId}, то тебе нужно попасть в White list. ` +
                                `Информацию об этом можешь найти в закреплённом сообщении чата. ` +
                                 `Если же ты уже в White List, набери /go. Ты получишь сообщение об успешном получении админских прав.`
                            await this.cmdManager.sendMessage(senderId, text);
                            break;
                        }
                        case '/go':
                        {
                            if (dbManager.userInWhitelist(senderId))
                            {
                                await this.addNewAdmin(senderId);
                                await this.cmdManager.sendMessage(senderId, 'Теперь у вас есть права писать сообщения!');
                            }
                            else
                            {
                                await this.cmdManager.sendMessage(senderId, 'Вы не находитесь в whitelist!');
                            }
                            break;
                        }
                        default:
                        {
                            await this.cmdManager.sendMessage(senderId, 'Вы ввели некорректную команду. Пожалуйста, введите /start или /go');
                        }
                    }
                }
                else if (
                    message.text.match(complexCommand) &&
                    (dbManager.userIsModerator(senderId) || dbManager.userIsSuperUser(senderId))
                )
                {
                    const [command, userIdString] = message.text.split(' ');
                    const userId = parseInt(userIdString);
                    console.log(`complex command! command = ${command} username = ${userId}`)
                    switch (command)
                    {
                        case '/addToWhitelist':
                        {
                            dbManager.addUserToWhitelist(userId)
                            await this.cmdManager.sendMessage(senderId, 'Пользователь добавлен в Whitelist');
                            break;
                        }
                        case '/removeFromWhitelist':
                        {
                            dbManager.removeUserFromWhilelist(userId);
                            await this.cmdManager.sendMessage(senderId, 'Пользователь удалён из Whitelist');
                            break;
                        }
                        case '/addChatModerator':
                        {
                            if (!dbManager.userIsSuperUser(senderId))
                                break;
                            dbManager.addChatModerator(userId);
                            await this.cmdManager.sendMessage(senderId, 'Добавлен новый модератор')
                            break;
                        }
                        case '/removeChatModerator':
                        {
                            if (!dbManager.userIsSuperUser(senderId))
                                break;
                            dbManager.removeChatModerator(userId);
                            await this.cmdManager.sendMessage(senderId, 'Модератор удалён')
                            break;
                        }
                    }
                }
                else
                {
                    await this.cmdManager.sendMessage(senderId, 'Вы ввели некорректную команду. Пожалуйста, введите /start или /go')
                }
            }
        }
    }

}