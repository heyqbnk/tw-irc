import {
  ISharedRepository,
  TChannelCommand as TGenericChannelCommand,
  TUserCommand as TGenericUserCommand,
} from '../../types/shared-repository';

export type TUserCommand = TGenericUserCommand<string>;
export type TChannelCommand = TGenericChannelCommand<string>;
export type TTargetedCommand = (target: string, channel?: string) => void;

export interface IModeController {
  enable: TChannelCommand;
  disable: TChannelCommand;
}

export interface IOptionsWithDuration<T> {
  duration?: T;
  channel?: string;
}

export interface IFollowersOnlyOptions extends IOptionsWithDuration<string> {}

export interface IPlayCommercialOptions extends IOptionsWithDuration<number> {}

export interface IMarkerOptions {
  comment?: string;
  channel?: string;
}

/**
 * Implementation class for ChannelsRepository class.
 */
export interface IChannelsRepository extends ISharedRepository<string> {
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
   * @param channel
   */
  deleteMessage(id: string, channel?: string): void;

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
}
