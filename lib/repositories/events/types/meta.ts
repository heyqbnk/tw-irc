import {IBadge, IEmote, IFlag} from '../../../types';

type TPseudoBoolean = 0 | 1;
type TUserType = null | 'mod' | 'global_mod' | 'admin' | 'staff';
type TDefaultDeprecatedMeta = 'userType' | 'turbo' | 'mod' | 'subscriber';

// CLEARCHAT
export interface IClearChatMeta {
  // Can be Number.POSITIVE_INFINITY if ban is permanent
  banDuration?: number;
  targetUserId?: number;
  roomId: number;
  tmiSentTs: number;
}

// CLEARMSG
export interface IClearMessageMeta {
  login: string;
  targetMsgId: string;
}

// GLOBALUSERSTATE
type TDeprecatedGlobalUserStateMeta = TDefaultDeprecatedMeta;
type TPickedGlobalUserStateMeta = Omit<IGlobalUserStateMeta,
  TDeprecatedGlobalUserStateMeta>;

export interface IGlobalUserStateMeta {
  badgeInfo: IBadge | null;
  badges: IBadge | IBadge[] | null;
  color: string | null;
  displayName: string | null;
  emoteSets: number[] | null;
  mod: TPseudoBoolean;
  subscriber: TPseudoBoolean;
  turbo: TPseudoBoolean;
  userType: TUserType;
}

export interface IGlobalUserStateMetaPrepared
  extends TPickedGlobalUserStateMeta {
  badges: IBadge[];
  emoteSets: number[];
}

// NOTICE
export interface INoticeMeta {
  msgId: EUserNoticeMessageId;
}

// PRIVMSG
type TDeprecatedMessageMeta = TDefaultDeprecatedMeta;
type TOmittedMessageMeta = 'tmiSentTs';
type TPickedMessageMeta = Omit<IMessageMeta, TDeprecatedMessageMeta
  | TOmittedMessageMeta>;

export interface IMessageMeta {
  badgeInfo: IBadge | null;
  badges: IBadge | IBadge[] | null;
  bits?: string; // TODO: Realize
  color: string | null;
  displayName: string | null;
  emotes: IEmote | IEmote[] | null;
  flags: IFlag[] | null;
  id: string;
  roomId: string;
  tmiSentTs: number;
  userId: number;
  subscriber: TPseudoBoolean;
  mod: TPseudoBoolean;
  turbo: TPseudoBoolean;
  userType: null | 'mod' | 'global_mod' | 'admin' | 'staff';
}

export interface IMessageMetaPrepared extends TPickedMessageMeta {
  badges: IBadge[];
  emotes: IEmote[];
  flags: IFlag[];
}

// ROOMSTATE
export interface IRoomStateMetaParsed {
  emoteOnly?: TPseudoBoolean;
  followersOnly?: -1 | 0 | number;
  r9k?: TPseudoBoolean;
  slow?: number;
  subsOnly?: TPseudoBoolean;
  roomId: number;
  rituals?: TPseudoBoolean; // TODO: It is not documented in API, but exists
}

export interface IRoomStateMeta {
  emoteOnly?: boolean;
  // Means enable / disabled or required following time in MINUTES
  followersOnly?: boolean | number;
  r9k?: boolean;
  slow?: number;
  subsOnly?: boolean;
  roomId: number;
  rituals?: boolean;
}

// USERNOTICE
type TDeprecatedUserNoticeMeta = TDefaultDeprecatedMeta;
type TOmittedUserNoticeMeta = 'tmiSentTs' | 'msgId' | 'systemMsg';
type TPickedUserNoticeMeta = Omit<IUserNoticeMeta, TDeprecatedUserNoticeMeta
  | TOmittedUserNoticeMeta>;

export enum EUserNoticeMessageId {
  Subscribe = 'sub',
  Resubscribe = 'resub',
  SubscriberGift = 'subgift',
  AnonymousSubscriberGift = 'anonsubgift',
  SubscriberMysteryGift = 'submysterygift',
  GiftPaidUpgrade = 'giftpaidupgrade',
  RewardGift = 'rewardgift',
  AnonymousRewardGift = 'anongiftpaidupgrade',
  Raid = 'raid',
  Unraid = 'unraid',
  Ritual = 'ritual',
  BitsBadgeTier = 'bitsbadgetier',
}

export interface IUserNoticeMeta {
  badgeInfo: IBadge | null;
  badges: IBadge | IBadge[] | null;
  color: string | null;
  displayName: string | null;
  emotes: IEmote | IEmote[] | null;
  flags: IFlag[] | null;
  id: string;
  roomId: string;
  tmiSentTs: number;
  userId: number;
  subscriber: TPseudoBoolean;
  mod: TPseudoBoolean;
  turbo: TPseudoBoolean;
  userType: TUserType;
  login: string;
  msgId: EUserNoticeMessageId;
  systemMsg: string;
}

export interface IUserNoticeMetaPrepared extends TPickedUserNoticeMeta {
  badges: IBadge[];
  emotes: IEmote[];
  flags: IFlag[];
}

// USERSTATE
type TDeprecatedUserStateMeta = TDefaultDeprecatedMeta;
type TPickedUserStateMeta = Omit<IUserStateMeta, TDeprecatedUserStateMeta>;

export interface IUserStateMeta {
  badgeInfo: IBadge | null;
  badges: IBadge | IBadge[] | null;
  color: string | null;
  displayName: string | null;
  emoteSets: number[] | null;
  mod: TPseudoBoolean;
  subscriber: TPseudoBoolean;
  turbo: TPseudoBoolean;
  userType: TUserType;
}

export interface IUserStateMetaPrepared extends TPickedUserStateMeta {
  badges: IBadge[];
  emoteSets: number[];
}
