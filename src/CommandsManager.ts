import {TransportConnection} from "./TransportConnection";

export interface IPromoteMemberOptionalParams
{
    canChangeInfo: boolean,
    canPostMessages: boolean,
    canEditMessages: boolean,
    canDeleteMessages: boolean,
    canInviteUsers: boolean,
    canRestrictMembers: boolean,
    canPinMessages: boolean,
    canPromoteMembers: boolean
}

export interface IChatMember {
    user: IUser;
    status: string;
}

export interface IUser {
    id: number;
    is_bot: boolean;
}

interface IGetChatAdministratorsRequest {
    chat_id: string;
}

interface IGetChatAdministratorsResponse {
    ok: boolean;
    result: IChatMember[];
}

export class CommandsManager
{
    private transportConnection: TransportConnection;

    constructor(accessToken: string)
    {
        this.transportConnection = new TransportConnection(accessToken);
    }

    /**
     *  https://core.telegram.org/bots/api#promotechatmember
     */
    public promoteChatMember(chatId: string, userId: number, optionalParams: IPromoteMemberOptionalParams): Promise<boolean>
    {
        let options = {
            chat_id: chatId,
            user_id: userId,
            can_change_info: optionalParams.canChangeInfo,
            can_post_messages: optionalParams.canPostMessages,
            can_edit_messages: optionalParams.canEditMessages,
            can_delete_messages: optionalParams.canDeleteMessages,
            can_invite_users: optionalParams.canInviteUsers,
            can_restrict_members: optionalParams.canRestrictMembers,
            can_pin_messages: optionalParams.canPinMessages,
            can_promote_members: optionalParams.canPromoteMembers
        }

        return this.transportConnection.sendCommand(
            'promoteChatMember',
            options
        ) as Promise<boolean>;
    }

    public demoteChatMember(chatId: string, userId: number): Promise<boolean>
    {
        let options = {
            chat_id: chatId,
            user_id: userId,
            can_change_info: false,
            can_post_messages: false,
            can_edit_messages: false,
            can_delete_messages: false,
            can_invite_users: false,
            can_restrict_members: false,
            can_pin_messages: false,
            can_promote_members: false
        }

        return this.transportConnection.sendCommand(
            'promoteChatMember',
            options
        ) as Promise<boolean>;
    }

    public getChatAdministrators(chatId: string)
    {
        return this.transportConnection.sendCommand<IGetChatAdministratorsRequest>(
            'getChatAdministrators',
            {chat_id: chatId}
        ).then((response: unknown) =>
        {
            return (response as IGetChatAdministratorsResponse).result;
        }) as Promise<IChatMember[]>
    }

}