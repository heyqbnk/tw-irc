// tslint:disable:max-line-length
import { ESignal } from '../../../types';
import {
  TEventTransformer,
  IRoomStateMetaParsed,
  IRoomStateMeta,
} from '../types';

import { getChannel, isDefined } from '../utils';

/**
 * Transformer for ROOMSTATE
 * @param {string} _
 * @param {IParsedIRCMessage} message
 * @returns {{followersOnly?: boolean | number; slow?: number; r9k?: boolean; channel: string; raw: string; subsOnly?: boolean; rituals?: boolean; emoteOnly?: boolean; roomId: number}}
 */
export const roomStateTransformer: TEventTransformer<ESignal.RoomState> =
  (_, message) => {
    const rawMeta = message.meta as unknown as IRoomStateMetaParsed;
    const {
      followersOnly,
      slow,
      roomId,
    } = rawMeta;
    const booleanFields = ['emoteOnly', 'r9k', 'subsOnly', 'rituals'];
    const meta = booleanFields
      .reduce<IRoomStateMeta>((acc, item) => {
        const value = rawMeta[item];

        if (isDefined(value)) {
          acc[item] = Boolean(value);
        }

        return acc;
      }, { roomId } as IRoomStateMeta);
    if (followersOnly !== undefined) {
      meta.followersOnly = followersOnly > 0
        ? followersOnly
        : (followersOnly === 0);
    }

    if (isDefined(slow)) {
      meta.slow = slow;
    }

    return { channel: getChannel(message), ...meta, raw: message.raw };
  };
