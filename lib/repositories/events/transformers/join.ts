import { ESignal } from '../../../types';
import { TEventTransformersMap } from '../types';

import { getPlaceData, getPrefixUser } from '../utils';

/**
 * Transformer for JOIN
 * @param login
 * @param {IParsedIRCMessage} message
 * @returns {{user: string}}
 */
export const joinTransformer: TEventTransformersMap[ESignal.Join] =
  (login, message) => {
    const place = getPlaceData(message);
    const joinedUser = getPrefixUser(message);

    return {
      channel: place,
      joinedUser,
      isSelf: joinedUser === login,
      raw: message.raw,
    };
  };
