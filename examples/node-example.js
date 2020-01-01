const {default: Client, ECommand, ESocketReadyState} = require('../dist');

const client = new Client({
  channels: ['pestily'],
});

const {
  ClearChat, ClearMessage, GlobalUserState, Host, Join, Leave,
  Message, Notice, Reconnect, RoomState, UserNotice, UserState,
} = ECommand;

/**
 * Prints current ready state.
 */
function printReadyState() {
  const state = client.socket.getReadyState();
  const {Open, Closed, Closing} = ESocketReadyState;

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

printReadyState();

(async () => {
  const commands = [
    ClearChat, ClearMessage, GlobalUserState, Host, Join, Leave,
    Message, Notice, Reconnect, RoomState, UserNotice, UserState,
  ];

  function onConnected() {
    printReadyState();
  }

  function onDisconnected() {
    printReadyState();
  }

  // Add event listener on socket opened
  client.onConnected(onConnected);
  client.onDisconnected(onDisconnected);

  commands.forEach(c => {
    client.on(c, data => {
      console.log(`Command: %c${c}`, 'font-weight: bold', data);
    });
  });

  client.connect();
})();
