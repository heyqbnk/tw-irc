import {IParsedIRCMessage} from '../../types';
import {IEventParams} from './params';

/**
 * Generic type to describe transformer for event.
 */
export type TEventTransformer<Signal extends keyof IEventParams> = (
  login: string,
  message: IParsedIRCMessage,
) => IEventParams[Signal];

/**
 * Description of transformers of parameters for commands.
 */
export type TEventTransformersMap = {
  [Signal in keyof IEventParams]: TEventTransformer<Signal>;
};
