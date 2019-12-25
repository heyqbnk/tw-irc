import {
  ISharedRepository,
  TUserCommand,
  TPlaceCommand,
  IPlaceModeController,
  ITimeoutOptions,
  IWhisperOptions, ISlowmodeOptions,
} from './types';
import {TPlace} from '../types';
import {ISocket} from '../Socket';

abstract class SharedRepository<P extends TPlace>
  implements ISharedRepository<P> {
  protected socket: ISocket;

  public constructor(socket: ISocket) {
    this.socket = socket;
  }

  /**
   * User-oriented commands generator.
   * @param {string} command
   * @returns {TUserCommand}
   */
  protected createUserCommand = (command: string): TUserCommand<P> => {
    return (user, place) => this.say(`${command} ${user}`, place);
  };

  /**
   * Channel-oriented commands generator
   * @param command
   */
  protected createChannelCommand = (command: string): TPlaceCommand<P> => {
    return place => this.say(command, place);
  };

  /**
   * Mode-oriented commands generator.
   * @param {string} mode
   * @returns {{off: (channel?: string) => void;
   * on: (channel?: string) => void}}
   */
  protected createModeController = (
    mode: string,
  ): IPlaceModeController<P> => ({
    enable: place => this.say(mode, place),
    disable: place => this.say(`${mode}off`, place),
  });

  public abstract say(message: string, place: P): void;

  public abstract join(place: P): void;

  public ban = this.createUserCommand('/ban');

  public unban = this.createUserCommand('/unban');

  public timeout = (options: ITimeoutOptions<P>) => {
    const {user, duration, reason, place} = options;
    const message = ['/timeout', user];

    if (duration) {
      message.push(duration);
    }

    if (reason) {
      message.push(reason);
    }

    this.say(message.join(' '), place);
  };

  public untimeout = this.createUserCommand('/untimeout');

  public whisper = (options: IWhisperOptions<P>) => {
    const {user, message, place} = options;
    this.say(`/w ${user} ${message}`, place);
  };

  public disconnect = this.createChannelCommand('/disconnect');

  public emoteOnly = this.createModeController('/emoteonly');

  public r9k = this.createModeController('/r9kbeta');

  public slowmode = {
    ...this.createModeController('/slow'),
    enable: (options: ISlowmodeOptions<P>) => {
      const {duration, place} = options;

      if (duration && duration < 0) {
        throw new Error('Duration must be more than 0');
      }

      const message = '/slow' + (duration ? ` ${duration}` : '');
      this.say(message, place);
    },
  };

  public me(action: string, place: P) {
    this.say(`/me ${action}`, place);
  };

  public changeColor(color: string, place: P) {
    this.say(`/color ${color}`, place);
  };
}

export default SharedRepository;
