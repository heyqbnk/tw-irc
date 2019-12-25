# tw-irc  
  
Here is a library that handles connection to Twitch IRC. It allows you to join or leave channels, detect and send new messages and other.

## Table of contents
- [Install](#install)
- [Usage](#usage)
    - [Basic](#basic)
    - [Authenticated client](#authenticated-client)
    - [Using channel commands](#using-channel-commands)
    - [Forking channels and rooms](#forking-channels-and-rooms)
    - [Getting full control](#getting-full-control)
- [Updates history](#updates-history)
- [License](#license)

## Install
```
npm install --save tw-irc
```
```
yarn add tw-irc
```

## Usage
### Basic
```typescript
import Client, {ESignal} from 'tw-irc';

const {Message} = ESignal;

// Create IRC client
const client = new Client();

// Bind events before connect. Just watch for incoming messages
client.on(Message, ({message, author}) => {
  console.log(`User ${author} said "${message}"`);
});

// When socket connection is successfully opened, join "summit1g" channel.
client.onConnected(() => {
  client.channels.join('summit1g');
});

// Connect client to IRC
client.connect();
```

### Authenticated client
You are able to pass authentication data to client and then
communicate with IRC as some person (or bot).

```typescript
import Client from 'tw-irc';

// Create authenticated IRC client
const client = new Client({
  secure: true, // secure connection recommended
  auth: {
    login: 'twitchfan', // your Twitch login
    password: 'oauth:...', // oauth token. Get it here: https://twitchapps.com/tmi/
  },
});

// When socket connection is successfully opened, join "summit1g" channel.
client.onConnected(() => {
  // Join channel
  client.channels.join('summit1g');
  
  // Say hi!
  client.channels.say('Hello @summit1g!');
});

client.connect();
```

### Using channel commands
`tw-irc` supports all of the channel modes and commands.
```typescript
import Client from 'tw-irc';

const client = new Client();

client.onConnected(() => {
  client.channels.join('summit1g');
  
  // Set emote only mode
  client.channels.emoteOnly.enable('summit1g!');

  // Ban some troll in channel
  client.channels.ban('troll5221', 'summit1g');
});

client.connect();
```

### Forking channels and rooms
For easier usage you can create channels and rooms controllers from client.

```typescript
import Client from 'tw-irc';

const client = new Client();

client.onConnected(() => {
  // Create channel controller for "summit1g" channel.
  const summitChannel = client.forkChannel('summit1g');
  
  // Join channel
  summitChannel.join();

  // Say hi
  summitChannel.say('Hello summit!');

  // Set emote only mode
  summitChannel.emoteOnly.enable();

  // Ban some troll in channel
  summitChannel.ban('troll5221');
});

client.connect();
```

### Getting full control
If you want full control over the messages coming from IRC, you can use this trick:
```typescript
import Client from 'tw-irc';
import {prepareIRCMessage, parseIRCMessage} from 'tw-irc/utils';

const client = new Client();

client.onMessage(event => {
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

client.connect();
```

## Updates history
You can find updates history here - https://github.com/wolframdeus/tw-irc/blob/master/updates-history.md

## License
MIT
