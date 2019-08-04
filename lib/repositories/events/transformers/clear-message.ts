import { ESignal } from '../../../types';
import { TEventTransformersMap, IClearMessageMeta } from '../types';

import { getChannel } from '../utils';

/**
 * Transformer for CLEARMSG
 * @param _
 * @param {IParsedIRCMessage} message
 */
export const clearMessageTransformer:
  TEventTransformersMap[ESignal.ClearMessage] = (_, message) => {
  const meta = message.meta as unknown as IClearMessageMeta;

  return {
    channel: getChannel(message),
    targetMessageId: meta.targetMsgId,
    message: message.data,
    messageAuthor: meta.login,
    raw: message.raw,
  };
};
