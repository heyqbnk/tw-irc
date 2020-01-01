import {
  IChannelsRepository,
  IPlayCommercialOptions,
  IFollowersOnlyOptions,
  IMarkerOptions,
  IPlaceModeController,
  TUserCommand,
  TChannelCommand,
  TTargetedCommand,
  ITimeoutOptions,
  IWhisperOptions,
  ISlowmodeOptions,
} from './types';
import {ECommand} from '../types';
import {ISocket} from '../Socket';

const {Join, Message} = ECommand;

class ChannelsRepository implements IChannelsRepository {
  private socket: ISocket;

  public constructor(socket: ISocket) {
    this.socket = socket;
  }

  /**
   * User-oriented commands generator.
   * @param {string} command
   * @returns {TUserCommand}
   */
  private createUserCommand = (command: string): TUserCommand => {
    return (user, channel) => this.say(`${command} ${user}`, channel);
  };

  /**
   * Channel-oriented commands generator
   * @param command
   */
  private createChannelCommand = (command: string): TChannelCommand => {
    return channel => this.say(command, channel);
  };

  /**
   * Mode-oriented commands generator.
   * @param {string} mode
   * @returns {{off: (channel?: string) => void;
   * on: (channel?: string) => void}}
   */
  private createModeController = (
    mode: string,
  ): IPlaceModeController => ({
    enable: channel => this.say(mode, channel),
    disable: channel => this.say(`${mode}off`, channel),
  });

  public join = (channel: string) => {
    this.socket.send(`${Join} #${channel.toLowerCase()}`);
  };

  public say = (message: string, channel: string) => {
    this.socket.send(`${Message} #${channel} :${message}`);
  };

  public followersOnly = {
    ...this.createModeController('/followers'),
    enable: ({duration, channel}: IFollowersOnlyOptions) => {
      const message = '/followers' + (duration ? ` ${duration}` : '');

      this.say(message, channel);
    },
  };

  public deleteMessage = (id: string, channel: string) => {
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

  public ban = this.createUserCommand('/ban');

  public unban = this.createUserCommand('/unban');

  public timeout = (options: ITimeoutOptions) => {
    const {user, duration, reason, channel} = options;
    const message = ['/timeout', user];

    if (duration) {
      message.push(duration);
    }

    if (reason) {
      message.push(reason);
    }

    this.say(message.join(' '), channel);
  };

  public untimeout = this.createUserCommand('/untimeout');

  public whisper = (options: IWhisperOptions) => {
    const {user, message, channel} = options;
    this.say(`/w ${user} ${message}`, channel);
  };

  public disconnect = this.createChannelCommand('/disconnect');

  public emoteOnly = this.createModeController('/emoteonly');

  public r9k = this.createModeController('/r9kbeta');

  public slowmode = {
    ...this.createModeController('/slow'),
    enable: (options: ISlowmodeOptions) => {
      const {duration, channel} = options;

      if (duration && duration < 0) {
        throw new Error('Duration must be more than 0');
      }

      const message = '/slow' + (duration ? ` ${duration}` : '');
      this.say(message, channel);
    },
  };

  public me(action: string, channel: string) {
    this.say(`/me ${action}`, channel);
  };

  public changeColor(color: string, channel: string) {
    this.say(`/color ${color}`, channel);
  };
}

export default ChannelsRepository;
