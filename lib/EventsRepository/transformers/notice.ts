import {INoticeMeta, TEventTransformersMap} from '../types';
import {ESignal} from '../../types';
import {getPlaceData} from '../utils';

export const noticeTransformer: TEventTransformersMap[ESignal.Notice] =
  (_, message) => ({
    ...getPlaceData(message),
    msgId: (message.meta as unknown as INoticeMeta).msgId,
    message: message.data,
    raw: message.raw,
  });
