import {CommandsManager} from "./CommandsManager";
import {ChatManager} from "./ChatManager";
import assert from "assert";

export class BotTests
{
    private cmdManager: CommandsManager;
    private readonly accessToken: string;
    private readonly chatId: string;

    constructor(accessToken: string, chatId: string)
    {
        this.chatId = chatId;
        this.accessToken = accessToken;
        this.cmdManager = new CommandsManager(accessToken, this.chatId);
    }

    public async execute(): Promise<void>
    {
        try
        {
            return await this.testNewAdminPromotion();
        }
        catch (err) {
            console.log('Error inside a promise. More info:');
            console.log(err);
        }

    }


    private async testNewAdminPromotion()
    {
        let user1 = 377417801; // Alex
        let user2 = 57701371; // Nik
        let user3 = 66366854; // Art

        // Scenario

        await this.cmdManager.demoteChatMember(user1);
        await this.cmdManager.promoteChatMember(user2);
        await this.cmdManager.promoteChatMember(user3);

        let numberOfAdminsStart = await this.cmdManager.getChatAdministrators();

        let chatManager = new ChatManager(this.accessToken, this.chatId);

        await chatManager.addNewAdmin(user1);

        // Checks

        await this.checkAdmins([user1]);
        let numberOfAdminsEnd = await this.cmdManager.getChatAdministrators()
        assert(numberOfAdminsStart.length === numberOfAdminsEnd.length);

        console.log('NewAdminPromotion - PASSED');
    }

    private async checkAdmins(users: number[])
    {
        let admins = await this.cmdManager.getChatAdministrators();
        for(let user of users)
        {
            if (!admins.find((admin) => {
                return admin.user.id === user
            }))
            {
                throw new Error("checkAdmins FAILED!")
            }
        }
    }
}