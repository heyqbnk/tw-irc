import {ECommand} from '../types';

import {
  IChannelsForkedRepository,
  IPlayCommercialOptions,
  IFollowersOnlyOptions,
  IMarkerOptions,
  TTargetedCommand,
  TChannelCommand,
  TUserCommand,
  IPlaceModeController,
  IWhisperOptions,
  ISlowmodeOptions,
  ITimeoutOptions,
} from './types';
import {ISocket} from '../Socket';

const {Join, Message} = ECommand;

class ChannelsForkedRepository implements IChannelsForkedRepository {
  private socket: ISocket;
  private readonly channel: string;

  public constructor(socket: ISocket, channel: string) {
    this.socket = socket;
    this.channel = channel;
  }

  /**
   * Mode-oriented commands generator.
   * @param {string} mode
   * @returns {{off: (channel?: string) => void;
   * on: (channel?: string) => void}}
   */
  protected createModeController = (mode: string): IPlaceModeController => ({
    enable: () => this.say(mode),
    disable: () => this.say(`${mode}off`),
  });

  public join = () => this.socket.send(`${Join} #${this.channel}`);

  public say = (message: string) => {
    this.socket.send(`${Message} #${this.channel} :${message}`);
  };

  public ban = (user: string) => this.say(`/ban ${user}`);
  public unban = (user: string) => this.say(`/unban ${user}`);

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

  public host: TTargetedCommand = channel => this.say(`/host ${channel}`);
  public unhost: TChannelCommand = () => this.say('/unhost');

  public raid: TTargetedCommand = channel => this.say(`/raid ${channel}`);
  public unraid: TChannelCommand = () => this.say('/unraid');

  public mod: TUserCommand = user => this.say(`/mod ${user}`);
  public unmod: TUserCommand = user => this.say(`/unmod ${user}`);

  public vip: TUserCommand = user => this.say(`/vip ${user}`);
  public unvip: TUserCommand = user => this.say(`/unvip ${user}`);

  public clear: TChannelCommand = () => this.say('/clear');

  public untimeout = (user: string) => this.say(`/untimeout ${user}`);
  public timeout = ({user, duration, reason}: ITimeoutOptions) => {
    const message = ['/timeout', user];

    if (duration) {
      message.push(duration);
    }

    if (reason) {
      message.push(reason);
    }

    this.say(message.join(' '));
  };

  public whisper = ({user, message}: IWhisperOptions) => {
    this.say(`/w ${user} ${message}`);
  };

  public disconnect = () => this.say('/disconnect');

  public emoteOnly = this.createModeController('/emoteonly');

  public r9k = this.createModeController('/r9kbeta');

  public slowmode = {
    ...this.createModeController('/slow'),
    enable: ({duration} = {} as ISlowmodeOptions) => {
      if (duration && duration < 0) {
        throw new Error('Duration must be more than 0');
      }

      const message = '/slow' + (duration ? ` ${duration}` : '');
      this.say(message);
    },
  };

  public me = (action: string) => this.say(`/me ${action}`);
  public changeColor = (color: string) => this.say(`/color ${color}`);
}

export default ChannelsForkedRepository;
