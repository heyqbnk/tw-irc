import Client, {ESignal} from '../lib';
import {TTransformableEvent} from '../lib/EventsRepository';
import {ESocketReadyState} from '../lib/socket';

const client = new Client();

const {Open, Closed, Closing} = ESocketReadyState;

/**
 * Prints current ready state.
 */
function printReadyState() {
  const state = client.socket.getReadyState();

  if (state === Open) {
    console.warn('Socket connection is established');
  } else if (state === Closed) {
    console.warn('Socket connection is closed');
  } else if (state === Closing) {
    console.warn('Socket connection is closing');
  } else {
    console.warn('Socket connection is being established..');
  }
}

const observableSignals: TTransformableEvent[] = [
  ESignal.ClearChat, ESignal.ClearMessage, ESignal.GlobalUserState,
  ESignal.Host, ESignal.Join, ESignal.Leave, ESignal.Message, ESignal.Notice,
  ESignal.Reconnect, ESignal.RoomState, ESignal.UserNotice, ESignal.UserState,
];

const listeners: any[] = [];

printReadyState();

(async () => {
  /**
   * Add all observable events listeners, join channel.
   */
  function onConnected() {
    printReadyState();

    // Join channel
    const channel = 'summit1g';
    client.channels.join(channel);
  }

  /**
   * Removes all previously added listeners.
   */
  function onDisconnected() {
    printReadyState();
  }

  // Watch each observable signal.
  observableSignals.forEach(signal => {
    const listener = (params: any) => console.log(`${signal} ::`, params);
    listeners.push({signal, listener});

    client.on(signal, listener);
  });

  // Add event listener on socket opened
  client.socket.on('open', onConnected);
  client.socket.on('close', onDisconnected);

  await client.connect();
})();

// Webpack Hot Module Reload feature
if ((module as any).hot) {
  (module as any).hot.accept(() => {
    window.location.reload();
  });
}