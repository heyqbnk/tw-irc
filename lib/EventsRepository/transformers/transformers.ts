import { ESignal } from '../../types';
import { TEventTransformersMap } from '../types';

import { clearChatTransformer } from './clear-chat';
import { clearMessageTransformer } from './clear-message';
import { globalUserStateTransformer } from './global-user-state';
import { hostTransformer } from './host';
import { joinTransformer } from './join';
import { leaveTransformer } from './leave';
import { messageTransformer } from './message';
import { roomStateTransformer } from './room-state';
import { userNoticeTransformer } from './user-notice';
import { userStateTransformer } from './user-state';
import { noticeTransformer } from './notice';

/**
 * Map of transformers, which parses message for IRC to listener's
 * understandable format.
 * @type {{}}
 */
const transformers: TEventTransformersMap = {
  [ESignal.ClearChat]: clearChatTransformer,
  [ESignal.ClearMessage]: clearMessageTransformer,
  [ESignal.GlobalUserState]: globalUserStateTransformer,
  [ESignal.Host]: hostTransformer,
  [ESignal.Join]: joinTransformer,
  [ESignal.Leave]: leaveTransformer,
  [ESignal.Message]: messageTransformer,
  [ESignal.Notice]: noticeTransformer,
  [ESignal.Reconnect]: () => undefined,
  [ESignal.RoomState]: roomStateTransformer,
  [ESignal.UserNotice]: userNoticeTransformer,
  [ESignal.UserState]: userStateTransformer,
};

export default transformers;