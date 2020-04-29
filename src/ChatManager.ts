import assert from "assert";
import {CommandsManager, ITelegramUpdate} from "./CommandsManager";
import {dbManager} from "./DatabaseManager";

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
        if (removeOtherAdmin)
        {
            const chatMembers = await this.cmdManager.getChatAdministrators()
            let randomNumber = Math.floor(Math.random() * (chatMembers.length - 1));
            assert(randomNumber >= 0 && randomNumber < chatMembers.length);
            // TODO: Проверить, что есть хотя бы 2 обычных админа. Чтобы не уйти в бесконечный цикл с ботами и создателем.
            while(chatMembers[randomNumber].status === 'creator' || chatMembers[randomNumber].user.is_bot)
            {
                // TODO: Уходил один раз в бесконечный цикл, проверить, что невозможно.
                randomNumber = Math.floor(Math.random() * (chatMembers.length - 1));
                assert(randomNumber >= 0 && randomNumber < chatMembers.length);
            }
            const randomUser = chatMembers[randomNumber].user;
            await this.cmdManager.demoteChatMember(randomUser.id);
        }
        await this.cmdManager.promoteChatMember(userId);
    }

    public async startPolling()
    {
        let lastUpdateId: number | undefined = undefined;
        setInterval(async () => {
            lastUpdateId = await this.getTelegramUpdates(lastUpdateId)
        }, 5000);
    }

    private async getTelegramUpdates(offset?: number): Promise<number | undefined>
    {
        let updates = await this.cmdManager.getUpdates(offset);
        let lastUpdateId = 0;
        for(const update of updates)
        {
            await this.handleUpdate(update);
            lastUpdateId = update.update_id;
        }

        if(lastUpdateId)
            return lastUpdateId + 1;
        return undefined;
    }

    private async handleUpdate(update: ITelegramUpdate): Promise<void>
    {
        if (update.message)
        {
            let message = update.message;
            console.log(`there text = ${message.text}`)
            // Text and author exist
            if (message.text && message.from)
            {
                let senderId = message.from.id;
                let simpleCommand = new RegExp("^\/[a-zA-Z]+$");
                let complexCommand = new RegExp("^\/[a-zA-Z]+ [0-9]+$");
                // If the message is a command
                if (message.text.match(simpleCommand))
                {
                    let command = message.text;
                    console.log(`NEW command = ${command}`);
                    switch (command)
                    {
                        case '/start':
                        {
                            const text = `Привет! Если ты хочешь написать сообщение в чат ${this.chatId}, то тебе нужно попасть в whitelist. Попроси добавить тебя туда одного из модераторов: @dshuran`
                            await this.cmdManager.sendMessage(senderId, text);
                            break;
                        }
                    }
                }
                else if (
                    message.text.match(complexCommand) &&
                    (dbManager.userIsModerator(senderId) || dbManager.userIsSuperUser(senderId))
                )
                {
                    // (dbManager.userIsModerator(senderId) || dbManager.userIsSuperUser(senderId))
                    let [command, userIdString] = message.text.split(' ');
                    let userId = parseInt(userIdString);
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
            }
        }
    }

}