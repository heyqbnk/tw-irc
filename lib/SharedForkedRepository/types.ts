import {TPlace} from '../types';

export type TUserCommand<P extends TPlace> = (user: string, place: P) => void;
export type TPlaceCommand<P extends TPlace> = (place: P) => void;
export type TPlaceTargetedCommand<P extends TPlace> = (channel: string, place: P) => void;

export interface IPlaceModeController<P extends TPlace> {
  enable: TPlaceCommand<P>;
  disable: TPlaceCommand<P>;
}

export interface ITimeoutOptions<P extends TPlace> {
  user: string;
  duration?: string;
  reason?: string;
  place: P;
}

export interface ISlowmodeOptions<P extends TPlace> {
  duration?: number;
  place: P;
}

export interface IWhisperOptions<P extends TPlace> {
  user: string;
  message: string;
  place: P;
}

export interface ISharedRepository<P extends TPlace> {
  /**
   * Bans user.
   */
  ban: TUserCommand<P>;
  /**
   * Unbans user.
   */
  unban: TUserCommand<P>;
  /**
   * Gives user a timeout.
   * @param options
   */
  timeout(options: ITimeoutOptions<P>): void;
  /**
   * Removes user's timeout.
   */
  untimeout: TUserCommand<P>;
  /**
   * Whispers someone.
   * @param options
   */
  whisper(options: IWhisperOptions<P>): void;
  /**
   * Says a message to room.
   * @param {string} message
   * @param place
   */
  say(message: string, place: P): void;
  /**
   * Joins channel.
   * @param place
   */
  join(place: P): void;
  /**
   * Leaves room.
   * @param place
   */
  disconnect(place: P): void;
  /**
   * Emote-only mode.
   */
  emoteOnly: IPlaceModeController<P>;
  /**
   * R9K mode.
   */
  r9k: IPlaceModeController<P>;
  /**
   * Slowmode.
   */
  slowmode: {
    enable(options?: ISlowmodeOptions<P>): void;
    disable: TPlaceCommand<P>;
  };
  /**
   * Says a message, looking like we did something.
   * @param {string} action
   * @param place
   */
  me(action: string, place: P): void;
  /**
   * Changes our chat color.
   * @param {string} color
   * @param place
   */
  changeColor(color: string, place: P): void;
}
