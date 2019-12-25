import {ESignal, IRoom} from '../types';
import SharedRepository from '../SharedRepository';
import {IRoomsRepository} from './types';

class RoomsRepository extends SharedRepository<IRoom>
  implements IRoomsRepository {

  public join = ({channelId, roomUuid}: IRoom) => {
    this.socket.send(`${ESignal.Join} #chatrooms:${channelId}:${roomUuid}`);
  };

  public say = (message: string, {channelId, roomUuid}: IRoom) => {
    this.socket.send(
      `${ESignal.Message} #chatrooms:${channelId}:${roomUuid} :${message}`,
    );
  };
}

export default RoomsRepository;
