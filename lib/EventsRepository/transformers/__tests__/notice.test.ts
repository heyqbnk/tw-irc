import {ESignal} from '../../../types';
import {IParsedIRCMessage} from '../../../types';

import {noticeTransformer} from '../notice';
import {ENoticeMessageId} from '../../types';

describe('repositories', () => {
  describe('events', () => {
    describe('transformers', () => {
      describe('noticeTransformer', () => {
        it('should return object with fields channel, msgId, ' +
          'message and raw in case meta.msgId exists', () => {
          const message = getMessage({
            parameters: ['#justintv'],
            data: 'Hello!',
            meta: {
              msgId: ENoticeMessageId.AlreadyBanned,
            },
            raw: 'raw',
          });

          expect(noticeTransformer('', message)).toEqual({
            channel: 'justintv',
            message: message.data,
            msgId: message.meta.msgId,
            raw: message.raw,
          });
        });

        it('should return field room: { channelId: string, roomUuid: string } ' +
          'if first parameter is "#chatrooms"', () => {
          const message = getMessage({
            parameters: ['#chatrooms'],
            data: '1:2',
          });

          expect(noticeTransformer('', message)).toEqual(expect.objectContaining({
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
