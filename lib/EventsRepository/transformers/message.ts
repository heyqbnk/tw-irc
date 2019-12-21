import {ESignal} from '../../types';
import {
  TEventTransformersMap,
  IMessageMeta,
  IMessageMetaPrepared,
} from '../types';

import {getPrefixUser, convertToArray, getPlaceData} from '../utils';
import {removeDeprecatedData} from './utils';

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
      tmiSentTs,
      badges,
      emotes,
      flags,
      ...restParsedMeta
    } = removeDeprecatedData(message.meta as unknown as IMessageMeta);
    const meta: IMessageMetaPrepared = {
      ...restParsedMeta,
      // Dont return null values, in case, an Array must be there. Is a better
      // practice to return an empty array instead of null here.
      badges: convertToArray(badges),
      emotes: convertToArray(emotes),
      flags: convertToArray(flags),
    };
    const author = getPrefixUser(message);

    return {
      ...meta,
      ...getPlaceData(message),
      message: message.data,
      author,
      timestamp: tmiSentTs,
      isSelf: author === login,
      raw: message.raw,
    };
  };
