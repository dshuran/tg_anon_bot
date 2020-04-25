import {accessToken} from "./AccessToken";
import {CommandsManager} from "./CommandsManager";
import {ChatManager} from "./ChatManager";

class Tests
{
    public async testNewAdminPromotion()
    {
        let chat_id = '@anon_bot_channel';

        let cmdManager = new CommandsManager(accessToken.get());

        await cmdManager.demoteChatMember(chat_id, 377417801)
        await cmdManager.promoteChatMember(chat_id, 57701371)
        await cmdManager.promoteChatMember(chat_id, 66366854)

        let chatManager = new ChatManager(accessToken.get(), chat_id);

        await chatManager.addNewAdmin(377417801);
    }
}

export const appTesting = new Tests();