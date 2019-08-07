export type TChannelCommand = (room?: IRoom) => void;
export type TUserCommand = (user: string, IRoom?: string) => void;
export type TTargetedCommand = (target: string, room?: IRoom) => void;

interface IOptionalRoom {
  room?: IRoom;
}

export interface IModeController {
  enable: TChannelCommand;
  disable: TChannelCommand;
}

export interface ISlowmodeOptions extends IOptionalRoom {
  duration?: number;
}

export interface ITimeoutOptions {
  user: string;
  duration?: string;
  reason?: string;
  room?: IRoom;
}

export interface IWhisperOptions {
  user: string;
  message: string;
  room?: IRoom;
}

export interface IRoom {
  channelId: string;
  roomUuid: string;
}

/**
 * Rooms repository part, connected with users.
 */
interface IRoomsRepositoryUsers {
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
}

/**
 * Implementation class for RoomsRepository class.
 */
export interface IRoomsRepository extends IRoomsRepositoryUsers {
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
  emoteOnly: IModeController;
  /**
   * R9K mode.
   */
  r9k: IModeController;
  /**
   * Slowmode.
   */
  slowmode: {
    enable(options?: ISlowmodeOptions): void;
    disable: TChannelCommand;
  };

  /**
   * Clears chat.
   */
  clearChat: TChannelCommand;

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
}
