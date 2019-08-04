import { getChannel } from '../utils';
import { ESignal } from '../../../types';
import { TEventTransformersMap, IClearChatMeta } from '../types';

/**
 * Transformer for CLEARCHAT
 * @param _
 * @param {IParsedIRCMessage} message
 * @returns {{meta: IClearChatMeta; channel: string; user: string}}
 */
export const clearChatTransformer: TEventTransformersMap[ESignal.ClearChat] =
  (_, message) => {
    const { data } = message;

    // Empty meta means no ban-duration set, which is infinite ban.
    const meta = message.meta as unknown as IClearChatMeta;
    const channel = getChannel(message);
    const {
      targetUserId,
      banDuration: metaBanDuration,
      roomId,
      tmiSentTs,
    } = meta;

    // Some user was banned.
    if (targetUserId) {
      let banDuration = Number.POSITIVE_INFINITY;

      // If ban duration doesnt exist, it means user was banned permanently.
      if (metaBanDuration) {
        banDuration = metaBanDuration;
      }

      return {
        channel,
        bannedUser: data,
        banDuration,
        bannedUserId: targetUserId,
        roomId,
        timestamp: tmiSentTs,
        raw: message.raw,
      };
    }

    return { channel, roomId, timestamp: tmiSentTs, raw: message.raw };
  };
