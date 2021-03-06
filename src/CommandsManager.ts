import {TransportConnection} from "./TransportConnection";

export interface IPromoteMemberOptionalParams
{
    canChangeInfo: boolean;
    canPostMessages: boolean;
    canEditMessages: boolean;
    canDeleteMessages: boolean;
    canInviteUsers: boolean;
    canRestrictMembers: boolean;
    canPinMessages: boolean;
    canPromoteMembers: boolean;
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

interface IGetUpdatesResponse {
    ok: boolean;
    result: ITelegramUpdate[];
}

export interface ITelegramUpdate {
    update_id: number;
    message: ITelegramMessage;
}

export interface ITelegramUser {
    id: number;
}

export interface ITelegramMessage {
    message_id: number;
    text?: string;
    from: ITelegramUser;
}

const defaultPromoteMemberParams: IPromoteMemberOptionalParams = {
    canChangeInfo: false,
    canDeleteMessages: false,
    canEditMessages: false,
    canInviteUsers: false,
    canPinMessages: false,
    canPostMessages: true,
    canPromoteMembers: false,
    canRestrictMembers: false
}

export class CommandsManager
{
    private transportConnection: TransportConnection;
    private chatId: string;

    constructor(accessToken: string, chatId: string)
    {
        this.transportConnection = new TransportConnection(accessToken);
        this.chatId = chatId;
    }

    public async promoteChatMember(
        userId: number, optionalParams: IPromoteMemberOptionalParams = defaultPromoteMemberParams): Promise<boolean>
    {
        /* eslint-disable @typescript-eslint/camelcase */
        const options = {
            chat_id: this.chatId,
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
        /* eslint-enable @typescript-eslint/camelcase */

        return await this.transportConnection.sendCommand(
            'promoteChatMember',
            options
        ) as Promise<boolean>
    }

    public async demoteChatMember(userId: number): Promise<boolean>
    {
        /* eslint-disable @typescript-eslint/camelcase */
        const options = {
            chat_id: this.chatId,
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
        /* eslint-enable @typescript-eslint/camelcase */

        return await this.transportConnection.sendCommand(
            'promoteChatMember',
            options
        ) as Promise<boolean>;
    }

    public async getChatAdministrators(): Promise<IChatMember[]>
    {
        /* eslint-disable @typescript-eslint/camelcase */
        const response = await this.transportConnection.sendCommand<IGetChatAdministratorsRequest>(
            'getChatAdministrators',
            {chat_id: this.chatId}
        )
        /* eslint-enable @typescript-eslint/camelcase */
        return (response as IGetChatAdministratorsResponse).result;
    }

    public async getUpdates(offset?: number): Promise<ITelegramUpdate[]>
    {
        console.log(`offset = ${offset}`);
        let options = {}
        if (offset)
        {
            options = {
                offset: offset
            };
        }
        const res = await this.transportConnection.sendCommand(
            'getUpdates',
            options
        );

        return (res as IGetUpdatesResponse).result as ITelegramUpdate[];
    }

    public async sendMessage(userId: number, text: string): Promise<void>
    {
        /* eslint-disable @typescript-eslint/camelcase */
        const options = {
            chat_id: userId,
            text: text
        }
        /* eslint-enable @typescript-eslint/camelcase */
        await this.transportConnection.sendCommand(
            'sendMessage',
            options
        );
    }

}