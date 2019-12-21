import {ESignal, IRoom, TChannel} from '../../types';
import {
  IGlobalUserStateMetaPrepared,
  IMessageMetaPrepared, INoticeMeta,
  IRoomStateMeta,
  IUserNoticeMetaPrepared,
  IUserStateMetaPrepared,
} from './meta';

type TRoomable<Params> = Params
  & ICoreEventParams
  & ({channel: TChannel} | {room: IRoom});

export interface ICoreEventParams {
  raw: string;
}

export interface IDefaultChannelEventParams extends ICoreEventParams {
  channel: string;
}

// CLEARCHAT
export interface IBanEventParams extends IDefaultChannelEventParams {
  bannedUser: string;
  banDuration: number;
  bannedUserId: number;
  roomId: number;
  tmiSentTs: number;
}

export interface IClearChatEventParams extends IDefaultChannelEventParams {
  roomId: number;
  timestamp: number;
}

export type TClearChatEventParams = IBanEventParams | IClearChatEventParams;

// CLEARMSG
export interface IClearMessageEventParams extends IDefaultChannelEventParams {
  targetMessageId: string;
  messageAuthor: string;
  message: string;
}

// GLOBALUSERSTATE
interface IGlobalUserStateEventParams extends IGlobalUserStateMetaPrepared {
}

// HOSTTARGET
export interface IHostStartEventParams extends ICoreEventParams {
  hostingChannel: string;
  targetChannel: string;
  viewersCount: number;
}

export interface IHostStopEventParams extends ICoreEventParams {
  hostingChannel: string;
  viewersCount: number;
}

export type THostEventParams = IHostStartEventParams | IHostStopEventParams;

// JOIN
export type TJoinEventParams = TRoomable<{joinedUser: string; isSelf: boolean}>;

// NOTICE
export type TNoticeEventParams = TRoomable<INoticeMeta>;

// PART
export interface ILeaveEventParams extends IDefaultChannelEventParams {
  leftUser: string;
}

// PRIVMSG
export type TMessageEventParams = TRoomable<{
  message: string;
  author: string;
  timestamp: number;
  isSelf: boolean;
} & IMessageMetaPrepared>;

// ROOMSTATE
type TRoomStateEventParams = TRoomable<IRoomStateMeta>;

// USERNOTICE
interface IUserNoticeEventParams extends IDefaultChannelEventParams, IUserNoticeMetaPrepared {
  timestamp: number;
}

// USERSTATE
type TUserStateEventParams = TRoomable<IUserStateMetaPrepared>;

export interface IEventParams {
  [ESignal.ClearChat]: TClearChatEventParams;
  [ESignal.ClearMessage]: IClearMessageEventParams;
  [ESignal.GlobalUserState]: IGlobalUserStateEventParams;
  [ESignal.Host]: THostEventParams;
  [ESignal.Join]: TJoinEventParams;
  [ESignal.Leave]: ILeaveEventParams;
  [ESignal.Message]: TMessageEventParams;
  [ESignal.Notice]: TNoticeEventParams;
  [ESignal.Reconnect]: void;
  [ESignal.RoomState]: TRoomStateEventParams;
  [ESignal.UserNotice]: IUserNoticeEventParams;
  [ESignal.UserState]: TUserStateEventParams;
}

export type TTransformableEvent = keyof IEventParams;