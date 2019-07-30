import { IEventParams, EIRCCommand } from '../../types';
import { IParsedIRCMessage } from '../../utils';

function getChannel(message: IParsedIRCMessage) {
  return message.parameters[0].slice(1);
}

function joinChannelTransformer(
  message: IParsedIRCMessage,
): IEventParams[EIRCCommand.JoinChannel] {
  return { channel: getChannel(message), user: message.prefix.user };
}

const leaveChannelTransformer = joinChannelTransformer;

function messageTransformer(
  message: IParsedIRCMessage,
): IEventParams[EIRCCommand.Message] {
  return {
    channel: getChannel(message),
    message: message.data,
    user: message.prefix.user,
    userInfo: message.meta,
  };
}

export {
  getChannel,
  joinChannelTransformer,
  messageTransformer,
  leaveChannelTransformer,
};
