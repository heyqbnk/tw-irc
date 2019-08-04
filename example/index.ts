import { Client, ESignal } from '../lib';
import { ESocketReadyState } from '../lib/socket/types';
// import { prepareIRCMessage, parseIRCMessage } from '../lib/utils';

const client = new Client({
  auth: {
    login: 'streamerspacebot',
    password: 'oauth:3xpybrljzh009ihj0og6r8j8wizlad',
  },
});

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

// Wait for connection to be opened
client.socket.on('open', async () => {
  printReadyState();

  // Join channel
  const channel = 'xakoh';
  client.channels.join(channel);
  client.bindChannel(channel);

  // Watch every signal.
  Object.values(ESignal).forEach(signal => {
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
