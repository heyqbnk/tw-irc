import {IRoom} from '../types';
import {
  TUserCommand,
  IPlaceModeController,
  ISlowmodeOptions,
  ITimeoutOptions,
  IWhisperOptions,
} from '../SharedRepository';

export type TRoomUserCommand = TUserCommand<IRoom>;
export type TRoomCommand = TUserCommand<IRoom>;
export type TRoomModeController = IPlaceModeController<IRoom>;

export interface IRoomSlowmodeOptions extends ISlowmodeOptions<IRoom> {
}

export interface IRoomTimeoutOptions extends ITimeoutOptions<IRoom> {
}

export interface IRoomWhisperOptions extends IWhisperOptions<IRoom> {
}

/**
 * Implementation class for RoomsRepository class.
 */
export interface IRoomsRepository {
  /**
   * Says a message to room.
   * @param {string} message
   * @param room
   */
  say(message: string, room?: IRoom): void;
  /**
   * Joins channel.
   * @param channelId
   * @param roomUuid
   */
  join(channelId: string, roomUuid: string): void;
  /**
   * Leaves room.
   * @param channelId
   * @param roomUuid
   */
  disconnect(channelId: string, roomUuid: string): void;
  /**
   * Emote-only mode.
   */
  emoteOnly: IRoom;
  /**
   * R9K mode.
   */
  r9k: TRoomModeController;
  /**
   * Slowmode.
   */
  slowmode: {
    enable(options?: IRoomSlowmodeOptions): void;
    disable: TRoomCommand;
  };
  /**
   * Clears chat.
   */
  clearChat: TRoomCommand;
  /**
   * Says a message, looking like we did something.
   * @param {string} action
   * @param room
   */
  me(action: string, room?: IRoom): void;
  /**
   * Changes our chat color.
   * @param {string} color
   * @param room
   */
  changeColor(color: string, room?: IRoom): void;
  /**
   * Bans user.
   */
  ban: TRoomUserCommand;
  /**
   * Unbans user.
   */
  unban: TRoomUserCommand;
  /**
   * Gives user a timeout.
   * @param options
   */
  timeout(options: IRoomTimeoutOptions): void;
  /**
   * Removes user's timeout.
   */
  untimeout: TRoomUserCommand;
  /**
   * Whispers someone.
   * @param options
   */
  whisper(options: IRoomWhisperOptions): void;
}
