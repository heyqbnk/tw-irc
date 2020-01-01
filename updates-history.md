# Updates history
### Release 6.0.0
In this release library was fully reworked. It became much easier to use from 
this patch. 

Patch notes:
- `RoomsRepository` was temporarily removed;
- `Channels.join` now accepts channel with any casing. It will be automatically
lower cased. Previously joining was not working when you pass chanel not in 
lower case;
- Added field `channels?: string[]` to `Client` constructor props. Client will 
automatically join passed channels every time connection is opened (including
cases when client is reconnected) to provide stable flow work. This is
preferred way of defining channels for client, because `channels.join` will
not join channel again after connection is closed;
- `Socket.on` can now call listener once. Every listener is stashed inside
`Socket` instance. It means, firstly, that you can still unbind them via
`off` and, secondly, `once` listeners will always exist even WebSocket instance
inside was recreated (in case, there was a reconnect). So, `once` listener exist
until it is called not depending on to which WebSocket instance it is bound.
`Socket` removes this listener by himself;
- `HOSTTRAGET` listener data bugs were fixed;
- `USERNOTICE` listener data now gets `params` field in case there were
fields in meta starting with `msg-param`. `msg-param` fields exist when some 
unusual notice was sent (like `subgift`, `anonsubgift` etc). There is a special
type `TUserNoticeMessage<MsgId extends keyof IUserNoticeParamsMap | null>` 
which can help you to detect which notice occurred and which params exist;
- Data passed to listeners became less modified from original one. Almost
each listener gets an object with `parsedMessage` and `channel` (if exists).
So, if other data passed to listener is not enough, you can use `parsedMessage`
field, which have full info. This change was required because we wanted to
make it much more clear to understand for users;
- Message parsing methods were changed. They are a bit more accurate now;

### Release 5.0.0
#### Client
- Added shortcut methods `onConnect`, `onDisconnect`, `onMessage` and `onError`
for socket events;
- Added `forkRoom` and `forkChannel` methods returning instances of 
`RoomsForkedRepository` and `ChannelsForkedRepository`. It is useful when you 
don't want to always pass `place` parameter in channels and rooms repositories.
- Removed `assignRoom` and `assignChannel` methods due to unpredictable behaviour
during long processes. Replaced with `forkRoom` and `forkChannel`;

#### EventsRepository
- Removed `clear` method due to it is not supported;

#### RoomsRepository and ChannelsRepository
- `assign` method removed. Use `Client` fork methods instead;
- `place` parameter in methods is required now. Use `Client` fork methods
to escape this problem;

### Release 4.0.0
- Project folders were flatten for easier usage;
- Some folders were renamed;
- All typings are now exported to be used outside;
- Added an ability to observe custom signals with `string` event name 
(not `ESignal`). When a listener is bound to `string` signal, 
it should take 1 parameter - `message: IParsedIRCMessage`; 
- Such definition as `Observable signals` was removed from the project. 
Now you are able to observe any signal from IRC, but there is no guarantee
IRC sends this signal at all. This check was removed due to we will never
know which signals will appear in near future;
- Some improvements for `NOTICE` signal listener. Now you can use `ENoticeMessageId`
to detect which notice occurred. There was a bug for this feature - 
wrong enum used;

`WARNING`
Channels and rooms assigning features will be removed in near future releases.
So, please, prepare your code to work properly. We will not just remove these
things, but replace with something same but working much more expected than
currently.

### Release 3.0.7
It looks like Twitch is observing sent messages and gives them flags
which say if message contains something bad. It is not documented, so I
am not sure, but it is 100% that Twitch detects bad words and mark them.

- Removed a bug when user sends a message with bad word and `tw-irc` was
unable to parse this message due to bad code. As a result, exception
was thrown.
- Added `flags` field for `USERNOTICE` and `PRIVMSG` signals listeners data.

### Release 3.0.5
#### Socket
- Removed a bug when it was unable to remove listener from websocket with `off`
method

### Release 3.0.0
`WARNING: BREAKING CHANGES`

It is the latest big release. All the other fixes will be connected with
bug fixes or small changes. It looks like the library is done and now I am 
focusing on new one for New Twitch API.

#### Client
- `client.connect()` now returns a `Promise`, which will be resolved when
socket connection is successfully opened.
- `client.on()` now throws an error if passed event is not observable.
- `client.say()` was moved to `client.channels`.
- `client.assignRoom()` was added.

#### Channels
- `leave(channel: string)` was replaced with `disconnect(channel: string)`.
- `followerOnly()` now accepts *optional* object 
`{ duration?: string, channel?: string }`.
- `slowmode()` now accepts *optional* object 
`{ duration?: number, channel?: string }`.
- `slowmode()` now throws an error if `duration` is less than `0`.
- `playCommercial()` now accepts *optional* object 
`{ duration?: number, channel?: string }`.
- `playCommercial()` now throws an error if `duration` is less than `0`.
- `marker()` now accepts *optional* object 
`{ comment?: string, channel?: string }`.
- `clearChat()` was replaced with `clear()`.

#### Events
- `Join`, `Message`, `Notice`, `RoomState`, `UserState` listeners now return
parameter `channel` or `room` depending on where event occurred.

#### Users
Repository was removed from client.

#### Rooms
Repository was added to client. Its instance is available in `client.rooms`. 

#### Other
Added `client.rooms` docs.

### Release 2.0.0
`WARNING: BREAKING CHANGES`

#### Client
- `bindChannel` was replaced with `assignChannel.`

#### Events
- `Bugfix:` `Notice` listener now gets parameter `message`

#### Channels
- Mode-oriented fields were reworked. Their values were changed from
`{ on: function, off: function }` to `{ enable: function, disable: function }`
due to `on` and `off` look like events listening. Example:
```typescript
// Old
client.channels.followersOnly.on();

// New
client.channels.followersOnly.enable();
```
- `followersMode.enable` now is able to accept duration in minutes. This
time interval means how long should user follow the channel to say something
in chat. (`/followers 60` - if we want to allow to say something only
for users, who is following for 60 minutes at least)

#### Docs
- Added `API documentation` section

---

### Release 1.1.6
`WARNING: BREAKING CHANGES`

This update is rather huge and breaks compatibility. Make sure,
you updated package and reworked your code a bit. There are
a lot of internal changes, but they should not touch external interface
too much.

#### Events
- `Join` listener reworked. It now contains additional join data 
about `channelId` and `roomUuid` if someone joined chat-room.
- `Message` listener reworked. It now contains additional message data.
- `ClearChat` listener ready. It detects chat clears and user bans.
- `ClearMessage` listener ready. It detects messages delete.
- `GlobalUserState` listener ready. On successful login, provides 
data about the current logged-in user through IRC tags. It is sent 
after successfully authenticating (sending a PASS/NICK command).
> You can use this listener to detect successful login.
- `Host` listener ready. It detects someone's host start and stop. Notice, that this event listener will be triggered
only ON channel, that triggered HOST, not on channel which IS BEING
HOSTED (IRC does not detect it).
- `Reconnect` listener ready. It detects if IRC requested a
reconnect for you.
> Dont use it in case, you want to manually reconnect client. 
> `Socket` will do it for you automatically.
- `RoomState` listener ready. It is triggered when you join some
channel or channel changed its state (like mode change).
- `Notice` listener ready. Receive a general notice from the server.

- All listeners now have property `raw`, which contains raw message
from IRC. 
- `UserNotice` listener ready. Trigger specification:
https://dev.twitch.tv/docs/irc/tags#usernotice-twitch-tags
- `UserState` listener ready. Sends user-state data when a user joins a 
channel or sends a PRIVMSG to a channel.
- Constructor now accepts `login` as string additionally.
It is needed due to this repo should recognize, if event
is somehow connected with our client. It means, property
`isSelf` appeared in some listeners returned params.

#### Utils
- `sendRawMessage` was removed. Use `client.socket.send()` now instead.
- `sendCommand` was replaced with `sendSignal`.

#### Socket
- Now `Socket` detects if IRC requested a `RECONNECT` event, 
automatically reconnecting client.
- It is now responsible for requesting initial capabilities. Previously
`Client` did it.

#### Client
- Now **THROWS** error instead of warning user in case password is
invalid. The reason is developer can skip this message, having an unexpected 
behaviour, but client will work fine.
- Now has property `login`, which states currently used Twitch login
by client instance. This field is used by EventsRepository to detect
if called event is ours.

#### Other
- Temporarily removed API documentation. Will be added in `v1.2.0`.
- `EIRCCommand` was renamed to `ESignal` which has a bit more accurate name.
- Template like `moderator/5` (badge information) is now parsed like 
`{ name: "moderator", value: 5 }`. This template can appear in message
event (`ESignal.Message`)
- Template like `Kappa:2-5,29-30` (emotes information) is now parsed like
`{ emoteId: "Kappa", ranges: [{ from: 2, to: 5 }, { from: 29, to: 30 }]}`
- `prepareIRCMessage`'s result field `command` was replaced with `signal`.

---

### Release 1.1.5
- Added huge amount of docs
- Added implementation interfaces for classes
- Added warning if password is incorrect (starting not with `oauth:`)
- Reworked `prepareIRCMessage`. It checks if the last letter was `\n`, method 
removes it and split by `\n`.
- Socket is now responsible for keeping a connection alive via responding 
with `PONG` message in server's `PING`.
