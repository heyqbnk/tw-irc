import {ESignal, IRoom} from '../types';
import SharedForkedRepository from '../SharedForkedRepository';
import {IRoomsForkedRepository} from './types';

class RoomsForkedRepository extends SharedForkedRepository<IRoom>
  implements IRoomsForkedRepository {

  public join = () => {
    const {channelId, roomUuid} = this.place;
    this.socket.send(`${ESignal.Join} #chatrooms:${channelId}:${roomUuid}`);
  };

  public say = (message: string) => {
    const {channelId, roomUuid} = this.place;
    this.socket.send(
      `${ESignal.Message} #chatrooms:${channelId}:${roomUuid} :${message}`,
    );
  };
}

export default RoomsForkedRepository;
