import {
  ECommand,
  IBadges,
  IEmotes,
  IFlag,
  IMeta,
  IParsedMessage,
  TMetaValue,
} from './types';

export function trim(text: string): string {
  return text.trim();
}

export function isNotEmpty(text: string): boolean {
  return text.length > 0;
}

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

export function parseFlags(value: string): IFlag[] {
  const flags = value.split(',').filter(isNotEmpty);

  return flags.map(item => {
    const [ranges, flagsData] = item.split(':');
    const [from, to] = ranges.split('-').map(Number);

    return {
      from,
      to,
      flags: flagsData
        .split('/')
        .reduce<Record<string, number>>((acc, pair) => {
          const [letter, num] = pair.split('.');
          acc[letter] = Number(num);

          return acc;
        }, {}),
    }
  });
}

export function parseEmotes(value: string): IEmotes {
  const emotes = value.split('/').filter(isNotEmpty);

  return emotes.reduce<Record<string, Array<{from: number; to: number}>>>((acc, emote) => {
    const [emoteIdStr, rangesStr] = emote.split(':');
    const ranges = rangesStr.split(',');

    acc[emoteIdStr] = ranges.map(r => {
      const [from, to] = r.split('-').map(Number);

      return {from, to};
    });

    return acc;
  }, {});
}

export function parseBadges(value: string): IBadges {
  const badges = value.split(',');

  return badges.reduce<Record<string, number>>((acc, b) => {
    const [name, version] = b.split('/');
    acc[name] = Number(version);

    return acc;
  }, {});
}

export function parseMetaItem(itemRaw: string): [string, TMetaValue] {
  const [keyRaw, ...valueRawSplitted] = itemRaw.split('=');
  let value: TMetaValue = valueRawSplitted.join('=');
  const valueAsNum = Number(value);
  const key = toCamelCase(keyRaw);

  if (value === '') {
    value = null;
  } else {
    switch (key) {
      case 'followersOnly':
        value = valueAsNum;
        break;
      case 'flags':
        value = parseFlags(value);
        break;
      case 'emotes':
        value = parseEmotes(value);
        break;
      case 'badgeInfo':
      case 'badges':
        value = parseBadges(value);
        break;
      case 'emoteSet':
        value = value.split(',').map(Number);
        break;
      case 'msgParamSubPlan':
        if (!Number.isNaN(valueAsNum)) {
          value = valueAsNum;
        }
        break;
      case 'msgParamSubPlanName':
      case 'systemMsg':
        value = value.replace(/\\s/g, ' ');
        break;
      case 'msgParamOriginId':
        value = value.split('\\s').map(Number);
        break;
      case 'msgParamCumulativeMonths':
      case 'msgParamMonths':
      case 'msgParamMassGiftCount':
      case 'msgParamStreakMonths':
      case 'msgParamSelectedCount':
      case 'msgParamPromoGiftTotal':
      case 'msgParamRecipientId':
      case 'msgParamSenderCount':
      case 'msgParamTotalRewardCount':
      case 'msgParamTriggerAmount':
      case 'msgParamThreshold':
      case 'msgParamViewerCount':
        value = valueAsNum;
        break;
      default:
        if (value === '0' || value === '1') {
          value = value === '1';
        } else if (!Number.isNaN(valueAsNum)) {
          value = valueAsNum;
        }
    }
  }

  return [key, value];
}

export function parseMeta(text: string): IMeta {
  const splitted = text.split(';').filter(p => p.length > 0);

  return splitted.reduce<IMeta>((acc, m) => {
    const [key, value] = parseMetaItem(m);
    acc[key] = value;

    return acc;
  }, {});
}

export function prepareIRCMessage(message: string): string[] {
  return message.split('\r\n');
}

export function parseIRCMessage(value: string): IParsedMessage | null {
  const detectableCommands = Object.values(ECommand);
  const messageDetectable = detectableCommands.some(c => value.includes(c));

  if (messageDetectable) {
    // Custom case for PING command
    if (value.startsWith('PING')) {
      return {
        meta: null,
        prefix: null,
        command: ECommand.Ping,
        channel: null,
        message: null,
        raw: value,
      };
    }
    const matches = value.match(/(.*):(.*)tmi.twitch.tv (.*)/);

    if (matches) {
      // Remove full match
      matches.shift();
      const [metaRaw, prefix, temp] = matches.map(trim);
      const [commandRaw, message = null] = temp.split(':').map(trim);

      const commandRawSplitted = commandRaw.split(' ');
      const channel = commandRawSplitted.pop().slice(1);
      const command = commandRawSplitted.join(' ');

      return {
        meta: metaRaw.length > 0 ? parseMeta(metaRaw.slice(1)) : null,
        prefix: prefix || null,
        command,
        channel,
        message,
        raw: value,
      };
    }
    return null;
  }
  return null;
}
