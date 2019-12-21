import {
  ISharedRepository,
  TUserCommand,
  IPlaceModeController,
  TPlaceCommand,
  ITimeoutOptions,
  IWhisperOptions, ISlowmodeOptions,
} from './types';
import {TPlace} from '../types';

abstract class SharedRepository<Place extends TPlace>
  implements ISharedRepository<Place> {
  /**
   * Assigned to repository place.
   */
  protected assignedPlace: Place;

  /**
   * User-oriented commands generator.
   * @param {string} command
   * @returns {TUserCommand}
   */
  protected createUserCommand = (command: string): TUserCommand<Place> => {
    return (user, place) => this.say(`${command} ${user}`, place);
  };

  /**
   * Channel-oriented commands generator.
   * @param {string} command
   * @returns {TPlaceCommand}
   */
  protected createChannelCommand =
    (command: string): TPlaceCommand<Place> => {
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
  ): IPlaceModeController<Place> => ({
    enable: (place?) => this.say(mode, place),
    disable: (place?) => this.say(`${mode}off`, place),
  });

  public abstract say(message: string, place?: Place): void;

  public abstract join(place: Place): void;

  public ban = this.createUserCommand('/ban');

  public unban = this.createUserCommand('/unban');

  public timeout = (options: ITimeoutOptions<Place>) => {
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

  public whisper = (options: IWhisperOptions<Place>) => {
    const {user, message, place} = options;
    this.say(`/w ${user} ${message}`, place);
  };

  public disconnect = this.createChannelCommand('/disconnect');

  public emoteOnly = this.createModeController('/emoteonly');

  public r9k = this.createModeController('/r9kbeta');

  public slowmode = {
    ...this.createModeController('/slow'),
    enable: (options: ISlowmodeOptions<Place> = {}) => {
      const {duration, place} = options;

      if (duration && duration < 0) {
        throw new Error('Duration must be more than 0');
      }

      const message = '/slow' + (duration ? ` ${duration}` : '');
      this.say(message, place);
    },
  };

  public clear = this.createChannelCommand('/clear');

  public me = (action: string, place?: Place) => {
    this.say(`/me ${action}`, place);
  };

  public changeColor = (color: string, place?: Place) => {
    this.say(`/color ${color}`, place);
  };

  public assign = (place: Place) => this.assignedPlace = place;
}

export default SharedRepository;