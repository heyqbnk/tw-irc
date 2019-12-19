import Client, {ESignal} from '../lib';
import {ESocketReadyState} from '../lib/socket';
import {TObservableSignals} from '../lib/repositories/events/types';

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

const observableSignals: TObservableSignals[] = [
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

    // Watch each observable signal.
    observableSignals.forEach(signal => {
      const listener = (params: any) => console.log(`${signal} ::`, params);
      listeners.push({signal, listener});

      client.on(signal, listener);
    });

    // Join channel
    const channel = 'ybicanoooobov';
    client.channels.join(channel);
  }

  /**
   * Removes all previously added listeners.
   */
  function onDisconnected() {
    printReadyState();

    // Dont forger to cleanup after disconnect.
    listeners.forEach(({signal, listener}) => client.off(signal, listener));
  }

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