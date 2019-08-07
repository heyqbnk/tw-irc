// tslint:disable:max-line-length
import { ESignal } from '../../../types';
import {
  TEventTransformersMap,
  IUserStateMeta,
  IUserStateMetaPrepared,
} from '../types';

import { convertToArray, getPlaceData } from '../utils';

/**
 * Transformer for USERSTATE
 * @param {string} _
 * @param {IParsedIRCMessage} message
 * @returns {{color: string | null; displayName: string | null; bits?: string; flags: any[] | null; channel: string; messageId: EUserNoticeMessageId; raw: string; login: string; message: string; userId: number; roomId: string; systemMessageId: string; badges: IBadge[]; emotes: IEmote[]; badgeInfo: IBadge | null; id: string; timestamp: number}}
 */
export const userStateTransformer: TEventTransformersMap[ESignal.UserState] =
  (_, message) => {
    // Remove deprecated data.
    const {
      subscriber,
      mod,
      turbo,
      userType,
      badges,
      emoteSets,
      ...restParsedMeta
    } = message.meta as unknown as IUserStateMeta;
    const meta: IUserStateMetaPrepared = {
      ...restParsedMeta,
      // Dont return null values, in case, an Array must be there. Is a better
      // practice to return an empty array instead of null here.
      badges: convertToArray(badges),
      emoteSets: convertToArray(emoteSets),
    };

    return {
      ...meta,
      ...getPlaceData(message),
      raw: message.raw,
    };
  };
