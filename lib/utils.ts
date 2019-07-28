import { EIRCCommand, TMeta, TMetaValue } from './types/irc';

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

/**
 * Converts text to camel case.
 * @param {string} text
 * @returns {string}
 */
function toCamelCase(text: string): string {
  return text.replace(/-[a-z]/gi, match => {
    return match.slice(1).toUpperCase();
  });
}

/**
 * Strictly returns string or number.
 * @param {string} value
 * @returns {string | number}
 */
function parseSafeMetaValue(value: string): string | number {
  const asNumber = parseInt(value, 10);

  if (asNumber.toString() === value) {
    return asNumber;
  }

  return value;
}

/**
 * Parses meta value.
 * @param {string} value
 * @returns {TMetaValue}
 */
function parseMetaValue(value: string): TMetaValue {
  if (value.length === 0) {
    return null;
  }

  // Is array
  if (value.includes(',')) {
    // Recursively parse values of array
    return value.split(',').map(parseSafeMetaValue);
  }

  return parseSafeMetaValue(value);
}

/**
 * Parses IRC meta.
 * @param {string} meta
 * @returns {TMeta | null}
 */
function parseMeta(metaRaw: string): TMeta | null {
  const meta = metaRaw[0] === '@' ? metaRaw.slice(1) : metaRaw;
  if (meta === '') {
    return null;
  }

  return meta.split(';').reduce(
    (acc, entry) => {
      const [key, value] = entry.split('=');
      acc[toCamelCase(key)] = parseMetaValue(value);

      return acc;
    },
    {} as TMeta,
  );
}

function parsePrefix(prefix: string): IPrefix | null {
  if (prefix.includes('!')) {
    const match = prefix.match(/(.*)!(.*)@(.*)/);

    if (!match) {
      return null;
    }
    const [, nickName, user, host] = match;

    return { nickName, user, host };
  }

  return { user: null, host: prefix, nickName: null };
}

/**
 * Splits message into chunks (sub-messages).
 * @param {string} message
 * @returns {string[]}
 */
function prepareIRCMessage(message: string): string[] {
  return message.split('\n').slice(0, -1);
}

/**
 * Parses IRC message.
 * @param {string} message
 * @returns {any}
 */
function parseIRCMessage(message: string): IParsedIRCMessage {
  const [metaRaw, payloadRaw, ...dataRaw] = message
    .split(':')
    .map(item => item.trim());
  const data = dataRaw.join(':') || null;

  // Message: PING :tmi.twitch.tv
  if (metaRaw.match(/^[A-Z]+/)) {
    return {
      prefix: parsePrefix(payloadRaw),
      meta: null,
      parameters: null,
      command: metaRaw,
      data,
      raw: message,
    };
  }

  const [prefixRaw, command, ...parameters] = payloadRaw.split(' ');
  const prefix = parsePrefix(prefixRaw);

  return {
    prefix,
    meta: parseMeta(metaRaw),
    parameters,
    command,
    data,
    raw: message,
  };
}

export { parseIRCMessage, prepareIRCMessage, IParsedIRCMessage };
