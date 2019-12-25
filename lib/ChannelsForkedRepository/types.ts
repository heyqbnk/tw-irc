import {
  ISharedForkedRepository,
  TUserCommand,
  TPlaceCommand,
} from '../SharedForkedRepository';

export type TChannelTargetedCommand = (channel: string) => void;

export interface IOptionsWithDuration<T> {
  duration?: T;
}

export interface IFollowersOnlyOptions extends IOptionsWithDuration<string> {
}

export interface IPlayCommercialOptions extends IOptionsWithDuration<number> {
}

export interface IMarkerOptions {
  comment?: string;
}

/**
 * Implementation class for ChannelsRepository class.
 */
export interface IChannelsForkedRepository extends ISharedForkedRepository {
  /**
   * Followers-only mode.
   */
  followersOnly: {
    enable(options?: IFollowersOnlyOptions): void;
    disable: TPlaceCommand;
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
  host: TChannelTargetedCommand;
  /**
   * Unhosts.
   */
  unhost: TPlaceCommand;
  /**
   * Raids channel.
   */
  raid: TChannelTargetedCommand;
  /**
   * Unraids.
   */
  unraid: TPlaceCommand;
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
  clear: TPlaceCommand;
}
