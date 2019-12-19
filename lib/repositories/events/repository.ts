import {
  ISignalListener,
  IEventsRepository,
  TListeningManipulator,
  TObservableSignals,
} from './types';
import { parseIRCMessage, prepareIRCMessage } from '../../utils';
import { transformers } from './transformers';
import Socket from '../../socket';
import { ESignal } from '../../types';

const observableSignals: TObservableSignals[] = [
  ESignal.ClearChat, ESignal.ClearMessage, ESignal.GlobalUserState,
  ESignal.Host, ESignal.Join, ESignal.Leave, ESignal.Message, ESignal.Notice,
  ESignal.Reconnect, ESignal.RoomState, ESignal.UserNotice, ESignal.UserState,
];

class EventsRepository implements IEventsRepository {
  private readonly signalListeners: ISignalListener[] = [];
  private readonly socket: Socket;
  private readonly login: string;

  public constructor(socket: Socket, login: string) {
    this.login = login.toLowerCase();
    this.socket = socket;
    this.socket.on('message', this.onMessage);
  }

  /**
   * Parses incoming message and triggers event listeners.
   * @param {MessageEvent} event
   */
  private onMessage = (event: MessageEvent) => {
    const preparedMessages = prepareIRCMessage(event.data as string);

    preparedMessages.forEach(message => {
      const parsedMessage = parseIRCMessage(message);

      // Check if there are bound listeners to this command.
      this.signalListeners.forEach(({signal, listener}) => {
        if (signal === parsedMessage.signal) {
          // We have to pre-transform parameters to format, applicable
          // by specific listener.
          const transform = transformers[parsedMessage.signal];

          listener(transform(this.login, parsedMessage));
        }
      });
    });
  };

  public on: TListeningManipulator = (signal, listener) => {
    if (!observableSignals.includes(signal)) {
      throw new Error(
        `Signal listening for signal "${signal}" is not supported.`,
      );
    }
    this.signalListeners.push({ signal, listener });
  };

  public off: TListeningManipulator = (signal, listener) => {
    const foundIndex = this.signalListeners.findIndex(
      item => item.listener === listener && item.signal === signal,
    );

    if (foundIndex > -1) {
      this.signalListeners.splice(foundIndex, 1);
    }
  };
}

export default EventsRepository;