import { TTransformersMap } from './types';
import { EIRCCommand } from '../../types';
import {
  joinChannelTransformer,
  messageTransformer,
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
  [EIRCCommand.Message]: messageTransformer,
};

export { transformers };
