import { Client, EIRCCommand, ESocketReadyState } from '../lib';
import { prepareIRCMessage, parseIRCMessage } from '../lib/utils';

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

// Wait for connection to be opened
client.socket.on('open', async () => {
  printReadyState();

  // Join channel
  client.channels.join('qbnk');
  client.bindChannel('qbnk');

  client.say('Hello!');

  // Watch for incoming messages
  client.on(EIRCCommand.Message, ({ channel, message, user, userInfo }) => {
    console.warn(userInfo, `#${channel} ${user}: ${message}`);
  });

  // Watch for somebody joining channel
  client.on(EIRCCommand.JoinChannel, ({ channel, user }) => {
    console.warn(`#${channel}: ${user} joined channel`);
  });

  // Watch for somebody's leave
  client.on(EIRCCommand.LeaveChannel, ({ channel, user }) => {
    console.warn(`#${channel}: ${user} left channel`);
  });

  client.socket.on('message', event => {
    // Convert raw socket message to array of messages. We need this action
    // because commands can be concatenated in one message and doing this,
    // we just detect them.
    const messages = prepareIRCMessage(event.data);

    // Here we get an array of objects with params:
    // prefix: {
    //    nickName: string | null;
    //    user: string | null;
    //    host: string;
    // } | null;
    // meta: Record<string, string | string[] | number | number[] | null> | null;
    // parameters: string[] | null;
    // command: EIRCCommand | string;
    // data: string;
    // raw: string;
    const parsedMessages = messages.map(parseIRCMessage);

    // You can react however you want after all of messages are parsed.
    console.log('Customly parsed messages:', parsedMessages);
  });
});

client.socket.on('close', () => {
  printReadyState();
});

client.connect();

if ((module as any).hot) {
  (module as any).hot.accept();
}

// @ts-ignore
window.irc = client;
