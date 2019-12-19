export type TUserCommand<Place> =
  (user: string, place?: Place) => void;
export type TChannelCommand<Place> = (place?: Place) => void;

export interface IModeController<Place> {
  enable: TChannelCommand<Place>;
  disable: TChannelCommand<Place>;
}

interface ITimeoutOptions<Place> {
  user: string;
  duration?: string;
  reason?: string;
  place?: Place;
}

export interface ISlowmodeOptions<Place> {
  duration?: number;
  place?: Place;
}

interface IWhisperOptions<Place> {
  user: string;
  message: string;
  place?: Place;
}

export interface ISharedRepository<Place> {
  /**
   * Bans user.
   */
  ban: TUserCommand<Place>;

  /**
   * Unbans user.
   */
  unban: TUserCommand<Place>;

  /**
   * Gives user a timeout.
   * @param options
   */
  timeout(options: ITimeoutOptions<Place>): void;

  /**
   * Removes user's timeout.
   */
  untimeout: TUserCommand<Place>;

  /**
   * Whispers someone.
   * @param options
   */
  whisper(options: IWhisperOptions<Place>): void;

  /**
   * Says a message to room.
   * @param {string} message
   * @param place
   */
  say(message: string, place?: Place): void;

  /**
   * Joins channel.
   * @param options
   */
  join(options: Place): void;

  /**
   * Leaves room.
   * @param options
   */
  disconnect(options: Place): void;

  /**
   * Emote-only mode.
   */
  emoteOnly: IModeController<Place>;

  /**
   * R9K mode.
   */
  r9k: IModeController<Place>;

  /**
   * Slowmode.
   */
  slowmode: {
    enable(options?: ISlowmodeOptions<Place>): void;
    disable: TChannelCommand<Place>;
  };

  /**
   * Clears chat.
   */
  clear: TChannelCommand<Place>;

  /**
   * Says a message, looking like we did something.
   * @param {string} action
   * @param place
   */
  me(action: string, place?: Place): void;

  /**
   * Changes our chat color.
   * @param {string} color
   * @param place
   */
  changeColor(color: string, place?: Place): void;

  /**
   * Assigns place to repository
   * @param {Place} place
   */
  assign(place?: Place): void;
}

export abstract class SharedRepository<Place>
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
   * @returns {TChannelCommand}
   */
  protected createChannelCommand =
    (command: string): TChannelCommand<Place> => {
      return place => this.say(command, place);
    };

  /**
   * Mode-oriented commands generator.
   * @param {string} mode
   * @returns {{off: (channel?: string) => void;
   * on: (channel?: string) => void}}
   */
  protected createModeController = (mode: string): IModeController<Place> => ({
    enable: (place?: Place) => this.say(mode, place),
    disable: (place?: Place) => this.say(`${mode}off`, place),
  });

  public abstract say(message: string, place?: Place): void;
  public abstract join(place: Place): void;

  public ban = this.createUserCommand('/ban');

  public unban = this.createUserCommand('/unban');

  public timeout = (options: ITimeoutOptions<Place>) => {
    const { user, duration, reason, place } = options;
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
    const { user, message, place } = options;
    this.say(`/w ${user} ${message}`, place);
  };

  public disconnect = this.createChannelCommand('/disconnect');

  public emoteOnly = this.createModeController('/emoteonly');

  public r9k = this.createModeController('/r9kbeta');

  public slowmode = {
    ...this.createModeController('/slow'),
    enable: (options: ISlowmodeOptions<Place> = {}) => {
      const { duration, place } = options;

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
