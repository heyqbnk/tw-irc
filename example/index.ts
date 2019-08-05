import { Client, ESignal } from '../lib';
import { ESocketReadyState } from '../lib/socket/types';
import { TObservableSignals } from '../lib/repositories/events/types';

const client = new Client();

function printReadyState() {
  const state = client.socket.getReadyState();

  if (state === ESocketReadyState.Open) {
    console.warn('Socket connection is established');
  } else if (state === ESocketReadyState.Closed) {
    console.warn('Socket connection is closed');
  } else if (state === ESocketReadyState.Closing) {
    console.warn('Socket connection is closing');
  } else {
    console.warn('Socket connection is being established..');
  }
}

printReadyState();

const observableSignals: TObservableSignals[] = [
  ESignal.ClearChat, ESignal.ClearMessage, ESignal.GlobalUserState,
  ESignal.Host, ESignal.Join, ESignal.Leave, ESignal.Message, ESignal.Notice,
  ESignal.Reconnect, ESignal.RoomState, ESignal.UserNotice, ESignal.UserState,
];

// Wait for connection to be opened
client.socket.on('open', async () => {
  printReadyState();

  // Join channel
  const channel = 'xakoh';
  client.channels.join(channel);
  client.assignChannel(channel);

  // Watch each observable signal.
  observableSignals.forEach(signal => {
    client.on(signal, params => console.log(`${signal} ::`, params));
  });
});

client.socket.on('close', () => {
  printReadyState();
});

client.connect();

if ((module as any).hot) {
  (module as any).hot.accept(() => {
    window.location.reload();
  });
}
