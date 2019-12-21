import {IRoom, TChannel, IParsedIRCMessage} from '../types';
import {ISignalListener} from './types';
import transformers from './transformers';

type TPlaceData = {channel: TChannel} | {room: IRoom};

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
export function getPlaceData(message: IParsedIRCMessage): TPlaceData {
  const channel = getChannel(message);

  // It means, something is happening in chat room, not in channel
  if (channel === 'chatrooms') {
    const [channelId, roomUuid] = message.data.split(':');

    return {room: {channelId, roomUuid}};
  }

  return {channel};
}

/**
 * Converts value to array for more comfortable usage.
 * @param {Value[] | Value | null} value
 * @returns {Value[]}
 */
export const convertToArray = <V>(
  value: V | V[] | null,
): V[] => {
  if (value === null || value === undefined) {
    return [] as V[];
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

/**
 * Detects if passed listener is signal listener.
 * @param value
 */
export function isSignalListener(
  value: any,
): value is ISignalListener {
  return 'event' in value
    && 'listener' in value
    && value.event in transformers;
}