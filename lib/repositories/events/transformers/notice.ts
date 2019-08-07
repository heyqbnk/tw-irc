import { IEventParams, INoticeMeta, TEventTransformersMap } from '../types';
import { ESignal } from '../../../types';
import { getPlaceData } from '../utils';

export const noticeTransformer: TEventTransformersMap[ESignal.Notice] =
  (_, message) => {
    const result = {
      ...getPlaceData(message),
      message: message.data,
      raw: message.raw,
    } as IEventParams[ESignal.Notice];

    if (message.meta) {
      result.messageId = (message.meta as unknown as INoticeMeta).msgId;
    }

    return result;
  };
