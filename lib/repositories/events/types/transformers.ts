import { IParsedIRCMessage } from '../../../utils';
import { TObservableSignals } from './observable';
import { IEventParams } from './params';

/**
 * Generic type to describe transformer for event.
 */
export type TEventTransformer<Signal extends TObservableSignals> = (
  login: string,
  message: IParsedIRCMessage,
) => IEventParams[Signal];

/**
 * Description of transformers of parameters for commands.
 */
export type TEventTransformersMap = {
  [Command in TObservableSignals]: TEventTransformer<Command>;
};
