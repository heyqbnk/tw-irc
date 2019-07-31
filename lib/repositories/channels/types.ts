type TChannelCommand = (channel?: string) => void;
type TTargetedCommand = (target: string, channel?: string) => void;

interface IModeController {
  on: TChannelCommand;
  off: TChannelCommand;
}

/**
 * Implementation class for ChannelsRepository class.
 */
interface IChannelsRepository {
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
  followersOnly: IModeController;

  /**
   * R9K mode.
   */
  r9k: IModeController;

  /**
   * Slowmode.
   */
  slowmode: {
    on(durationInSeconds: number, channel?: string): void;
    off: TChannelCommand;
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

export { TChannelCommand, TTargetedCommand, IChannelsRepository };
