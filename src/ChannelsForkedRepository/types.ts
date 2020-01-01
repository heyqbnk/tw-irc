export type TUserCommand = (user: string) => void;
export type TChannelCommand = () => void;
export type TTargetedCommand = (channel: string) => void;

export interface IOptionsWithDuration<T> {
  duration?: T;
}

export interface IFollowersOnlyOptions extends IOptionsWithDuration<string> {
}

export interface IPlayCommercialOptions extends IOptionsWithDuration<number> {
}

export interface IPlaceModeController {
  enable: TChannelCommand;
  disable: TChannelCommand;
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

export interface IMarkerOptions {
  comment?: string;
}

/**
 * Implementation class for ChannelsRepository class.
 */
export interface IChannelsForkedRepository {
  /**
   * Followers-only mode.
   */
  followersOnly: {
    enable(options?: IFollowersOnlyOptions): void;
    disable: TChannelCommand;
  };
  /**
   * Deletes message from channel.
   * @param id
   */
  deleteMessage(id: string): void;
  /**
   * Plays commercial ads.
   * @param options
   */
  playCommercial(options?: IPlayCommercialOptions): void;
  /**
   * Leaves a marker with comment.
   * @param options
   */
  marker(options?: IMarkerOptions): void;
  /**
   * Hosts channel.
   */
  host: TTargetedCommand;
  /**
   * Unhosts.
   */
  unhost: TChannelCommand;
  /**
   * Raids channel.
   */
  raid: TTargetedCommand;
  /**
   * Unraids.
   */
  unraid: TChannelCommand;
  /**
   * Mods user.
   */
  mod: TUserCommand;
  /**
   * Unmods user.
   */
  unmod: TUserCommand;
  /**
   * Makes user VIP.
   */
  vip: TUserCommand;
  /**
   * Removes user's VIP status.
   */
  unvip: TUserCommand;
  /**
   * Clears chat.
   */
  clear: TChannelCommand;
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
    disable: TChannelCommand;
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
