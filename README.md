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
### Types
#### Enums
```typescript
/**
 * List of commands which can be sent to or from IRC.
 */
enum EIRCCommand {
  CapabilityRequest = 'CAP REQ',
  JoinChannel = 'JOIN',
  LeaveChannel = 'PART',
  Message = 'PRIVMSG',
  Nickname = 'NICK',
  Password = 'PASS',
  Ping = 'PING',
  Pong = 'PONG',
}

/**
 * List of states of socket connection.
 */
enum ESocketReadyState {
  Connecting = 0,
  Open = 1,
  Closing = 2,
  Closed = 3,
}
```

#### Observable events and executable commands
```typescript
/**
 * List of observable events.
 */
type TObservableEvents = EIRCCommand.Message
  | EIRCCommand.JoinChannel
  | EIRCCommand.LeaveChannel;

/**
 * List of executable commands.
 */
type TExecutableCommands = EIRCCommand.JoinChannel
  | EIRCCommand.LeaveChannel
  | EIRCCommand.Message;
```

#### Parsing artifacts
```typescript
type TMetaValue = null | string | number | Array<string | number>;
type TMeta = Record<string, TMetaValue | TMetaValue[] | null>;

interface IPrefix {
  nickName: string | null;
  user: string | null;
  host: string;
}

interface IParsedIRCMessage {
  prefix: IPrefix | null;
  meta: TMeta | null;
  parameters: string[] | null;
  command: EIRCCommand | string;
  data: string;
  raw: string;
}
```

#### Returned parameters from EventsRepository to listeners
```typescript
interface IDefaultEventParams {
  channel: string;
}

interface IJoinChannelEventParams extends IDefaultEventParams {
  user: string;
}

interface IMessageEventParams extends IDefaultEventParams {
  message: string;
  user: string;
  userInfo: TMeta;
}

export interface IEventParams {
  [EIRCCommand.JoinChannel]: IJoinChannelEventParams;
  [EIRCCommand.LeaveChannel]: IJoinChannelEventParams;
  [EIRCCommand.Message]: IMessageEventParams;
}
```

#### Definitions of listeners for events
```typescript
/**
 * Generic type to describe required callback for event.
 */
type TCallback<Params> = (params: Params) => void;

/**
 * Description of callbacks for commands.
 * With this type it is easy to create new callbacks description.
 */
type TCallbacksMap = {
  [Command in TObservableEvents]: TCallback<IEventParams[Command]>;
};
```

#### Definitions of parameters for commands
```typescript
interface ICommandDefaultParams {
  channel: string;
}

interface IMessageCommandParams extends ICommandDefaultParams {
  message: string;
}

interface ICommandParams {
  [EIRCCommand.JoinChannel]: ICommandDefaultParams;
  [EIRCCommand.LeaveChannel]: ICommandDefaultParams;
  [EIRCCommand.Message]: IMessageCommandParams;
}

type TCommandParams = {
  [Command in TExecutableCommands]: ICommandParams[Command];
};
```

### Classes definitions

#### Socket
`Socket` is responsible for creating connection to IRC and keeping it alive.
##### Constructor
```typescript
interface ISocketConstructorProps {
  /**
   * Sets connection security level.
   */
  secure: boolean;
}
```
##### Instance
```typescript
type TListeningManipulator = <K extends keyof WebSocketEventMap>(
  eventName: K,
  listener: (ev: WebSocketEventMap[K]) => any,
) => void;

interface ISocket {
  /**
   * Initializes a socket connection.
   */
  connect(): void;

  /**
   * Closes socket connection.
   */
  disconnect(): void;

  /**
   * Adds socket event listener.
   */
  on: TListeningManipulator;

  /**
   * Removes socket event listener.
   */
  off: TListeningManipulator;

  /**
   * Gets current connection state.
   * @returns {ESocketReadyState}
   */
  getReadyState(): ESocketReadyState;

  /**
   * Sends a message by socket.
   * @param {string} message
   */
  send(message: string): void;
}
```

#### Client
Client is a core class which realizes all manipulations of this library.
##### Constructor
```typescript
interface IAuthInfo {
  login: string;
  password: string;
}

interface IClientConstructorProps {
  auth?: IAuthInfo;
  secure?: boolean;
}

const client = new Client(props?: IClientConstructorProps);
```
##### Instance
```typescript
type TListeningManipulator = <Command extends TObservableEvents>(
  command: Command,
  listener: TCallbacksMap[Command],
) => void;

interface IClient {
  /**
   * Socket instance. Used to create connection to IRC.
   */
  socket: Socket;

  /**
   * Repository to work with channels.
   */
  channels: ChannelsRepository;

  /**
   * Repository to communicate with users.
   */
  users: UsersRepository;

  /**
   * Repository containing some useful methods.
   */
  utils: UtilsRepository;

  /**
   * Create a client connection to IRC.
   */
  connect(): void;

  /**
   * Disconnects web socket.
   */
  disconnect(): void;

  /**
   * Shortcut to commands events binding. Make listener call when command
   * is being detected.
   */
  on: TListeningManipulator;

  /**
   * Removes event listener from command.
   */
  off: TListeningManipulator;

  /**
   * Binds this client to passed channel.
   * @param {string} channel
   */
  bindChannel(channel: string): void;

  /**
   * Says a message to channel.
   * @param {string} message
   * @param {string} channel
   */
  say(message: string, channel?: string): void;
}
```

#### UsersRepository
This repository is used to do actions connected with users.
##### Constructor
Constructor accepts single parameter - instance of `Client`. Repository will
use it to send messages via `say`.
##### Instance
```typescript
type TUserCommand = (user: string, channel?: string) => void;

interface IUsersRepository {
  /**
   * Bans user.
   */
  ban: TUserCommand;

  /**
   * Unbans user.
   */
  unban: TUserCommand;

  /**
   * Mods user.
   */
  mod: TUserCommand;

  /**
   * Unmods user.
   */
  unmod: TUserCommand;

  /**
   * Makes user VIP.
   */
  vip: TUserCommand;

  /**
   * Removes user's VIP status.
   */
  unvip: TUserCommand;

  /**
   * Gives user a timeout.
   * @param {string} user
   * @param {string} duration
   * @param {string} reason
   * @param {string} channel
   */
  timeout(
    user: string,
    duration?: string,
    reason?: string,
    channel?: string,
  ): void;

  /**
   * Removes user's timeout.
   */
  untimeout: TUserCommand;

  /**
   * Whispers someone.
   * @param {string} user
   * @param {string} message
   * @param {string} channel
   */
  whisper(
    user: string,
    message: string,
    channel?: string,
  ): void;
}
```

#### Channels Repository
This repository is used to to do actions connected with channels.
##### Constructor
Constructor accepts single parameter - instance of `Client`. Repository will
use it to send messages via `say`.
##### Instance
```typescript
type TChannelCommand = (channel?: string) => void;
type TTargetedCommand = (target: string, channel?: string) => void;

interface IModeController {
  on: TChannelCommand;
  off: TChannelCommand;
}

interface IChannelsRepository {
  /**
   * Joins channel.
   * @param {string} channel
   */
  join(channel: string): void;

  /**
   * Leaves channel.
   * @param {string} channel
   */
  leave(channel: string): void;

  /**
   * Emote-only mode.
   */
  emoteOnly: IModeController;

  /**
   * Followers-only mode.
   */
  followersOnly: IModeController;

  /**
   * R9K mode.
   */
  r9k: IModeController;

  /**
   * Slowmode.
   */
  slowmode: {
    on(durationInSeconds: number, channel?: string): void;
    off: TChannelCommand;
  };

  /**
   * Deletes message from channel.
   * @param {string} messageId
   * @param {string} channel
   */
  deleteMessage(messageId: string, channel?: string): void;

  /**
   * Plays commercial ads.
   * @param {number} durationInSeconds
   * @param {string} channel
   */
  playCommercial(durationInSeconds: number, channel?: string): void;

  /**
   * Clears chat.
   */
  clearChat: TChannelCommand;

  /**
   * Hosts channel.
   */
  host: TTargetedCommand;

  /**
   * Unhosts.
   */
  unhost: TChannelCommand;

  /**
   * Raids channel.
   */
  raid: TTargetedCommand;

  /**
   * Unraids.
   */
  unraid: TChannelCommand;

  /**
   * Leaves a marker with comment.
   * @param {string} comment
   * @param {string} channel
   */
  marker(comment: string, channel?: string): void;

  /**
   * Says a message, looking like we did something.
   * @param {string} action
   * @param {string} channel
   */
  me(action: string, channel?: string): void;

  /**
   * Changes our chat color.
   * @param {string} color
   * @param {string} channel
   */
  changeColor(color: string, channel?: string): void;
}
```

#### UtilsRepository
This repository is kinda external but is opened on beta period due to
not all commands are realized at this time. In the future it will be hidden
via `private` security modifier.
##### Constructor
Constructor accepts single parameter - instance of `Socket`. Repository will
use it to send messages via `send`.
##### Instance
```typescript
interface IUtilsRepository {
  /**
   * Sends raw message by socket.
   * @param {string} message
   */
  sendRawMessage(message: string): void;

  /**
   * Sends command by socket.
   * @param {Command} command
   * @param {TCommandParams[Command]} params
   */
  sendCommand<Command extends TExecutableCommands>(
    command: Command,
    params: TCommandParams[Command],
  ): void;
}
```

#### EventsRepository
This repository is used to handle IRC events, parse and
react on them with bound listeners.
##### Constructor
Constructor accepts single parameter - instance of `Socket`. Repository will
use it to detect new messages.
##### Instance
```typescript
type TListeningManipulator = <Command extends TObservableEvents>(
  command: Command,
  listener: TCallbacksMap[Command],
) => void;

interface IEventsRepository {
  /**
   * Adds event listener for command.
   */
  on: TListeningManipulator;

  /**
   * Removes event listener from command.
   */
  off: TListeningManipulator;
}
```
