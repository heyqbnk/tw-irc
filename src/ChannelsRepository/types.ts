export type TUserCommand = (user: string, channel: string) => void;
export type TChannelCommand = (channel: string) => void;
export type TTargetedCommand = (targetChannel: string, channel: string) => void;

export interface IPlaceModeController {
  enable: TChannelCommand;
  disable: TChannelCommand;
}

export interface ITimeoutOptions {
  user: string;
  duration?: string;
  reason?: string;
  channel: string;
}

export interface ISlowmodeOptions {
  duration?: number;
  channel: string;
}

export interface IWhisperOptions {
  user: string;
  message: string;
  channel: string;
}


export interface IOptionsWithDuration<T> {
  duration?: T;
  channel: string;
}

export interface IFollowersOnlyOptions extends IOptionsWithDuration<string> {
}

export interface IPlayCommercialOptions extends IOptionsWithDuration<number> {
}

export interface IMarkerOptions {
  comment?: string;
  channel: string;
}

/**
 * Implementation class for ChannelsRepository class.
 */
export interface IChannelsRepository {
  /**
   * Followers-only mode.
   */
  followersOnly: {
    enable(options: IFollowersOnlyOptions): void;
    disable: TChannelCommand;
  };
  /**
   * Deletes message from channel.
   * @param id
   * @param channel
   */
  deleteMessage(id: string, channel: string): void;
  /**
   * Plays commercial ads.
   * @param options
   */
  playCommercial(options: IPlayCommercialOptions): void;
  /**
   * Leaves a marker with comment.
   * @param options
   */
  marker(options: IMarkerOptions): void;
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
   * Says a message to room.
   * @param {string} message
   * @param channel
   */
  say(message: string, channel: string): void;
  /**
   * Joins channel.
   * @param channel
   */
  join(channel: string): void;
  /**
   * Leaves room.
   * @param channel
   */
  disconnect(channel: string): void;
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
    enable(options: ISlowmodeOptions): void;
    disable: TChannelCommand;
  };
  /**
   * Says a message, looking like we did something.
   * @param {string} action
   * @param channel
   */
  me(action: string, channel: string): void;
  /**
   * Changes our chat color.
   * @param {string} color
   * @param channel
   */
  changeColor(color: string, channel: string): void;
}
