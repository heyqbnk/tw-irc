import {IJoinMessage} from '../types';
import {IParsedMessage} from '../../types';

function join(message: IParsedMessage): IJoinMessage {
  return {
    parsedMessage: message,
    channel: message.channel,
    user: (message.prefix as string).split('!')[0]
  };
}

export default join;
