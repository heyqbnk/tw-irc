import { IRoom} from './types';
import { ESignal } from '../../types';
import { SharedRepository } from '../../types/shared-repository';
import { Socket } from '../../socket';

export class RoomsRepository extends SharedRepository<IRoom> {
  private readonly socket: Socket;

  public constructor(socket: Socket) {
    super();
    this.socket = socket;
  }

  public join = ({ channelId, roomUuid }: IRoom) => {
    this.socket.send(`${ESignal.Join} #chatrooms:${channelId}:${roomUuid}`);
  };

  public say = (message: string, room?: IRoom) => {
    const targetRoom = room || this.assignedPlace;

    if (!targetRoom) {
      throw new Error(
        'Cannot send message due to room is not ' +
        'passed. Use assign() to assign room to client, or pass ' +
        'room directly',
      );
    }
    const { channelId, roomUuid } = targetRoom;
    this.socket.send(
      `${ESignal.Message} #chatrooms:${channelId}:${roomUuid} :${message}`,
    );
  };
}