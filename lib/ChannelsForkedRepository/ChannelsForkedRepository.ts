import {ESignal, TChannel} from '../types';

import {
  IChannelsForkedRepository,
  IPlayCommercialOptions,
  IFollowersOnlyOptions,
  IMarkerOptions,
  TChannelTargetedCommand,
} from './types';

import SharedForkedRepository, {
  TPlaceCommand,
  TUserCommand,
} from '../SharedForkedRepository';

const {Join, Message} = ESignal;

class ChannelsForkedRepository extends SharedForkedRepository<TChannel>
  implements IChannelsForkedRepository {

  public join = () => this.socket.send(`${Join} #${this.place}`);

  public say = (message: string) => {
    this.socket.send(`${Message} #${this.place} :${message}`);
  };

  public followersOnly = {
    ...this.createModeController('/followers'),
    enable: ({duration} = {} as IFollowersOnlyOptions) => {
      const message = '/followers' + (duration ? ` ${duration}` : '');

      this.say(message);
    },
  };

  public deleteMessage = (id: string) => this.say(`/delete ${id}`);

  public playCommercial = ({duration} = {} as IPlayCommercialOptions) => {
    if (duration && duration < 0) {
      throw new Error('Duration must be more than 0');
    }

    const message = '/commercial' + (duration ? ` ${duration}` : '');
    this.say(message);
  };

  public marker = ({comment} = {} as IMarkerOptions) => {
    const message = '/marker' + (comment ? ` ${comment}` : '');
    this.say(message);
  };

  public host: TChannelTargetedCommand = channel => this.say(`/host ${channel}`);
  public unhost: TPlaceCommand = () => this.say('/unhost');

  public raid: TChannelTargetedCommand = channel => this.say(`/raid ${channel}`);
  public unraid: TPlaceCommand = () => this.say('/unraid');

  public mod: TUserCommand = user => this.say(`/mod ${user}`);
  public unmod: TUserCommand = user => this.say(`/unmod ${user}`);

  public vip: TUserCommand = user => this.say(`/vip ${user}`);
  public unvip: TUserCommand = user => this.say(`/unvip ${user}`);

  public clear: TPlaceCommand = () => this.say('/clear');
}

export default ChannelsForkedRepository;
