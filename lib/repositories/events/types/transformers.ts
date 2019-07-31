import { IParsedIRCMessage } from '../../../utils';
import { TObservableEvents } from './observable';
import { IEventParams } from './params';

/**
 * Generic type to describe transformer for event.
 */
type TTransformer<Command extends TObservableEvents> = (
  message: IParsedIRCMessage,
) => IEventParams[Command];

/**
 * Description of transformers of parameters for commands.
 */
export type TTransformersMap = {
  [Command in TObservableEvents]: TTransformer<Command>;
};
