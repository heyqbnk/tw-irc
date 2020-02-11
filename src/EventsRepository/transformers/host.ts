import {IHostMessage} from '../types';
import {IParsedMessage} from '../../types';

function host(message: IParsedMessage): IHostMessage {
  const [channel, numberOfViewersStr] = (message.message as string).split(' ');
  const viewers = Number(numberOfViewersStr);

  return {
    parsedMessage: message,
    channel,
    hostingChannel: message.channel as string,
    numberOfViewers: Number.isNaN(viewers) ? null : viewers,
    isHosting: channel !== '-',
  };
}

export default host;
