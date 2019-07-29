import { IParsedIRCMessage } from '../../utils';
import { IEventParams, TObservableEvents } from '../../types/event-params';

/**
 * Command listener
 */
interface ICommandListener {
  command: TObservableEvents;
  listener: TCallback<any>;
}

/**
 * Generic type to describe required callback for event.
 */
type TCallback<Params> = (params: Params) => void;

/**
 * Generic type to describe transformer for event.
 */
type TTransformer<Command extends TObservableEvents> = (
  message: IParsedIRCMessage,
) => IEventParams[Command];

/**
 * Description of transformers of parameters for commands.
 */
type TTransformersMap = {
  [Command in TObservableEvents]: TTransformer<Command>;
};

/**
 * Description of callbacks for commands.
 * With this type it is easy to create new callbacks description with just
 * creating a record in TCommandParams.
 */
type TCallbacksMap = {
  [Command in TObservableEvents]: TCallback<IEventParams[Command]>;
};

export {
  TCallbacksMap,
  TTransformersMap,
  TTransformer,
  TCallback,
  ICommandListener,
};
