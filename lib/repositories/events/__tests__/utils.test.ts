/// <reference types="jest" />
import {
  getChannel,
  getPlaceData,
  convertToArray,
  getPrefixUser,
  isDefined,
} from '../utils';
import { IParsedIRCMessage } from '../../../utils';

describe('repositories', () => {
  describe('events', () => {
    describe('utils', () => {
      describe('getChannel', () => {
        it(
          'should take first item of field "parameters" and return text ' +
          'starting from second letter',
          () => {
            const message = { parameters: ['#justintv'] } as IParsedIRCMessage;

            expect(getChannel(message)).toEqual(message.parameters[0].slice(1));
          },
        );
      });

      describe('getPrefixUser', () => {
        it('should return field message.prefix.user', () => {
          const message = { prefix: { user: 'justin' } } as IParsedIRCMessage;

          expect(getPrefixUser(message)).toEqual(message.prefix.user);
        });
      });

      describe('getPlaceData', () => {
        it('should object { channelId: string, roomUuid: string } if ' +
          'channel is "chatrooms"', () => {
          const message = {
            parameters: ['#chatrooms'],
            data: '9222:abc',
          } as IParsedIRCMessage;

          expect(getPlaceData(message)).toEqual({
            channelId: '9222',
            roomUuid: 'abc',
          });
        });

        it('should return string if channel is not "chatrooms"', () => {
          const message = { parameters: ['#justintv'] } as IParsedIRCMessage;

          expect(getPlaceData(message)).toEqual(message.parameters[0].slice(1));
        });
      });

      describe('convertToArray', () => {
        it('should return empty array if value is null', () => {
          expect(convertToArray(null)).toEqual([]);
        });

        it('should return an array with value if value is not null', () => {
          expect(convertToArray(922)).toEqual([922]);
        });

        it('should value if it is an array', () => {
          expect(convertToArray([922])).toEqual([922]);
        });
      });

      describe('isDefined', () => {
        it('should return true if value is not equal to undefined, otherwise ' +
          'return false', () => {
          expect(isDefined(undefined)).toBe(false);
          expect(isDefined(123)).toBe(true);
        });
      });
    });
  });
});
