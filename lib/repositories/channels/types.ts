export type TChannelCommand = (channel?: string) => void;
export type TTargetedCommand = (target: string, channel?: string) => void;

export interface IModeController {
  enable: TChannelCommand;
  disable: TChannelCommand;
}

/**
 * Implementation class for ChannelsRepository class.
 */
export interface IChannelsRepository {
  /**
   * Joins channel.
   * @param {string} channel
   */
  join(channel: string): void;

  /**
   * Leaves channel.
   * @param {string} channel
   */
  leave(channel: string): void;

  /**
   * Emote-only mode.
   */
  emoteOnly: IModeController;

  /**
   * Followers-only mode.
   */
  followersOnly: {
    enable(durationInMinutes: number, channel?: string): void;
    disable: TChannelCommand;
  };

  /**
   * R9K mode.
   */
  r9k: IModeController;

  /**
   * Slowmode.
   */
  slowmode: {
    enable(durationInSeconds: number, channel?: string): void;
    disable: TChannelCommand;
  };

  /**
   * Deletes message from channel.
   * @param {string} messageId
   * @param {string} channel
   */
  deleteMessage(messageId: string, channel?: string): void;

  /**
   * Plays commercial ads.
   * @param {number} durationInSeconds
   * @param {string} channel
   */
  playCommercial(durationInSeconds: number, channel?: string): void;

  /**
   * Clears chat.
   */
  clearChat: TChannelCommand;

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
   * Leaves a marker with comment.
   * @param {string} comment
   * @param {string} channel
   */
  marker(comment: string, channel?: string): void;

  /**
   * Says a message, looking like we did something.
   * @param {string} action
   * @param {string} channel
   */
  me(action: string, channel?: string): void;

  /**
   * Changes our chat color.
   * @param {string} color
   * @param {string} channel
   */
  changeColor(color: string, channel?: string): void;
}
