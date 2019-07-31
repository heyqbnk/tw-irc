import { TObservableEvents } from './observable';
import { IEventParams } from './params';

/**
 * Generic type to describe required callback for event.
 */
export type TCallback<Params> = (params: Params) => void;

/**
 * Description of callbacks for commands.
 * With this type it is easy to create new callbacks description.
 */
export type TCallbacksMap = {
  [Command in TObservableEvents]: TCallback<IEventParams[Command]>;
};
