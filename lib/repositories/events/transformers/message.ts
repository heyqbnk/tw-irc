import { ESignal } from '../../../types';
import {
  TEventTransformersMap,
  IMessageMeta,
  IMessageMetaPrepared,
} from '../types';

import { getChannel, getPrefixUser, convertToArray } from '../utils';

/**
 * Transformer for PRIVMSG
 * @param login
 * @param {IParsedIRCMessage} message
 * @returns {{meta: TMeta; channel: string; message: string; user: string}}
 */
export const messageTransformer: TEventTransformersMap[ESignal.Message] =
  (login, message) => {
    // Remove deprecated data.
    const {
      subscriber,
      mod,
      turbo,
      userType,
      tmiSentTs,
      badges,
      emotes,
      ...restParsedMeta
    } = message.meta as unknown as IMessageMeta;
    const meta: IMessageMetaPrepared = {
      ...restParsedMeta,
      // Dont return null values, in case, an Array must be there. Is a better
      // practice to return an empty array instead of null here.
      badges: convertToArray(badges),
      emotes: convertToArray(emotes),
    };
    const author = getPrefixUser(message);

    return {
      ...meta,
      channel: getChannel(message),
      message: message.data,
      author,
      timestamp: tmiSentTs,
      isSelf: author === login,
      raw: message.raw,
    };
  };
