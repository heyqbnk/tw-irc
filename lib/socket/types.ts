interface ISocketConstructorProps {
  secure: boolean;
}

/**
 * Socket event listener
 */
interface IListener {
  eventName: keyof WebSocketEventMap;
  listener(ev: Event): void;
}

export { ISocketConstructorProps, IListener };
