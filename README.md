# tw-irc  
  
Here is a library that handles connection to Twitch IRC. It allows you to join or leave channels, detect and send new messages and other.

We expect, you are using TypeScript, because some error protection mechanisms inside this library are based on TypeScript typings restrictions.

## Features
This library will be useful, if you want to:
- Send messages via chat
- Detect all the events sent from IRC (messages, joins, leaves, bans, notices and other)
- Take full control over rooms
- Create your own bot

## Documentation
### Create client
Library contains a client, that connects to Twitch IRC. Here is an example to create an instance of this client:

```typescript
import { Client } from 'tw-irc';

// Create anonymous client
const client = new Client();

// Create client with authentication. It will allow us to send messages.
const authenticatedClient = new Client({
  auth: {
    login: '...', // login used to sign in Twitch
    password: '...', // get it here: https://twitchapps.com/tmi/
  },
});
```  

### Connect to IRC  
After client is created, we have to initialize socket connection to Twitch IRC. We need to create an instance of `Socket` which will try to connect to IRC. After `connect()` is called, previous `WebSocket` will be disconnected.

Remember, that `Socket` is a wrapper around `WebSocket`, it contains all bound listeners. The reason is `WebSocket`'s API does not allow us to reconnect, it requires new instance initialization. So, wrapper is the best way to handle `WebSocket`'s processes and restrictions.
   
```typescript
// Connect to IRC
client.connect();
```

### Channel binding  
In case, you want to use this client only for 1 channel, you can remember it in the client, to shorten commands call. Otherwise, you will always have to pass parameter `channel` in commands.

There is no difference, when to call `assignChannel`, before or after `connect`
was called. This method just remembers passed channel.
  
```typescript
// Previously, we have to call command with:
client.channels.emoteOnly.enable('summit1g');
  
// But we can remember the channel, to shorten command calls. After channel
// bind, all commands without passed channel will take last assigned channel.
client.assignChannel('summit1g');
client.channels.emoteOnly.enable();
```

## Events
Client supports 2 types of events - WebSocket events (`message`, `open`, `close`, `error`) and IRC events.

### WebSocket events  
These events are directly bound to created WebSocket (watch [WebSocket specs](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) for more info) after `connect()`:
```javascript
function onMessage(event) {
 console.log('Socket message event occurred', event);
}

// Start listening
client.socket.on('message', onMessage);

// Remove listener
client.socket.off('message', onMessage);
```  

> **Warning**: Try not to add events listeners inside events listeners, or handle this behaviour correctly. The reason is listeners are stashed inside client.socket instance and client.disconnect() does not remove them. *You have to remove them manually if it is required*.  

The second thing you have to know is you should not use client commands like `ban`, `say` and other before the connection was successfully established. You can detect its existence by calling `getReadyState()` method which returns `ESocketReadyState`.
 
*Reference: [Socket ready states](https://github.com/wolframdeus/tw-irc/blob/79154d6b1e7940a3d3d679730276794dadfd120c/lib/socket/types.ts#L32)*

```typescript
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
  
Otherwise, you can call these methods after `open` event of `client.socket`was called, like:
```typescript  
client.socket.on('open', () => { 
  // OK, we got stable connection. Join some channel. 
  const channel = 'sodapoppin';
  
  client.channels.join(channel);
  
  // Say something in channel
  client.say('Hello @sodapoppin', channel);
});
  
client.connect();  
```  
  
### IRC events  
Library contains special enum `ESignal` which allows you to use dictionary instead of raw texts. Each listener gets different list of parameters depending on passed `ESignal`.
  
*Reference: [Observable events](https://github.com/wolframdeus/tw-irc/blob/master/lib/repositories/events/types/observable.ts), 
[event parameters](https://github.com/wolframdeus/tw-irc/blob/79154d6b1e7940a3d3d679730276794dadfd120c/lib/repositories/events/types/params.ts#L107)*  
```typescript  
import { ESignal } from 'tw-irc';  
  
client.socket.on('open', () => {  
  // Firstly, we have to join some channel  client.channels.join('summit1g');  
  // Bind event to listen to "PRIVMSG" event  
  client.on(ESignal.Message, console.log);  
});  
```   
### Custom IRC messages handling  
If you want full control over the messages coming from IRC, you can use this trick:
```typescript  
import { parseIRCMessage, prepareIRCMessage } from 'tw-irc/utils';  
  
client.socket.on('message', event => {  
  // Convert raw socket message to array of messages. We need this action 
  // because commands can be concatenated in one message and doing this, 
  // we just detect them. 
  const messages = prepareIRCMessage(event.data);  
  
  // Parse each of the messages  
  const parsedMessages = messages.map(parseIRCMessage);  
  
  parsedMessages.forEach(message => {  
    // You can react however you want after all of messages are parsed. 
  });
});  
```  
  
*Reference: [Parameters returned from `prepareIRCMessage`](https://github.com/wolframdeus/tw-irc/blob/79154d6b1e7940a3d3d679730276794dadfd120c/lib/types/parsing.ts#L34)*  
  
## API documentation  
### Types  
#### All IRC signals  
List of signals used in project  
```typescript  
enum ESignal {
  CapabilityRequest = 'CAP REQ',
  ClearChat = 'CLEARCHAT',
  ClearMessage = 'CLEARMSG',
  GlobalUserState = 'GLOBALUSERSTATE',
  Host = 'HOSTTARGET',
  Join = 'JOIN',
  Leave = 'PART',
  Message = 'PRIVMSG',
  Nickname = 'NICK',
  Notice = 'NOTICE',
  Password = 'PASS',
  Ping = 'PING',
  Pong = 'PONG',
  Reconnect = 'RECONNECT',
  RoomState = 'ROOMSTATE',
  UserNotice = 'USERNOTICE',
  UserState = 'USERSTATE',
}  
```  
  
#### Observable signals  
List of signals, that can be observed with `client.on()`  
```typescript
type TObservableSignals =
  ESignal.ClearChat
  | ESignal.ClearMessage
  | ESignal.GlobalUserState
  | ESignal.Host
  | ESignal.Join
  | ESignal.Leave
  | ESignal.Message
  | ESignal.Notice
  | ESignal.Reconnect
  | ESignal.RoomState
  | ESignal.UserNotice
  | ESignal.UserState;  
```  

#### Other
```typescript
interface IRoom {
  channelId: string;
  roomUuid: string;
}
```
  
### Client  
#### `Constructor:` `new Client()`  
Without parameters:  
```typescript  
const client = new Client();  
```  
With parameters:  
```typescript  
const auth = {  
  login: 'tobii', 
  // Password must start with "oauth:". Otherwise, an error will be thrown. 
  password: 'oauth:...'
};  
  
const client = new Client({  
  // Connection will be secured 
  secure: true, 
  // Authentication data used to identify you in Twitch IRC. Remember, 
  // that you will not be able to send any messages, until you signed in 
  // with correct data. 
  auth,
});  
```  
  
#### `Function:` `connect()`  
Initializes new WebSocket connection with created internally instance of `Socket`.  
```typescript  
// Connect to IRC  
client.connect();  
```  
  
#### `Function:` `disconnect()`  
Calls `disconnect` method of `Socket` instance created internally, what means `WebSocket` will be closed.  
> **NOTE**: It does not mean, that all your bound events will be automatically removed. All bound events are stashed inside `Socket` instance which is wrapper around `WebSocket`. So, if you call `disconnect()` and then `connect()`, all previously bound event listeners will still work and you dont have to bind them again.  

```typescript  
// Disconnect from IRC  
client.disconnect()  
```  
  
#### `Function:` `on(signal, listener)`  
Adds signal listener. Triggers on incoming message from IRC in case, its command is equal to listener's.  
  
*Reference: [Returned event parameters](https://github.com/wolframdeus/tw-irc/blob/79154d6b1e7940a3d3d679730276794dadfd120c/lib/repositories/events/types/params.ts#L107)*  
  
| Argument | Type | Description |  
| --- | --- | --- |  
| `signal` | `one of TObservableSignals` | Signal to observe |  
| `listener` | `(params: IEventParams[signal]) => void` | Listener which will be triggered when signal catched |  
  
```typescript  
// Start listening for PRIVMSG event  
client.on(ESignal.Message, params => {  
  console.log('Event PRIVMSG occurred', params);
});  
```  
  
#### `Function:` `off(signal, listener)`  
Have the same parameters as `on(signal, listener)`. Removes listener from signal.   
  
```typescript  
const listener = params => {  
  console.log(console.log('Event PRIVMSG occurred', params));
};  
  
// Starting listening for PRIVMSG event  
client.on(ESignal.Message, listener);  
  
// Remove previously bound event listener  
client.off(ESignal.Message, listener);  
```  
  
#### `Function:` `assignChannel(channel)`  
Assigns channel to client. As a result, you will have no need to always set 
`channel` in commands like `client.channels.timeout()`, `client.channels.ban()`
and other. Channel will be automatically taken from `client.channels`.  
  
| Argument | Type | Description |  
| --- | --- | --- |  
| `channel` | `string` | Channel to assign to client |  
  
```typescript  
// Bind channel "sodapoppin" to client.  
client.assignChannel('sodapoppin');  
```  

#### `Function:` `assignRoom(room)`  
Assigns room to client. As a result, you will have no need to always set 
`room` in commands like `client.rooms.timeout()`, `client.rooms.ban()`
and other. Room will be automatically taken from `client.rooms`.  
  
| Argument | Type | Description |  
| --- | --- | --- |  
| `room` | `IRoom` | Room to assign to client |  
  
```typescript    
client.assignRoom({ clientId: '2315', roomUuid: 'ds-a021kss' });  
```

### `Namespace:` `client.rooms`
This namespace is responsible for actions connected with rooms.

#### `Function:` `join(room)`  
Join some room. To receive messages from channel, it is required to use this method.
  
| Argument | Type | Description |  
| --- | --- | --- |  
| `room` | `IRoom` | Target room |  
  
```typescript  
client.rooms.join({ clientId: '2315', roomUuid: 'ds-a021kss' });  
```

#### `Function:` `say(message, room?)`  
Say message in room.
  
| Argument | Type | Description |  
| --- | --- | --- |
| `message` | `string` | Message to say |  
| `room?` | `IRoom?` | Target room |  
  
```typescript    
client.rooms.say('Hey soda!', { clientId: '2315', roomUuid: 'ds-a021kss' });
```  

#### `Function:` `ban(user, room?)` and `unban(user, room?)`  
Permanently prevent a user from chatting.  
  
| Argument | Type | Description |  
| --- | --- | --- |  
| `user` | `string` | Target user |  
| `room?` | `IRoom?` | Target room |  
  
```typescript    
client.rooms.ban('justin', { clientId: '2315', roomUuid: 'ds-a021kss' });  
client.rooms.unban('justin', { clientId: '2315', roomUuid: 'ds-a021kss' });  
``` 

#### `Function:` `timeout(options)`  
Temporarily prevent a user from chatting. Duration (optional, default=10 minutes) must be a positive integer; time unit (optional, default=s) must be one of s, m, h, d, w; maximum duration is 2 weeks. Combinations like 1d2h are also allowed. Reason is optional and will be shown to the target user and other moderators.  
  
| Argument | Type | Description |  
| --- | --- | ---  |  
| `options.user` | `string` | Target user |  
| `options.duration?` | `string?` | Timeout duration |  
| `options.reason?` | `string?` | Reason, why user was given a timeout |  
| `options.place?` | `IRoom?` | Target room |  
  
```typescript  
client.rooms.timeout('justin', '20m', 'Bullying', { clientId: '2315', roomUuid: 'ds-a021kss' });  
```   

#### `Function:` `untimeout(user, room?)`  
Removes a timeout on a user.  
  
| Argument | Type | Description |  
| --- | --- | --- |  
| `user` | `string` | Target user |  
| `room?` | `IRoom?` | Target room |  
  
```typescript    
client.rooms.untimeout('justin', { clientId: '2315', roomUuid: 'ds-a021kss' });  
```  

#### `Function:` `whisper(user, room?)`  
Whispers a user.  
  
| Argument | Type | Description |  
| --- | --- | --- |  
| `user` | `string` | Target user |  
| `room?` | `IRoom?` | Target room |  
  
```typescript    
client.rooms.whisper('justin', { clientId: '2315', roomUuid: 'ds-a021kss' });  
```  

#### `Function:` `emoteOnly.enable(room?)` and `emoteOnly.disable(room?)`  
Enables emote-only mode (only emoticons may be used in chat).  
  
| Argument | Type | Description |  
| --- | --- | --- |  
| `room?` | `IRoom?` | Target room |  
  
```typescript    
client.rooms.emoteOnly.enable({ clientId: '2315', roomUuid: 'ds-a021kss' });    
client.rooms.emoteOnly.disable({ clientId: '2315', roomUuid: 'ds-a021kss' });  
```

#### `Function:` `r9k.enable(room?)` and `r9k.disable(room?)`  
Enables / Disables  r9k mode.    
  
| Argument | Type | Description |  
| --- | --- | --- |  
| `room?` | `IRoom?` | Target room |  
  
```typescript    
client.rooms.r9k.enable({ clientId: '2315', roomUuid: 'ds-a021kss' });    
client.rooms.r9k.disable({ clientId: '2315', roomUuid: 'ds-a021kss' });  
```

#### `Function:` `slowmode.enable(options?)`  
Enables slow mode (limit how often users may send messages).
Duration (optional, default=30) must be a positive number of seconds.
  
| Argument | Type | Description |  
| --- | --- | --- |  
| `options.duration?` | `number?` | Duration |
| `options.place?` | `IRoom?` | Target room |  
  
```typescript    
client.rooms.slowmode.enable({ duration: 30, place: { clientId: '2315', roomUuid: 'ds-a021kss' } });      
```

#### `Function:` `slowmode.disable(room?)`
Disables slow mode (limit how often users may send messages). 

| Argument | Type | Description |  
| --- | --- | --- |  
| `room?` | `IRoom?` | Target room |  
  
```typescript        
client.rooms.slowmode.disable({ clientId: '2315', roomUuid: 'ds-a021kss' });  
```

#### `Function:` `clear(room?)`  
Clear room's chat.  
  
| Argument | Type | Description |  
| --- | --- | --- |  
| `room?` | `IRoom?` | Target room |  
  
```typescript    
client.rooms.clear({ clientId: '2315', roomUuid: 'ds-a021kss' });
```  

#### `Function:` `me(action, room?)`  
Send an "emote" message in the third person.  
  
| Argument | Type | Description |  
| --- | --- | --- |  
| `action` | `string` | Your action |  
| `room?` | `IRoom?` | Target room |  
  
```typescript    
client.rooms.me('just killed a demon!', { clientId: '2315', roomUuid: 'ds-a021kss' });  
```  

#### `Function:` `changeColor(color, room?)`  
Change your username color. Color must be in hex (#000000) or one of the following: Blue, BlueViolet, CadetBlue, Chocolate, Coral, DodgerBlue, Firebrick, GoldenRod, Green, HotPink, OrangeRed, Red, SeaGreen, SpringGreen, YellowGreen.  
  
| Argument | Type | Description |  
| --- | --- | --- |  
| `color` | `string` | New color |  
| `room?` | `IRoom?` | Target room |  
  
```typescript  
client.rooms.changeColor('#FF0000', { clientId: '2315', roomUuid: 'ds-a021kss' });  
```  

### `Namespace: client.channels`  
This namespace is responsible for actions connected with channels.

> **NOTE**: `client.rooms` and `client.channels` extends the same class,
but have the only small differences. `channels` have the same methods
as `rooms`, but instead of accepting `room`, which is `object`, they
accept `channel`, which is `string`. These methods are not described
in `client.channels`, but described in `client.rooms`. Wherever you see
`place` or `room`, it is `string` meaning channel name. 

#### `Function:` `disconnect(channel)`  
Leave channel.  
  
| Argument | Type | Description |  
| --- | --- | --- |  
| `channel` | `string` | Target channel |  
  
```typescript    
client.rooms.disconnect('sodapoppin');
```  

#### `Function:` `followersOnly.enable(options?)`  
Enables followers-only mode.
  
| Argument | Type | Description |  
| --- | --- | --- |  
| `options.duration?` | `number?` | Duration |
| `options.place?` | `string?` | Target channel |  
  
```typescript    
client.rooms.followersOnly.enable({ duration: 30, place: 'sodapoppin' });      
```

#### `Function:` `followersOnly.disable(channel?)`
Disables followers-only mode.

| Argument | Type | Description |  
| --- | --- | --- |  
| `channel?` | `string?` | Target channel |  
  
```typescript        
client.rooms.followersOnly.disable('sodapoppin');  
```  

#### `Function:` `deleteMessage(id, channel?)`  
Deletes the specified message.  
  
| Argument | Type | Description |  
| --- | --- | --- |  
| `id` | `string` | ID of message |  
| `channel?` | `string?` | Target channel |  
  
```typescript    
client.channels.deleteMessage('sja1i-3adqww-2131', 'sodapoppin');  
```  
  
  
#### `Function:` `playCommercial(options?)`  
Triggers a commercial.  
  
| Argument | Type | Description |  
| --- | --- | --- |  
| `options.duration?` | `number` | Duration in seconds |  
| `options.channel?` | `string?` | Target channel |  
  
```typescript    
client.channels.playCommercial(180, 'sodapoppin');  
``` 

#### `Function:` `host(targetChannel, channel?)`  
Host another channel.  
  
| Argument | Type | Description |  
| --- | --- | --- |  
| `targetChannel` | `string` | Target channel |  
| `channel?` | `string?` | Hosting channel |  
  
```typescript    
client.channels.raid('summit1g', 'sodapoppin');  
```  
  
  
#### `Function:` `unhost(channel?)`  
Stop host.  
  
| Argument | Type | Description |  
| --- | --- | --- |  
| `channel?` | `string?` | Hosting channel |  
  
```typescript    
client.channels.unhost('sodapoppin');  
```  

#### `Function:` `raid(targetChannel, channel?)`  
Raid another channel.  
  
| Argument | Type | Description |  
| --- | --- | --- |  
| `targetChannel` | `string` | Target channel |  
| `channel?` | `string?` | Hosting channel |  
  
```typescript    
client.channels.raid('summit1g', 'sodapoppin');  
```  
  
  
#### `Function:` `unraid(channel?)`  
Stop raid.  
  
| Argument | Type | Description |  
| --- | --- | --- |  
| `channel?` | `string?` | Hosting channel |  
  
```typescript  
client.channels.unraid('sodapoppin');  
```  

#### `Function:` `marker(options?)`  
Adds a stream marker (with an optional comment, max 140 characters) at the current timestamp. You can use markers in the Highlighter for easier editing.  
  
| Argument | Type | Description |  
| --- | --- | --- |  
| `options.comment?` | `string?` | Marker comment |  
| `options.channel?` | `string?` | Target channel |  
  
```typescript    
client.channels.marker('Nice highlight!', 'sodapoppin');  
```  
  
  
#### `Function:` `mod(user, channel?)` and `unmod(user, channel?)`  
Grant / revoke moderator status to / from a user.  
  
| Argument | Type | Description |  
| --- | --- | --- |  
| `user` | `string` | Target user |  
| `channel?` | `string?` | Target channel |  
  
```typescript    
client.channels.mod('justin', 'sodapoppin');  
client.channels.unmod('justin', 'sodapoppin');  
```  
  
  
#### `Function:` `vip(user, channel?)` and `unvip(user, channel?)`  
Grant / revoke VIP status to / from a user.  
  
| Argument | Type | Description |  
| --- | --- | --- |  
| `user` | `string` | Target user |  
| `channel?` | `string?` | Target channel |  
  
```typescript    
client.channels.vip('justin', 'sodapoppin');  
client.channels.unvip('justin', 'sodapoppin');  
```  
