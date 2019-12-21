import {ESignal} from '../../../types';
import {IParsedIRCMessage} from '../../../types';

import {roomStateTransformer} from '../room-state';

describe('repositories', () => {
  describe('events', () => {
    describe('transformers', () => {
      describe('roomStateTransformer', () => {
        it('should return fields emoteOnly, r9k, subsOnly, rituals as booleans ' +
          'if they are defined', () => {
          const message = getMessage({
            parameters: ['#justintv'],
            meta: {
              roomId: 100,
              emoteOnly: 0,
              r9k: 0,
              subsOnly: 1,
              rituals: 1,
            },
            raw: 'raw',
          });

          expect(roomStateTransformer('', message)).toEqual({
            channel: 'justintv',
            emoteOnly: false,
            r9k: false,
            subsOnly: true,
            rituals: true,
            raw: message.raw,
            roomId: 100,
          });
        });

        it('should NOT return fields emoteOnly, r9k, subsOnly, rituals as booleans ' +
          'if they are NOT defined', () => {
          const message = getMessage({
            parameters: ['#justintv'],
            meta: {
              roomId: 100,
            },
            raw: 'raw',
          });

          expect(roomStateTransformer('', message)).toEqual({
            channel: 'justintv',
            raw: message.raw,
            roomId: 100,
          });
        });

        it('should return field ' +
          'followersOnly = true if meta.followersOnly = 0, ' +
          'followersOnly = false if meta.followersOnly = -1, and ' +
          'followersOnly = meta.followersOnly otherwise', () => {
          const defaultMeta = {
            roomId: 100,
          };
          const defaultParams = {
            parameters: ['#justintv'],
            meta: defaultMeta,
            raw: 'raw',
          };
          const messageIfFalse = getMessage({
            ...defaultParams,
            meta: {
              ...defaultMeta,
              followersOnly: -1,
            },
          });

          expect(roomStateTransformer('', messageIfFalse)).toEqual({
            channel: 'justintv',
            followersOnly: false,
            raw: messageIfFalse.raw,
            roomId: 100,
          });

          const messageIfTrue = getMessage({
            ...defaultParams,
            meta: {
              ...defaultMeta,
              followersOnly: 0,
            },
          });

          expect(roomStateTransformer('', messageIfTrue)).toEqual({
            channel: 'justintv',
            followersOnly: true,
            raw: messageIfTrue.raw,
            roomId: 100,
          });

          const messageIfNumber = getMessage({
            ...defaultParams,
            meta: {
              ...defaultMeta,
              followersOnly: 922,
            },
          });

          expect(roomStateTransformer('', messageIfNumber)).toEqual({
            channel: 'justintv',
            followersOnly: messageIfNumber.meta.followersOnly,
            raw: messageIfNumber.raw,
            roomId: 100,
          });
        });

        it('should return field slow if is defined', () => {
          const message = getMessage({
            parameters: ['#justintv'],
            meta: {
              roomId: 100,
              slow: 520,
            },
            raw: 'raw',
          });

          expect(roomStateTransformer('', message)).toEqual({
            channel: 'justintv',
            raw: message.raw,
            roomId: 100,
            slow: message.meta.slow,
          });
        });

        it('should return field room: { channelId: string, roomUuid: string } ' +
          'if first parameter is "#chatrooms"', () => {
          const message = getMessage({
            parameters: ['#chatrooms'],
            data: '1:2',
          });

          expect(roomStateTransformer('', message)).toEqual(expect.objectContaining({
            room: {
              channelId: '1',
              roomUuid: '2',
            },
          }));
        });
      });
    });
  });
});

function getMessage(
  props: Partial<IParsedIRCMessage> = {},
): IParsedIRCMessage {
  const {
    data = 'some data goes here',
    parameters = ['#justintv'],
    prefix = {
      user: 'justin',
    },
    signal = ESignal.Message,
    raw = '',
    meta = {},
  } = props;

  return {
    data,
    parameters,
    prefix,
    signal,
    raw,
    meta,
  } as IParsedIRCMessage;
}
