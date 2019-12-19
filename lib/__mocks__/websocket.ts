// @ts-nocheck
export const MockWebSocket = jest.fn(function(path: string) {
  this.CONNECTING = 0;
  this.OPEN = 1;
  this.CLOSING = 2;
  this.CLOSED = 3;
  this.readyState = this.CONNECTING;
  this.path = path;

  const listeners = [];

  this.addEventListener = jest.fn((name, listener) => {
    listeners.push({ name, listener });
  });

  this.removeEventListener = jest.fn((name, listener) => {
    const index = listeners.findIndex(item => {
      return item.name === name && item.listener === listener;
    });

    if (index !== -1) {
      listeners.splice(index, 1);
    }
  });

  this.close = jest.fn(() => {
    this.readyState = WebSocket.CLOSED;
  });

  this.send = jest.fn();

  this.dispatchEvent = jest.fn((event: Event) => {
    listeners.forEach(item => {
      if (item.name === event.type) {
        item.listener(event);
      }
    });
  });
});

export const mockWebSocket = () => global.WebSocket = MockWebSocket;
