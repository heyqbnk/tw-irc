tw-irc
===  

[![NPM version][npm-image]][npm-url]
![Dependencies][deps-image]
![Size][size-image]
![Version][version-image]

[deps-image]: https://img.shields.io/david/wolframdeus/tw-irc
[npm-image]: https://img.shields.io/npm/dm/tw-irc
[npm-url]: https://www.npmjs.com/package/tw-irc
[size-image]: https://img.shields.io/bundlephobia/minzip/tw-irc
[version-image]: https://img.shields.io/npm/v/tw-irc

## Overview  
Here is a library that handles connection to Twitch IRC. It allows you to join 
or leave channels, detect and send new messages and other.

Compatible for both `node` and `browser`. 

## Table of contents
- [Install](#install)
- [Usage](#usage)
    - [Basic](#basic)
    - [Authenticated client](#authenticated-client)
    - [Using channel commands](#using-channel-commands)
    - [Forking channels and rooms](#forking-channels-and-rooms)
    - [Getting full control](#getting-full-control)
- [Example](#example)
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
To start working with Twitch IRC, we have to create a client. You can specify
if connection is `secure`, pass `channels` which client will automatically
join on connection established, or pass `auth` data which is required to
send messages from someones face.

### Basic
```typescript
import Client, {ECommand} from 'tw-irc';

const {Message} = ECommand;

// Create IRC client
const client = new Client();

// Bind events before connect. Just watch for incoming messages
client.on(Message, ({message, displayName}) => {
  console.log(`User ${displayName} said: "${message}"`);
});

// When socket connection is successfully opened, join channel
client.onConnected(() => {
  client.channels.join('rxnexus');
});

// Connect client to IRC
client.connect();
```

### Authenticated client
```typescript
import Client from 'tw-irc';

// Create authenticated IRC client
const client = new Client({
  channels: ['rxnexus'],
  secure: true, // secure connection recommended
  auth: {
    login: 'twitchfan', // your Twitch login
    password: 'oauth:...', // oauth token. Get it here: https://twitchapps.com/tmi/
  },
});

client.onConnected(() => {
  // Say hi!
  client.channels.say('Hello @rxnexus!', 'rxnexus');
});

client.connect();
```

### Using channel commands
`tw-irc` supports all of the channel modes and commands.
```typescript
import Client from 'tw-irc';

const client = new Client();

client.onConnected(() => {
  client.channels.join('rxnexus');

  // Ban someone
  client.channels.ban('troll123', 'rxnexus');

  // Set emote-only mode
  client.channels.emoteOnly.enable('rxnexus');
});

client.connect();
```

### Forking channels
For easier usage you can create channels controllers from client.

```typescript
import Client from 'tw-irc';

const client = new Client();

client.onConnected(() => {
  // Create channel controller
  const channel = client.fork('rxnexus');
  
  // Join channel
  channel.join();

  // Say hi
  channel.say('Hello!');

  // Set emote only mode
  channel.emoteOnly.enable();

  // Ban some troll in channel
  channel.ban('troll123');
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

## Example
There are 2 examples for [node](https://github.com/wolframdeus/tw-irc/blob/master/examples/node-example.js) 
and [browser](https://github.com/wolframdeus/tw-irc/blob/master/examples/browser-example.ts).

Running node version:
1. Clone repo;
2. Type `yarn dev-node` or `npm run dev-node`;

Running browser version:
1. Clone repo;
2. Type `yarn dev` or `npm run dev`;
3. Open browser and go to `http://localhost:9000`;
4. Open console; 

## Updates history
You can find updates history [here](https://github.com/wolframdeus/tw-irc/blob/master/updates-history.md).

## License
MIT
