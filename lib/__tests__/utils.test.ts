/* eslint-disable */
import {
  parseIRCMessage,
  parseMeta,
  parseMetaValue, parsePrefix,
  prepareIRCMessage,
  toCamelCase,
} from '../utils';

describe('utils', () => {
  describe('toCamelCase', () => {
    it('replaces "-[a-z]" with "[A-Z]', () => {
      expect(toCamelCase('some-text')).toBe('someText');
    });
  });

  describe('parseMetaValue', () => {
    it('should return a value as number, if it is stringified number', () => {
      expect(parseMetaValue('1')).toBe(1);
    });

    it('should return an array of parsed values, if value has ","', () => {
      expect(parseMetaValue('1,woof,cool')).toEqual([1, 'woof', 'cool']);
    });

    it('should return object { badge: string, version: number }, if value ' +
      'has "/"', () => {
      expect(parseMetaValue('moderator/7')).toEqual({
        badge: 'moderator',
        version: 7,
      });
    });

    it('should return object { emoteId: number, ranges: { from, to }[] } if value ' +
      'has ":", but not "/". It it contains "/", should return an array of ' +
      'these objects.', () => {
      expect(parseMetaValue('999:1-5,6-8')).toEqual({
        emoteId: 999,
        ranges: [{ from: 1, to: 5 }, { from: 6, to: 8 }],
      });
      expect(parseMetaValue('999:1-5,6-8/22:10-11')).toEqual([{
        emoteId: 999,
        ranges: [{ from: 1, to: 5 }, { from: 6, to: 8 }],
      }, {
        emoteId: 22,
        ranges: [{ from: 10, to: 11 }],
      }]);
    });

    it('should return passed value, if it does not match any previous pattern', () => {
      expect(parseMetaValue('irc')).toBe('irc');
    });
  });

  describe('parseMeta', () => {
    it('should return null, if meta equals to "@" or empty string', () => {
      expect(parseMeta('')).toBe(null);
      expect(parseMeta('@')).toBe(null);
    });

    it('should return an object with camel cased keys and parsed values', () => {
      const meta = 'user-id=1992;user-type=;' +
        'badges=moderator/7,subscriber/8;emotes=22:1-5';
      const meta2 = 'emotes=22:1-5/38:6-7';

      expect(parseMeta(meta)).toEqual({
        userId: 1992,
        userType: null,
        badges: [{
          badge: 'moderator',
          version: 7,
        }, {
          badge: 'subscriber',
          version: 8,
        }],
        emotes: {
          emoteId: 22,
          ranges: [{ from: 1, to: 5 }],
        },
      });
      expect(parseMeta(meta2)).toEqual({
        emotes: [{
          emoteId: 22,
          ranges: [{ from: 1, to: 5 }],
        }, {
          emoteId: 38,
          ranges: [{ from: 6, to: 7 }],
        }],
      });
    });
  });

  describe('parsePrefix', () => {
    it('should return object with fields nickName, user and host, if prefix ' +
      'contains "!". Each of them has normal. If there is no "!" inside, ' +
      'returns user: null, host - passed value and nickName: null', () => {
      expect(parsePrefix('woof!husky@goes')).toEqual({
        nickName: 'woof',
        user: 'husky',
        host: 'goes',
      });

      expect(parsePrefix('woof')).toEqual({
        nickName: null,
        user: null,
        host: 'woof',
      });
    });

    it('should return null if value doesnt match prefix pattern, but ' +
      'contains "!"', () => {
      expect(parsePrefix('woof!yeah')).toBe(null);
    });
  });

  describe('prepareIRCMessage', () => {
    it('should return empty array if message length is 0', () => {
      expect(prepareIRCMessage('')).toHaveLength(0);
    });

    it('should splice last letter of message if it is "\\n" and return an ' +
      'array of strings, we received due to split other part of ' +
      'message by "\\n"', () => {
      expect(prepareIRCMessage('some\nmessage\n')).toEqual(['some', 'message']);
    });

    it('should return an array of strings, we received due to split ' +
      'message by "\\n"', () => {
      expect(prepareIRCMessage('Hello!\nWoof?')).toEqual([
        'Hello!',
        'Woof?',
      ]);
    });
  });

  describe('parseIRCMessage', () => {
    it('should return an object with fields prefix, meta: null, ' +
      'parameters: null, signal, data and raw if the first part of message ' +
      'before first ":" matches pattern /^[A-Z]+/', () => {
      expect(parseIRCMessage('PING :tmi.twitch.tv')).toEqual({
        prefix: {
          nickName: null,
          user: null,
          host: 'tmi.twitch.tv',
        },
        meta: null,
        parameters: null,
        signal: 'PING',
        data: null,
        raw: 'PING :tmi.twitch.tv',
      });
    });

    it('should return an object with fields prefix, meta, parameters, ' +
      'signal, data and raw if the first part of message ' +
      'before first ":" DOESNT match pattern /^[A-Z]+/', () => {
      const message = '@badge-info=subscriber/7;badges=moderator/1,subscriber/6;color=#00FFFF;display-name=husky :husky!husky@husky.tmi.twitch.tv PRIVMSG #cartmanzbs :Really well played!';
      expect(parseIRCMessage(message)).toEqual({
        prefix: {
          nickName: 'husky',
          user: 'husky',
          host: 'husky.tmi.twitch.tv',
        },
        meta: {
          badgeInfo: { badge: 'subscriber', version: 7 },
          badges: [
            { badge: 'moderator', version: 1 },
            { badge: 'subscriber', version: 6 },
          ],
          color: '#00FFFF',
          displayName: 'husky',
        },
        parameters: ['#cartmanzbs'],
        signal: 'PRIVMSG',
        data: 'Really well played!',
        raw: message,
      });
    });

    it('should add space in the end, if message starts with ":"', () => {
      expect(parseIRCMessage(':tmi.twitch.tv JOIN #sodapoppin')).toEqual({
        prefix: {
          nickName: null,
          user: null,
          host: 'tmi.twitch.tv',
        },
        meta: null,
        parameters: ['#sodapoppin'],
        signal: 'JOIN',
        data: null,
        raw: ':tmi.twitch.tv JOIN #sodapoppin',
      });
    });
  });
});
