import { Socket } from '../socket';

import { ChannelsRepository } from '../repositories/channels';
import { UsersRepository } from '../repositories/users';
import { UtilsRepository } from '../repositories/utils';

import { TObservableEvents, TCallbacksMap } from '../repositories/events';

interface IAuthInfo {
  login: string;
  password: string;
}

interface IClientConstructorProps {
  auth?: IAuthInfo;
  secure?: boolean;
}

type TListeningManipulator = <Command extends TObservableEvents>(
  command: Command,
  listener: TCallbacksMap[Command],
) => void;

/**
 * Implementation for Client class.
 */
interface IClient {
  /**
   * Socket instance. Used to create connection to IRC.
   */
  socket: Socket;

  /**
   * Repository to work with channels.
   */
  channels: ChannelsRepository;

  /**
   * Repository to communicate with users.
   */
  users: UsersRepository;

  /**
   * Repository containing some useful methods.
   */
  utils: UtilsRepository;

  /**
   * Create a client connection to IRC.
   */
  connect(): void;

  /**
   * Disconnects web socket.
   */
  disconnect(): void;

  /**
   * Shortcut to commands events binding. Make listener call when command
   * is being detected.
   */
  on: TListeningManipulator;

  /**
   * Removes event listener from command.
   */
  off: TListeningManipulator;

  /**
   * Binds this client to passed channel.
   * @param {string} channel
   */
  bindChannel(channel: string): void;

  /**
   * Says a message to channel.
   * @param {string} message
   * @param {string} channel
   */
  say(message: string, channel?: string): void;
}

export { IAuthInfo, IClientConstructorProps, IClient, TListeningManipulator };
