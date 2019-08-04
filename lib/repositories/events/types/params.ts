import { ESignal } from '../../../types';
import {
  EUserNoticeMessageId,
  IGlobalUserStateMetaPrepared,
  IMessageMetaPrepared,
  IRoomStateMeta,
  IUserNoticeMetaPrepared,
} from './meta';
import { TPlace } from './utils';

interface ICoreEventsParams {
  raw: string;
}

interface IDefaultChannelEventParams extends ICoreEventsParams {
  channel: string;
}

interface IDefaultRoomEventParams extends ICoreEventsParams {
  channel: TPlace;
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
interface IJoinEventParams extends IDefaultRoomEventParams {
  joinedUser: string;
  isSelf: boolean;
}

// NOTICE
interface INoticeEventParams extends IDefaultChannelEventParams {
  messageId: EUserNoticeMessageId;
}

// PART
interface ILeaveEventParams extends IDefaultChannelEventParams {
  leftUser: string;
}

// PRIVMSG
interface IMessageEventParams
  extends IDefaultChannelEventParams, IMessageMetaPrepared {
  message: string;
  author: string;
  timestamp: number;
  isSelf: boolean;
}

// ROOMSTATE
interface IRoomStateEventParams
  extends IDefaultChannelEventParams, IRoomStateMeta {
}

// USERNOTICE
interface IUserNoticeEventParams
  extends IDefaultChannelEventParams, IUserNoticeMetaPrepared {
  message: string;
  messageId: EUserNoticeMessageId;
  systemMessageId: string;
  timestamp: number;
}

// USERSTATE
interface IUserStateEventParams extends IDefaultRoomEventParams {
}

export interface IEventParams {
  [ESignal.ClearChat]: TClearChatEventParams;
  [ESignal.ClearMessage]: IClearMessageEventParams;
  [ESignal.GlobalUserState]: IGlobalUserStateEventParams;
  [ESignal.Host]: THostEventParams;
  [ESignal.Join]: IJoinEventParams;
  [ESignal.Leave]: ILeaveEventParams;
  [ESignal.Message]: IMessageEventParams;
  [ESignal.Notice]: INoticeEventParams;
  [ESignal.Reconnect]: void;
  [ESignal.RoomState]: IRoomStateEventParams;
  [ESignal.UserNotice]: IUserNoticeEventParams;
  [ESignal.UserState]: IUserStateEventParams;
}
