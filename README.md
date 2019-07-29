# tw-irc
## About
Here is a library that handles connection to Twitch IRC. It allows you to join
or leave channels, detect and send new messages and other.

We expect, you are using TypeScript, because some error protection mechanisms
inside this library are based on TypeScript typings restrictions.

## Documentation
### Create client
Library contains a client, that connects to Twitch IRC. Here is an example
to create an instance of this client:
```javascript
import { Client } from 'tw-irc';

// Create anonymous client
const client = new Client();

// Create client with authentication. It will allow us to send messages.
const authenticatedClient = new Client({
  auth: {
    login: '...', // your login, lower-cased
    password: '...', // get it here: https://twitchapps.com/tmi/
  },
});
```

In case, you want to use this client only for 1 channel, you can remember it
in the client, to shorten commands call.
```javascript
// Previously, we have to call command with:
client.channels.emoteOnly.on('summit1g');

// But we can remember the channel, to shorten command calls. After channel
// bind, all commands without stated channel will take last bound channel.
client.bindChannel('summit1g');
client.channels.emoteOnly.on();
```

### Connect client to IRC
After client is created, we have to initialize socket connection to Twitch
IRC. It will create an instance of Socket which will try to connect to
IRC. After `connect()` is called, previous Socket is being disconnected
and other instance of WebSocket will be created. 
```javascript
// Create websocket connection to IRC
client.connect();
```

## Events
Client supports 2 types of events - WebSocket events 
(`message`, `open`, `close`, `error`) and IRC events.

### WebSocket events
These events are directly bound to created WebSocket 
(watch [WebSocket specs](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket).
for more info) after `connect()`:
```javascript
client.socket.on('message', event => {
  console.log('Some message event occurred', event);
});

// Unbind via client.socket.off(listener)
```

The second thing you have to know is you should not use client commands like
`ban`, `say` and other before the connection was successfully established. You
can detect its existence by calling `getReadyState()` method which returns 
`ESocketReadyState`.

```javascript
import { ESocketReadyState } from 'tw-irc'

const readyState = client.socket.getReadyState();

if (readyState === ESocketReadyState.Open) {
  console.log('Socket connection is established');
} else if (readyState === ESocketReadyState.Closed) {
  console.log('Socket connection is closed');
} else if (readyState === ESocketReadyState.Closing) {
  console.log('Socket connection is closing');
} else {
  console.log('Socket connection is being established..');
}
```

### IRC events
Library contains special enum `EIRCCommand` which allows you to use
dictionary instead of raw texts. Here is an example of binding listener
to IRC command.
```javascript
import { EIRCCommand } from 'tw-irc';

// Firstly, we have to join some channel
client.channels.join('summit1g');

// Bind event to listen to EIRCCommand.Message = "PRIVMSG" event
client.on(EIRCCommand.Message, data => {
  const { channel, message, user, userInfo } = data;
  
  // "user" said "message" in "channel"
  console.log(userInfo, `#${channel} - ${user}: ${message}`);
});
```  

### Custom IRC messages handling
If you want full control over the messages coming from IRC, you can use
this trick:
```javascript
import { parseIRCMessage, prepareIRCMessage } from 'tw-irc/utils';

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
});
```

## TODO
- Full tests coverage.
- Add correct authorization detection
- Add NOTICE command support
