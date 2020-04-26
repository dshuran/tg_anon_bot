import assert from "assert";
import {CommandsManager} from "./CommandsManager";

export class ChatManager {

    private cmdManager: CommandsManager;

    constructor(accessToken: string, chatId: string)
    {
        this.cmdManager = new CommandsManager(accessToken, chatId);
    }

    public async addNewAdmin(userId: number, removeOtherAdmin: boolean = true)
    {
        if (removeOtherAdmin)
        {
            let chatMembers = await this.cmdManager.getChatAdministrators()
            let randomNumber = Math.floor(Math.random() * (chatMembers.length - 1));
            assert(randomNumber >= 0 && randomNumber < chatMembers.length);
            // TODO: Проверить, что есть хотя бы 2 обычных админа. Чтобы не уйти в бесконечный цикл с ботами и создателем.
            while(chatMembers[randomNumber].status === 'creator' || chatMembers[randomNumber].user.is_bot)
            {
                // TODO: Уходил один раз в бесконечный цикл, проверить, что невозможно.
                randomNumber = Math.floor(Math.random() * (chatMembers.length - 1));
                assert(randomNumber >= 0 && randomNumber < chatMembers.length);
            }
            let randomUser = chatMembers[randomNumber].user;
            await this.cmdManager.demoteChatMember(randomUser.id);
        }
        await this.cmdManager.promoteChatMember(userId);
    }
}