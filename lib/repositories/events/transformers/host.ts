import { ESignal } from '../../../types';
import { TEventTransformersMap } from '../types';

import { getChannel } from '../utils';

/**
 * Transformer for HOSTTARGET
 * @param _
 * @param {IParsedIRCMessage} message
 * @returns {{}}
 */
export const hostTransformer: TEventTransformersMap[ESignal.Host] =
  (_, message) => {
    const [targetChannel, viewersCountRaw] = message.data.split(' ');
    const viewersCount = parseInt(viewersCountRaw, 10);
    const hostingChannel = getChannel(message);
    const raw = message.raw;

    // Means, HOST stopped
    return targetChannel === '-'
      ? { hostingChannel, viewersCount, raw }
      : { hostingChannel, viewersCount, raw, targetChannel };
  };
