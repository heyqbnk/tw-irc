export type TUserCommand = (user: string) => void;
export type TPlaceCommand = () => void;

export interface IPlaceModeController {
  enable: TPlaceCommand;
  disable: TPlaceCommand;
}

export interface ITimeoutOptions {
  user: string;
  duration?: string;
  reason?: string;
}

export interface ISlowmodeOptions {
  duration?: number;
}

export interface IWhisperOptions {
  user: string;
  message: string;
}

export interface ISharedForkedRepository {
  /**
   * Bans user.
   */
  ban: TUserCommand;
  /**
   * Unbans user.
   */
  unban: TUserCommand;
  /**
   * Gives user a timeout.
   * @param options
   */
  timeout(options: ITimeoutOptions): void;
  /**
   * Removes user's timeout.
   */
  untimeout: TUserCommand;
  /**
   * Whispers someone.
   * @param options
   */
  whisper(options: IWhisperOptions): void;
  /**
   * Says a message.
   * @param {string} message
   */
  say(message: string): void;
  /**
   * Joins channel.
   */
  join(): void;
  /**
   * Leaves channel.
   */
  disconnect(): void;
  /**
   * Emote-only mode.
   */
  emoteOnly: IPlaceModeController;
  /**
   * R9K mode.
   */
  r9k: IPlaceModeController;
  /**
   * Slowmode.
   */
  slowmode: {
    enable(options?: ISlowmodeOptions): void;
    disable: TPlaceCommand;
  };
  /**
   * Says a message, looking like we did something.
   * @param {string} action
   */
  me(action: string): void;
  /**
   * Changes our chat color.
   * @param {string} color
   */
  changeColor(color: string): void;
}
