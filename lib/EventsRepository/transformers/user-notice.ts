import {ESignal} from '../../types';
import {
  TEventTransformersMap,
  IUserNoticeMeta,
  IUserNoticeMetaPrepared,
} from '../types';

import {convertToArray, getChannel} from '../utils';
import {removeDeprecatedData} from './utils';

/**
 * Transformer for USERNOTICE
 * @param {string} _
 * @param {IParsedIRCMessage} message
 * @returns {{color: string | null; displayName: string | null; bits?: string; flags: any[] | null; channel: string; messageId: EUserNoticeMessageId; raw: string; login: string; message: string; userId: number; roomId: string; systemMessageId: string; badges: IBadge[]; emotes: IEmote[]; badgeInfo: IBadge | null; id: string; timestamp: number}}
 */
export const userNoticeTransformer: TEventTransformersMap[ESignal.UserNotice] =
  (_, message) => {
    // Remove deprecated data.
    const {
      tmiSentTs,
      flags,
      badges,
      emotes,
      ...restParsedMeta
    } = removeDeprecatedData(message.meta as unknown as IUserNoticeMeta);
    const meta: IUserNoticeMetaPrepared = {
      ...restParsedMeta,
      // Dont return null values, in case, an Array must be there. Is a better
      // practice to return an empty array instead of null here.
      badges: convertToArray(badges),
      emotes: convertToArray(emotes),
      flags: convertToArray(flags),
    };

    return {
      ...meta,
      channel: getChannel(message),
      timestamp: tmiSentTs,
      raw: message.raw,
    };
  };