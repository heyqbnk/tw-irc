import {
  parseIRCMessage,
  parseMeta,
  parseMetaValue, parsePrefix,
  parseSafeMetaValue, prepareIRCMessage,
  toCamelCase,
} from '../utils';

describe('utils', () => {
  describe('toCamelCase', () => {
    it('replaces "-[a-z]" with "[A-Z]', () => {
      expect(toCamelCase('some-text')).toBe('someText');
    });
  });

  describe('parseSafeMetaValue', () => {
    it('if value is stringified number, returns value as number. Otherwise ' +
      'return string value', () => {
      expect(parseSafeMetaValue('10')).toBe(10);
      expect(parseSafeMetaValue('woof!')).toBe('woof!');
    });
  });

  describe('parseMetaValue', () => {
    it('should return null if value is empty string', () => {
      expect(parseMetaValue('')).toBe(null);
    });

    it('should return an array of parsed values, if value has ",". Otherwise, ' +
      'return parsed value', () => {
      expect(parseMetaValue('1,woof,cool')).toEqual([1, 'woof', 'cool']);
      expect(parseMetaValue('1')).toBe(1);
    });
  });

  describe('parseMeta', () => {
    it('should return null, if meta equals to "@" or empty string', () => {
      expect(parseMeta('')).toBe(null);
      expect(parseMeta('@')).toBe(null);
    });

    it('should return an object with camel cased keys and parsed values', () => {
      expect(parseMeta('user-id=1992;badges=922,512,woof')).toEqual({
        userId: 1992,
        badges: [922, 512, 'woof'],
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
      'parameters: null, command, data and raw if the first part of message ' +
      'before first ":" matches pattern /^[A-Z]+/', () => {
      expect(parseIRCMessage('PING :tmi.twitch.tv')).toEqual({
        prefix: {
          nickName: null,
          user: null,
          host: 'tmi.twitch.tv',
        },
        meta: null,
        parameters: null,
        command: 'PING',
        data: null,
        raw: 'PING :tmi.twitch.tv',
      });
    });

    it('should return an object with fields prefix, meta, parameters, ' +
      'command, data and raw if the first part of message ' +
      'before first ":" DOESNT match pattern /^[A-Z]+/', () => {
      const message = '@badge-info=subscriber/7;badges=moderator/1,subscriber/6;color=#00FFFF;display-name=husky :husky!husky@husky.tmi.twitch.tv PRIVMSG #cartmanzbs :Really well played!';
      expect(parseIRCMessage(message)).toEqual({
        prefix: {
          nickName: 'husky',
          user: 'husky',
          host: 'husky.tmi.twitch.tv',
        },
        meta: {
          badgeInfo: 'subscriber/7',
          badges: ['moderator/1', 'subscriber/6'],
          color: '#00FFFF',
          displayName: 'husky',
        },
        parameters: ['#cartmanzbs'],
        command: 'PRIVMSG',
        data: 'Really well played!',
        raw: message,
      });
    });
  });
});
