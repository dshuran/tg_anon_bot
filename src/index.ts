import {accessToken} from "./AccessToken";
import {CommandsManager, IPromoteMemberOptionalParams} from "./CommandsManager";



let cmdManager = new CommandsManager(accessToken.get());

let chat_id = '@anon_bot_channel';
let user_id = 66366854;
let promotionOptions: IPromoteMemberOptionalParams = {
    canChangeInfo: false,
    canDeleteMessages: false,
    canEditMessages: false,
    canInviteUsers: false,
    canPinMessages: false,
    canPostMessages: true,
    canPromoteMembers: false,
    canRestrictMembers: false
}

cmdManager.promoteChatMember(chat_id, user_id, promotionOptions)
    .then((res: boolean) => {
        console.log(res);
    });


