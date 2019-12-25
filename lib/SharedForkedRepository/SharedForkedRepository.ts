import {
  ISharedForkedRepository,
  IPlaceModeController,
  ITimeoutOptions,
  IWhisperOptions,
  ISlowmodeOptions,
} from './types';
import {TPlace} from '../types';
import {ISocket} from '../Socket';

abstract class SharedForkedRepository<P extends TPlace>
  implements ISharedForkedRepository {
  protected socket: ISocket;
  protected place: P;

  public constructor(socket: ISocket, place: P) {
    this.socket = socket;
    this.place = place;
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

  public abstract say(message: string): void;
  public abstract join(): void;

  public ban = (user: string) => this.say(`/ban ${user}`);
  public unban = (user: string) => this.say(`/unban ${user}`);

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

export default SharedForkedRepository;
