import assert from "assert";
import {CommandsManager} from "./CommandsManager";

export class ChatManager {

    private cmdManager: CommandsManager;
    private chatId: string

    constructor(accessToken: string, chatId: string)
    {
        this.cmdManager = new CommandsManager(accessToken);
        this.chatId = chatId;
    }

    public async addNewAdmin(userId: number, removeOtherAdmin: boolean = true)
    {
        let chatMembers = await this.cmdManager.getChatAdministrators(this.chatId)
        console.log(`length = ${chatMembers.length}`);
        let randomNumber = Math.floor(Math.random() * (chatMembers.length - 1));
        console.log(randomNumber);
        assert(randomNumber >= 0 && randomNumber < chatMembers.length);
        while(chatMembers[randomNumber].status === 'creator' || chatMembers[randomNumber].user.is_bot)
        {
            // TODO: Уходил один раз в бесконечный цикл
            randomNumber = Math.floor(Math.random() * (chatMembers.length - 1));
            console.log(randomNumber);
            assert(randomNumber >= 0 && randomNumber < chatMembers.length);
        }
        let randomUser = chatMembers[randomNumber].user;
        console.log('RANDOM USER:');
        console.log(randomUser)
        await this.cmdManager.demoteChatMember(this.chatId, randomUser.id)
        await this.cmdManager.promoteChatMember(this.chatId, userId)
    }
}