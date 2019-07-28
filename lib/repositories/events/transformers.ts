import { TTransformersMap } from './types';
import { EIRCCommand } from '../../types/irc';
import {
  getChannel,
  joinChannelTransformer,
  leaveChannelTransformer,
} from './utils';

/**
 * Map of transformers, which parses message for IRC to listener's
 * understandable format.
 * @type {{}}
 */
const transformers: TTransformersMap = {
  [EIRCCommand.JoinChannel]: joinChannelTransformer,
  [EIRCCommand.LeaveChannel]: leaveChannelTransformer,
  [EIRCCommand.Message]: message => ({
    channel: getChannel(message),
    message: message.data,
    user: message.prefix.user,
    userInfo: message.meta,
  }),
};

export { transformers };
