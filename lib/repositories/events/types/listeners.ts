import { TObservableEvents } from './observable';
import { IEventParams } from './params';

/**
 * Generic type to describe required listener for event.
 */
export type TSignalListener<Params> = (params: Params) => void;

/**
 * Description of listeners for signals.
 * With this type it is easy to create new callbacks description.
 */
export type TSignalListenersMap = {
  [Signal in TObservableEvents]: TSignalListener<IEventParams[Signal]>;
};
