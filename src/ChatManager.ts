import assert from "assert";
import {CommandsManager, ITelegramUpdate} from "./CommandsManager";

export class ChatManager {

    private cmdManager: CommandsManager;

    constructor(accessToken: string, chatId: string)
    {
        this.cmdManager = new CommandsManager(accessToken, chatId);
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
        }, 10000);
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
            // Text and author exist
            if (message.text && message.from)
            {
                let simpleCommand = new RegExp("^\/[a-z]+$");
                let complexCommand = new RegExp("^\/[a-z]+ @[a-z]+$");
                // If the message is a command
                if (message.text.match(simpleCommand))
                {
                    let command = message.text;
                    let senderId = message.from.id;
                    console.log(`NEW command = ${command}`);
                    // TODO: Теперь сделать свитч на разные команды и говорить пользователю, успешно завершилась или нет.
                    switch (command)
                    {
                        case '/start':
                        {
                            await this.cmdManager.sendMessage(senderId, 'Привет! Рады приветствовать тебя!')
                            break;
                        }
                    }
                }
                else if (message.text.match(complexCommand))
                {
                    let [command, username] = message.text.split(' ');
                    console.log('OOPS');
                }
            }
        }
    }

}