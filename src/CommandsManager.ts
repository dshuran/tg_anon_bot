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

}