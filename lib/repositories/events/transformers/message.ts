import { ESignal } from '../../../types';
import { TEventTransformersMap } from '../types';

import { getChannel, getPrefixUser } from '../utils';

/**
 * Transformer for PART
 * @param login
 * @param {IParsedIRCMessage} message
 * @returns {{channel: string; user: string}}
 */
export const leaveTransformer: TEventTransformersMap[ESignal.Leave] =
  (login, message) => {
    const leftUser = getPrefixUser(message);

    return {
      channel: getChannel(message),
      leftUser,
      isSelf: leftUser === login,
      raw: message.raw,
    };
  };
