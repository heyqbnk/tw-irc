import { EIRCCommand, TMeta } from '../../../types';

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

export interface IEventParams {
  [EIRCCommand.JoinChannel]: IJoinChannelEventParams;
  [EIRCCommand.LeaveChannel]: IJoinChannelEventParams;
  [EIRCCommand.Message]: IMessageEventParams;
}
