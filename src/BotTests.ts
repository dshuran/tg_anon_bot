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
        console.log('Starting tests...')
        try
        {
            return await this.testNewAdminPromotion();
        }
        catch (err) {
            console.log('Error inside a promise. More info:');
            console.log(err);
        }

    }


    private async testNewAdminPromotion(): Promise<void>
    {
        const user1 = 377417801; // Alex
        const user2 = 57701371; // Nik
        const user3 = 66366854; // Art

        // Scenario

        await this.cmdManager.demoteChatMember(user1);
        await this.cmdManager.promoteChatMember(user2);
        await this.cmdManager.promoteChatMember(user3);

        const numberOfAdminsStart = await this.cmdManager.getChatAdministrators();

        const chatManager = new ChatManager(this.accessToken, this.chatId);

        await chatManager.addNewAdmin(user1);

        // Checks

        await this.checkAdmins([user1]);
        const numberOfAdminsEnd = await this.cmdManager.getChatAdministrators()
        assert(numberOfAdminsStart.length === numberOfAdminsEnd.length);

        console.log('NewAdminPromotion - PASSED');
    }

    private async checkAdmins(users: number[]): Promise<void>
    {
        const admins = await this.cmdManager.getChatAdministrators();
        for(const user of users)
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