import { INoticeMeta, TEventTransformersMap } from '../types';
import { ESignal } from '../../../types';
import { getChannel } from '../utils';

export const noticeTransformer: TEventTransformersMap[ESignal.Notice] =
  (_, message) => ({
    messageId: (message.meta as unknown as INoticeMeta).msgId,
    channel: getChannel(message),
    raw: message.raw,
  });
