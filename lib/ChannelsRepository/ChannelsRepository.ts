import {
  IChannelsRepository,
  IPlayCommercialOptions,
  IFollowersOnlyOptions,
  IMarkerOptions,
  TTargetedCommand,
} from './types';
import {ESignal, TChannel} from '../types';

import SharedRepository from '../SharedRepository';

const {Join, Message} = ESignal;

class ChannelsRepository extends SharedRepository<TChannel>
  implements IChannelsRepository {

  public join = (channel: TChannel) => this.socket.send(`${Join} #${channel}`);

  public say = (message: string, channel: TChannel) => {
    this.socket.send(`${Message} #${channel} :${message}`);
  };

  public followersOnly = {
    ...this.createModeController('/followers'),
    enable: ({duration, channel}: IFollowersOnlyOptions) => {
      const message = '/followers' + (duration ? ` ${duration}` : '');

      this.say(message, channel);
    },
  };

  public deleteMessage = (id: string, channel: TChannel) => {
    this.say(`/delete ${id}`, channel);
  };

  public playCommercial = ({duration, channel}: IPlayCommercialOptions) => {
    if (duration && duration < 0) {
      throw new Error('Duration must be more than 0');
    }

    const message = '/commercial' + (duration ? ` ${duration}` : '');
    this.say(message, channel);
  };

  public host: TTargetedCommand = (targetChannel, channel) => {
    this.say(`/host ${targetChannel}`, channel);
  };
  public unhost = this.createChannelCommand('/unhost');

  public raid: TTargetedCommand = (targetChannel, channel) => {
    this.say(`/raid ${targetChannel}`, channel);
  };
  public unraid = this.createChannelCommand('/unraid');

  public marker = ({channel, comment}: IMarkerOptions) => {
    const message = '/marker' + (comment ? ` ${comment}` : '');
    this.say(message, channel);
  };

  public mod = this.createUserCommand('/mod');
  public unmod = this.createUserCommand('/unmod');

  public vip = this.createUserCommand('/vip');
  public unvip = this.createUserCommand('/unvip');

  public clear = this.createChannelCommand('/clear');
}

export default ChannelsRepository;
