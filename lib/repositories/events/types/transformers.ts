import { IParsedIRCMessage } from '../../../utils';
import { TObservableEvents } from './observable';
import { IEventParams } from './params';

/**
 * Generic type to describe transformer for event.
 */
export type TEventTransformer<Signal extends TObservableEvents> = (
  login: string,
  message: IParsedIRCMessage,
) => IEventParams[Signal];

/**
 * Description of transformers of parameters for commands.
 */
export type TEventTransformersMap = {
  [Command in TObservableEvents]: TEventTransformer<Command>;
};
