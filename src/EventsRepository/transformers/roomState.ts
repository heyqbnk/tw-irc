import {IRoomstateMessage} from '../types';
import {IMeta, IParsedMessage} from '../../types';

function roomState(message: IParsedMessage): IRoomstateMessage {
  const meta = message.meta as IMeta;

  return {
    parsedMessage: message,
    channel: message.channel as string,
    emoteOnly: meta.emoteOnly as boolean,
    followersOnly: meta.followersOnly as number,
    r9k: meta.r9k as boolean,
    slow: meta.slow as number,
    subsOnly: meta.subsOnly as boolean,
  };
}

export default roomState;
