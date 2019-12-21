import {
  IPrefix,
  IMeta,
  TMetaValue,
  IEmote,
  IBadge,
  IParsedIRCMessage,
  IFlag,
} from './types';

/**
 * Converts text to camel case.
 * @param {string} text
 * @returns {string}
 */
export function toCamelCase(text: string): string {
  return text.replace(/-[a-z]/gi, match => {
    return match.slice(1).toUpperCase();
  });
}

/**
 * Parses emote.
 * @param {string} value
 * @returns {IEmote}
 */
export function parseEmote(value: string): IEmote {
  const [emoteId, emotesRaw] = value.split(':');
  const ranges = emotesRaw
    .split(',')
    .map(item => {
      const [from, to] = item.split('-').map(Number);

      return {from, to};
    });

  return {emoteId: parseInt(emoteId, 10), ranges};
}

/**
 * Parses flag.
 * @param value
 */
export function parseFlag(value: string): IFlag {
  const [rangeRaw, labelsRaw] = value.split(':');
  const [from, to] = rangeRaw.split('-').map(Number);
  const range = {from, to};
  const labels = labelsRaw.split('/').map(labelRaw => {
    const [letter, numberStr] = labelRaw.split('.');

    return {letter, number: parseInt(numberStr)};
  });

  return {range, labels};
}

/**
 * Strictly returns safe pool of values.
 * @param {string} value
 * @returns {string | number}
 */
export function parseMetaValue(value: string): TMetaValue {
  const asNumber = parseInt(value, 10);

  // Is number
  if (asNumber.toString() === value) {
    return asNumber;
  }

  // Is emote
  if (value.includes(':')) {
    if (value.includes('.')) {
      const values = value.split(',');

      return values.map(parseFlag);
    }

    if (value.includes('/')) {
      const values = value.split('/');

      return values.map(parseEmote);
    }

    return parseEmote(value);
  }

  // Is array
  if (value.includes(',')) {
    // Recursively parse values of array
    return value
      .split(',')
      .map(parseMetaValue) as Array<string | number | IBadge | IEmote>;
  }

  // Is badge
  if (value.includes('/')) {
    const [badge, val] = value.split('/');

    return {badge, version: parseInt(val, 10)} as IBadge;
  }

  return value;
}

/**
 * Parses IRC meta.
 * @returns {TMeta | null}
 * @param metaRaw
 */
export function parseMeta(metaRaw: string): IMeta | null {
  const meta = metaRaw[0] === '@' ? metaRaw.slice(1) : metaRaw;
  if (meta === '') {
    return null;
  }

  return meta.split(';').reduce(
    (acc, entry) => {
      const [key, value] = entry.split('=');
      acc[toCamelCase(key)] = value.length === 0
        ? null
        : parseMetaValue(value);

      return acc;
    },
    {} as IMeta,
  );
}

export function parsePrefix(prefix: string): IPrefix | null {
  if (prefix.includes('!')) {
    const match = prefix.match(/(.*)!(.*)@(.*)/);

    if (!match) {
      return null;
    }
    const [, nickName, user, host] = match;

    return {nickName, user, host};
  }

  return {user: null, host: prefix, nickName: null};
}

/**
 * Splits message into chunks (sub-messages).
 * @param {string} message
 * @returns {string[]}
 */
export function prepareIRCMessage(message: string): string[] {
  if (message.length === 0) {
    return [];
  }
  if (message[message.length - 1] === '\n') {
    return message.slice(0, -1).split('\n');
  }

  return message.split('\n');
}

/**
 * Parses IRC message.
 * @returns {any}
 * @param messageRaw
 */
export function parseIRCMessage(messageRaw: string): IParsedIRCMessage {
  const message = messageRaw.startsWith(':')
    ? ' ' + messageRaw
    : messageRaw;
  const [metaRaw, payloadRaw, ...dataRaw] = message
    .split(' :')
    .map(item => item.trim());
  const data = dataRaw.join(' :') || null;

  // Message: PING :tmi.twitch.tv
  if (metaRaw.match(/^[A-Z]+/)) {
    return {
      prefix: parsePrefix(payloadRaw),
      meta: null,
      parameters: null,
      signal: metaRaw,
      data,
      raw: message,
    };
  }

  const [prefixRaw, signal, ...parameters] = payloadRaw.split(' ');
  const prefix = parsePrefix(prefixRaw);

  return {
    prefix,
    meta: parseMeta(metaRaw),
    parameters,
    signal,
    data,
    raw: messageRaw,
  };
}
