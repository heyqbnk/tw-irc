import {
  ISharedRepository,
  TUserCommand as TGenericUserCommand,
  TPlaceCommand,
} from '../SharedRepository';
import {TChannel} from '../types';

export type TUserCommand = TGenericUserCommand<TChannel>;
export type TChannelCommand = TPlaceCommand<TChannel>;
export type TTargetedCommand = (targetChannel: string, channel: TChannel) => void;

export interface IOptionsWithDuration<T> {
  duration?: T;
  channel: TChannel;
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
export interface IChannelsRepository extends ISharedRepository<TChannel> {
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
  deleteMessage(id: string, channel: TChannel): void;
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
}
