import { ESignal } from '../../../types';
import {
  EUserNoticeMessageId,
  IGlobalUserStateMetaPrepared,
  IMessageMetaPrepared,
  IRoomStateMeta,
  IUserNoticeMetaPrepared, IUserStateMetaPrepared,
} from './meta';

interface IRoom {
  channelId: string;
  roomUuid: string;
}

type TRoomable<Params> = Params
  & ICoreEventsParams
  & ({ channel: string } | { room: IRoom });

interface ICoreEventsParams {
  raw: string;
}

interface IDefaultChannelEventParams extends ICoreEventsParams {
  channel: string;
}

// CLEARCHAT
interface IBanEventParams extends IDefaultChannelEventParams {
  bannedUser: string;
  banDuration: number;
  bannedUserId: number;
  roomId: number;
  timestamp: number;
}

interface IClearChatEventParams extends IDefaultChannelEventParams {
  roomId: number;
  timestamp: number;
}

type TClearChatEventParams = IBanEventParams | IClearChatEventParams;

// CLEARMSG
interface IClearMessageEventParams extends IDefaultChannelEventParams {
  targetMessageId: string;
  messageAuthor: string;
  message: string;
}

// GLOBALUSERSTATE
interface IGlobalUserStateEventParams extends IGlobalUserStateMetaPrepared {
}

// HOSTTARGET
export interface IHostStartEventParams extends ICoreEventsParams {
  hostingChannel: string;
  targetChannel: string;
  viewersCount: number;
}

export interface IHostStopEventParams extends ICoreEventsParams {
  hostingChannel: string;
  viewersCount: number;
}

export type THostEventParams = IHostStartEventParams | IHostStopEventParams;

// JOIN
type TJoinEventParams = TRoomable<{
  joinedUser: string;
  isSelf: boolean;
}>;

// NOTICE
type TNoticeEventParams = TRoomable<{
  messageId?: EUserNoticeMessageId;
  message: string;
}>;

// PART
interface ILeaveEventParams extends IDefaultChannelEventParams {
  leftUser: string;
}

// PRIVMSG
type TMessageEventParams = TRoomable<{
  message: string;
  author: string;
  timestamp: number;
  isSelf: boolean;
} & IMessageMetaPrepared>;

// ROOMSTATE
type TRoomStateEventParams = TRoomable<IRoomStateMeta>;

// USERNOTICE
interface IUserNoticeEventParams
  extends IDefaultChannelEventParams, IUserNoticeMetaPrepared {
  message: string;
  messageId: EUserNoticeMessageId;
  systemMessageId: string;
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
