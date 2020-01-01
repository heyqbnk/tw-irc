import {TEventTransformers} from '../types';
import {ECommand} from '../../types';

import clearChat from './clearChat';
import clearMessage from './clearMessage';
import globalUserState from './globalUserState';
import host from './host';
import join from './join';
import message from './message';
import notice from './notice';
import userNotice from './userNotice';
import roomState from './roomState';
import userState from './userState';

const transformers: TEventTransformers = {
  [ECommand.ClearChat]: clearChat,
  [ECommand.ClearMessage]: clearMessage,
  [ECommand.GlobalUserState]: globalUserState,
  [ECommand.Host]: host,
  [ECommand.Join]: join,
  [ECommand.Leave]: join,
  [ECommand.Message]: message,
  [ECommand.Notice]: notice,
  [ECommand.Reconnect]: message => message,
  [ECommand.RoomState]: roomState,
  [ECommand.UserNotice]: userNotice,
  [ECommand.UserState]: userState,
};

export default transformers;
