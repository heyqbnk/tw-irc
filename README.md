# tw-irc

> **NOTICE FOR DEVELOPERS**
>
> Please, don't forget to check library updates at least once per 2 days. I
> will keep updating library as often as I can, until stable version - v2.0.0. 

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

## API documentation
### Socket
Remember, that you should not use this class usually, but if it required,
you are free here.
#### Constructor
```typescript
interface ISocketConstructorProps {
  // Should connection be secure?
  secure: boolean;
}

const socket = new Socket(props: ISocketConstructorProps);
```
#### Instance
```typescript
class Socket {
  // Disconnects previously created WebSocket, creates a new instance of 
  // WebSocket. Binds previously bound events.
  connect: () => void;
  
  // Disconnects previously created WebSocket
  disconnect: () => void;
  
  // Adds event listener to socket. Watch WebSocket.prototype.addEventListener
  on: (
    eventName: 'close' | 'error' | 'message' | 'open', 
    listener: (ev: Event) => void,
  ) => void;
  
  // Works the same as `on`, but removes the listener
  off: (
    eventName: 'close' | 'error' | 'message' | 'open', 
    listener: (ev: Event) => void,
  ) => void;
  
  // Returns current socket connection state
  getReadyState: () => ESocketReadyState;
  
  // Send message via socket
  send: (message: string) => void;
}
```

### Client
#### Constructor
```typescript
interface IClientConstructorProps {
  auth?: {
    // Your Twitch login 
    login: string;
    // Your password in form like "oauth:...". 
    // You can get it here: https://twitchapps.com/tmi/
    password: string;
  };
  // Should be connection secured? False by default.
  secure?: boolean;
}

const client = new Client(props?: IClientConstructorProps);
```
#### Instance
```typescript
class Client {
  // Socket instance
  socket: Socket;
  
  // Repository for working with channels
  channels: ChannelsRepository;
  
  // Repository for working with users
  users: UsersRepository;
  
  // Initializes connection to IRC
  connect: () => void;
  
  // Disconnects client
  disconnect: () => void;
  
  // Method for listening of commands from IRC. Notice, that not all
  // commands from EIRCCommand can be observed. Watch TObservableEvents
  // to know which commands are observable.
  on: <Command extends TObservableEvents>(
    command: Command,
    listener: TCallbacksMap[Command],
  ) => void;
  
  // Same as "on", but just removes the listener
  off: <Command extends TObservableEvents>(
    command: Command,
    listener: TCallbacksMap[Command],
  ) => void;
  
  // Binds stated channel to this client. Useful, when you dont want to
  // always state which channel you want to use for command. Client will
  // automatically take last bound channel if it is not stated in method call.
  bindChannel: (channel: string) => void;
  
  // Usual method for saying a message in channel. It is being used by
  // "messages" and "users" repositories of client.
  say: (message: string, channel?: string) => void;
}
```

### UsersRepository
This repository is used to to do actions connected with users.
#### Constructor
Constructor accepts single parameter - instance of Client. Repository will
use it to send messages via `say`.
#### Instance
```typescript
class UsersRepository {
  // List of user-oriented commands
  ban: (user: string, channel?: string) => void;
  unban: (user: string, channel?: string) => void;
  
  mod: (user: string, channel?: string) => void;
  unmod: (user: string, channel?: string) => void;
  
  timeout: (
    user: string,
    duration = '10m',
    reason?: string,
    channel?: string,
  ) => void;
  untimeout: (user: string, channel?: string) => void;
  
  vip: (user: string, channel?: string) => void;
  unvip: (user: string, channel?: string) => void;
  
  whisper: (user: string, message: string, channel?: string) => void;
}
```

### Channels Repository
This repository is used to to do actions connected with channels.
#### Constructor
Constructor accepts single parameter - instance of Client. Repository will
use it to send messages via `say`.
#### Instance
Firstly, lets state, that mode-oriented commands are always object with
fields `on` and `off` which are functions. Something like that:
```typescript
interface IModeCommand {
  on: (channel?: string) => void;
  off: (channel?: string) => void;
}
```
Description of instance: 
```typescript
class ChannelsRepository {
  // Makes client join channel
  join: (channel: string) => void;
  
  // Make client leave channel
  leave: (channel: string) => void;
  
  // Emotes only mode
  emoteOnly: IModeCommand;
  
  // Followers only mode
  followersOnly: IModeCommand;
  
  // R9K mode
  r9k: IModeCommand;
  
  // Slow mode
  slowmode: IModeCommand;
  
  // Deletes message
  deleteMessage: (msgId: string, channel?: string) => void;
  
  // Play commercial advertisements
  playCommercial: (durationInSeconds: number, channel?: string) => void;
  
  // Clears chat
  clearChat: (channel?: string) => void;
  
  // Host channel
  host: (targetChannel: string, channel?: string) => void;
  
  // Unhost
  unhost: (channel?: string) => void;
  
  // Raid channel
  raid: (targetChannel: string, channel?: string) => void;
    
  // Unraid
  unraid: (channel?: string) => void;
  
  // Leaves a marker with comment
  marker: (comment: string, channel?: string) => void;
  
  // Says a message, looking like an author of its message did something.
  me: (action: string, channel?: string) => void;
  
  // Changes current client color in chat
  changeColor: (color: string, channel?: string) => void;
}
```

### UtilsRepository
This repository is kinda external but is opened on beta period due to
not all commands are realized at this time. In the future it will be hidden
via `private` security modifier.
#### Constructor
Constructor accepts single parameter - instance of Socket. Repository will
use it to send messages via `send`.
#### Instance
```typescript
class UtilsRepository {
  // Sends raw message to socket connection
  sendRawMessage: (message: string) => void;
  
  // Send an IRC command. Notice, that not commands are executable.
  // Search for TExecutableCommands for more.
  sendCommand: <Command extends TExecutableCommands>(
    command: Command,
    params: TCommandParams[Command],
  ) => void;
}
```

### EventsRepository
This repository is used to handle IRC events, parsing and
react on them with bound listeners.
#### Constructor
Constructor accepts single parameter - instance of Socket. Repository will
use it to detect new messages and react.
#### Instance
```typescript
class EventsRepository {
  // Watch Client.on
  on: <Command extends TObservableEvents>(
    command: Command,
    listener: TCallbacksMap[Command],
  ) => void;
  
  // Watch Client.off
  off: <Command extends TObservableEvents>(
    command: Command,
    listener: TCallbacksMap[Command],
  ) => void;
}
```

## TODO
- Add commands support. We have to make a lot of typings here. Follow docs
to know more - https://dev.twitch.tv/docs/irc/tags/:

`MODE` - `event` - someone became moderator

`CLEARCHAT` - `event` - clear chat for someone (someone was banned)

`CLEARMSG` - `event` - admins removed this message

`HOSTTARGET` - `event` - channel started to host this channel

`NOTICE` - `event` - incoming notice

`RECONNECT` - `event` - triggers when server restarts. Server requests a 
reconnect by client with this action

`ROOMSTATE` - `event` - triggers in moment we join or leave channel. Returns 
channel current modes list

`USERNOTICE` - `event` - notifies about some notice connected with user. 
Sub, ban or kinda. Really a lot work with typings here.

`USERSTATE` - returns current client settings (chat color etc.)

`GLOBALUSERSTATE` - event - on successful login returns user info. We can
use it to detect successful authentication. 

- Fix JOIN event. User can join not channel, but chatroom. We are not
currently sending info about chatrooms.

- Workaround with PRIVMSG (chat rooms). A lot of changes should come in
the feature.

- Add message parse support via msg-id for NOTICE

- Add return parameter `self`, which is responsible for detecting if
event is connected with current client.

- Add warning, that we will not support NAMES command due to it is not 
working as expected (as said Twitch - 
https://dev.twitch.tv/docs/irc/membership/#names-twitch-membership).
Expected behaviour is to get real list of chatters, but there are cases
we get only mods. Or try to realize?

- Add an error message, if password passed to client is not started with
"oauth:". Append a reference, where the user can get this token:
https://twitchapps.com/tmi/ or https://dev.twitch.tv/docs/authentication/

- Add typings for all metas from events

- Try to do something with meta value like "moderator/5". Maybe, parse it like
`{ name: 'moderator', value: 5 }`

- Add classes description via interface. Make them implement these interfaces
and copy their links to API documentation. So we can synchronize docs and
real interfaces.

- Rework `prepareIRCMessage`. It is enough to check if "\n" is in the end of
string instead of splicing (0, -1). We can make it a bit more unified with this
check.
