import { EIRCCommand, TMeta } from './irc';

interface IDefaultEventParams {
  channel: string;
}

interface IJoinChannelEventParams extends IDefaultEventParams {
  user: string;
}

interface IMessageEventParams extends IDefaultEventParams {
  message: string;
  user: string;
  userInfo: TMeta;
}

type TObservableEvents =
  | EIRCCommand.Message
  | EIRCCommand.JoinChannel
  | EIRCCommand.LeaveChannel;

interface IEventParams {
  [EIRCCommand.JoinChannel]: IJoinChannelEventParams;
  [EIRCCommand.LeaveChannel]: IJoinChannelEventParams;
  [EIRCCommand.Message]: IMessageEventParams;
}

export { IEventParams, TObservableEvents, IJoinChannelEventParams };
