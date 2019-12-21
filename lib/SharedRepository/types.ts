import {TPlace} from '../types';

export type TUserCommand<Place extends TPlace> = (user: string, place?: Place) => void;
export type TPlaceCommand<Place extends TPlace> = (place?: Place) => void;
export type TPlaceTargetedCommand<Place extends TPlace> = (target: string, channel?: Place) => void;

export interface IPlaceModeController<Place extends TPlace> {
  enable: TPlaceCommand<Place>;
  disable: TPlaceCommand<Place>;
}

export interface ITimeoutOptions<Place extends TPlace> {
  user: string;
  duration?: string;
  reason?: string;
  place?: Place;
}

export interface ISlowmodeOptions<Place extends TPlace> {
  duration?: number;
  place?: Place;
}

export interface IWhisperOptions<Place extends TPlace> {
  user: string;
  message: string;
  place?: Place;
}

export interface ISharedRepository<Place extends TPlace> {
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
  emoteOnly: IPlaceModeController<Place>;

  /**
   * R9K mode.
   */
  r9k: IPlaceModeController<Place>;

  /**
   * Slowmode.
   */
  slowmode: {
    enable(options?: ISlowmodeOptions<Place>): void;
    disable: TPlaceCommand<Place>;
  };

  /**
   * Clears chat.
   */
  clear: TPlaceCommand<Place>;

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