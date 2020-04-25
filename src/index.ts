import {accessToken} from "./AccessToken";
import {CommandsManager, IChatMember, IPromoteMemberOptionalParams, IUser} from "./CommandsManager";
import assert from "assert";



let cmdManager = new CommandsManager(accessToken.get());

let chat_id = '@anon_bot_channel';
let user_id = 57701371;
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

/*cmdManager.promoteChatMember(chat_id, user_id, promotionOptions)
    .then((res: boolean) => {
        console.log(res);
    });*/

/*cmdManager.demoteChatMember(chat_id, user_id)
    .then((res: boolean) => {
        console.log(res);
    });*/

cmdManager.getChatAdministrators(chat_id)
    .then((chatMembers: IChatMember[]) => {
        console.log(chatMembers.length)
        console.log(chatMembers);
        let randomNumber = Math.floor(Math.random() * (chatMembers.length - 1));
        console.log(randomNumber);
        assert(randomNumber >= 0 && randomNumber < chatMembers.length);
        while(chatMembers[randomNumber].status === 'creator' || chatMembers[randomNumber].user.is_bot)
        {
            randomNumber = Math.floor(Math.random() * (chatMembers.length - 1));
            console.log(randomNumber);
            assert(randomNumber >= 0 && randomNumber < chatMembers.length);
        }
        let randomUser = chatMembers[randomNumber].user;
        console.log('RANDOM USER:');
        console.log(randomUser)

        cmdManager.demoteChatMember(chat_id, randomUser.id)
            .then((res: boolean) => {
                console.log(res);
            });



    })


