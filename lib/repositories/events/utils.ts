import { IParsedIRCMessage } from '../../utils';
import { TPlace } from './types';

/**
 * Get channel from parsed message.
 * @param {IParsedIRCMessage} message
 * @returns {string}
 */
export function getChannel(message: IParsedIRCMessage) {
  return message.parameters[0].slice(1);
}

/**
 * Get user from prefix of parsed message.
 * @param {IParsedIRCMessage} message
 * @returns {string}
 */
export function getPrefixUser(message: IParsedIRCMessage) {
  return message.prefix.user;
}

/**
 * Gets information about event place. It can be channel, or some chat-room.
 * @param {IParsedIRCMessage} message
 * @returns {TPlace}
 */
export function getPlaceData(message: IParsedIRCMessage): TPlace {
  const channel = getChannel(message);

  // It means, something is happening in chat room, not in channel
  if (channel === 'chatrooms') {
    const [channelId, roomUuid] = message.data.split(':');

    return { room: { channelId, roomUuid } };
  }

  return { channel };
}

/**
 * Converts value to array for more comfortable usage.
 * @param {Value[] | Value | null} value
 * @returns {Value[]}
 */
export const convertToArray = <Value>(
  value: Value | Value[] | null,
): Value[] => {
  if (value === null || value === undefined) {
    return [] as Value[];
  }
  if (!Array.isArray(value)) {
    return [value];
  }

  return value;
};

/**
 * Checks if value is defined.
 * @param {Value | undefined} value
 * @returns {value is Value}
 */
export const isDefined = <Value>(value: Value | undefined): value is Value => {
  return value !== undefined;
};
