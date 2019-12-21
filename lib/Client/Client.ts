import {IClient, IClientConstructorProps} from './types';
import {IAuthInfo} from '../types';

import Socket from '../Socket';
import ChannelsRepository from '../ChannelsRepository';
import EventsRepository, {TDetectListener} from '../EventsRepository';
import RoomsRepository from '../RoomsRepository';

import {generateRandomAuth, isPasswordValid} from './utils';
import {ESignal} from '../types';

class Client implements IClient {
  /**
   * Repository responsible for events binding.
   */
  private events: EventsRepository;

  public readonly socket: Socket;
  public channels: ChannelsRepository;
  public rooms: RoomsRepository;

  public constructor(props: IClientConstructorProps = {}) {
    const {secure, auth: initialAuth} = props;
    let auth: IAuthInfo;

    if (initialAuth) {
      const {password} = initialAuth;

      if (!isPasswordValid(password)) {
        throw new Error(
          `Passed password "${password}" is invalid. ` +
          'It should start with "oauth:". Your auth data will be ignored. ' +
          'Please follow these instructions to get more info:\n' +
          'https://twitchapps.com/tmi/\n' +
          'https://dev.twitch.tv/docs/authentication/',
        );
      }
      auth = initialAuth;
    } else {
      auth = generateRandomAuth();
    }

    const socket = new Socket({secure, auth});

    this.socket = socket;

    // Initialize repositories.
    this.events = new EventsRepository(socket, auth.login);
    this.channels = new ChannelsRepository(socket);
    this.rooms = new RoomsRepository(socket);
  }

  public connect = async () => this.socket.connect();

  public disconnect = () => this.socket.disconnect();

  public on = <Event extends ESignal | string>(
    event: Event,
    listener: TDetectListener<Event>,
  ) => {
    this.events.on(event, listener);
  };

  public off = <Event extends ESignal | string>(
    event: Event,
    listener: TDetectListener<Event>,
  ) => {
    this.events.off(event, listener);
  };

  public assignChannel = (channel: string) => {
    this.channels.assign(channel);
  };

  public assignRoom = (room: {channelId: string; roomUuid: string}) => {
    this.rooms.assign(room);
  };
}

export {Client};
export default Client;