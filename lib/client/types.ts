import { Socket } from '../socket';

import { ChannelsRepository } from '../repositories/channels';
import { RoomsRepository } from '../repositories/rooms';

import {
  TObservableSignals,
  TSignalListenersMap,
} from '../repositories/events';

interface IAuthInfo {
  login: string;
  password: string;
}

interface IClientConstructorProps {
  auth?: IAuthInfo;
  secure?: boolean;
}

type TListeningManipulator = <Signal extends TObservableSignals>(
  command: Signal,
  listener: TSignalListenersMap[Signal],
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
  rooms: RoomsRepository;

  /**
   * Create a client connection to IRC.
   */
  connect(): Promise<void>;

  /**
   * Disconnects web socket.
   */
  disconnect();

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
  assignChannel(channel: string);

  /**
   * Binds this client to passed room.
   * @param room
   */
  assignRoom(room: { channelId: string, roomUuid: string });
}

export { IAuthInfo, IClientConstructorProps, IClient, TListeningManipulator };
