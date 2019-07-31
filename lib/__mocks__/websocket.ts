export class MockWebSocket {
  public CONNECTING = 0;
  public OPEN = 1;
  public CLOSING = 2;
  public CLOSED = 3;
  public readyState = this.CONNECTING;
  public path: string;
  private listeners = [];

  public constructor(path: string) {
    this.path = path;
  }

  public addEventListener = jest.fn((name, listener) => {
    this.listeners.push({ name, listener });
  });

  public removeEventListener = jest.fn((name, listener) => {
    const index = this.listeners.findIndex(item => {
      return item.name === name && item.listener === listener;
    });

    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  });

  public close = jest.fn(() => {
    this.readyState = WebSocket.CLOSED;
  });

  public send = jest.fn();

  public dispatchEvent = jest.fn((event: Event) => {
    this.listeners.forEach(item => {
      if (item.name === event.type) {
        item.listener(event);
      }
    });
  });
}

// @ts-ignore
export const mockWebSocket = () => global.WebSocket = MockWebSocket;
