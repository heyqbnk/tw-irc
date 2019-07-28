import { IEventParams } from '../../types/event-params';
import { IParsedIRCMessage } from '../../utils';
import { EIRCCommand } from '../../types/irc';

function getChannel(message: IParsedIRCMessage) {
  return message.parameters[0].slice(1);
}

function joinChannelTransformer(
  message: IParsedIRCMessage,
): IEventParams[EIRCCommand.JoinChannel] {
  return { channel: getChannel(message), user: message.prefix.user };
}

const leaveChannelTransformer = joinChannelTransformer;

export { getChannel, joinChannelTransformer, leaveChannelTransformer };
