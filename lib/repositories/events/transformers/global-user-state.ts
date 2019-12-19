// tslint:disable:max-line-length
import {ESignal} from '../../../types';
import {
  TEventTransformersMap,
  IGlobalUserStateMeta,
  IGlobalUserStateMetaPrepared,
} from '../types';

import {convertToArray} from '../utils';
import {removeDeprecatedData} from './utils';

/**
 * Transformer for GLOBALUSERSTATE
 * @param {string} _
 * @param {IParsedIRCMessage} message
 * @returns {{color: string | null; displayName: string | null; bits?: string; flags: any[] | null; channel: string; messageId: EUserNoticeMessageId; raw: string; login: string; message: string; userId: number; roomId: string; systemMessageId: string; badges: IBadge[]; emotes: IEmote[]; badgeInfo: IBadge | null; id: string; timestamp: number}}
 */
export const globalUserStateTransformer:
  TEventTransformersMap[ESignal.GlobalUserState] =
  (_, message) => {
    // Remove deprecated data.
    const {
      badges,
      emoteSets,
      ...restParsedMeta
    } = removeDeprecatedData(message.meta as unknown as IGlobalUserStateMeta);
    const meta: IGlobalUserStateMetaPrepared = {
      ...restParsedMeta,
      // Dont return null values, in case, an Array must be there. Is a better
      // practice to return an empty array instead of null here.
      badges: convertToArray(badges),
      emoteSets: convertToArray(emoteSets),
    };

    return {
      ...meta,
      raw: message.raw,
    };
  };
