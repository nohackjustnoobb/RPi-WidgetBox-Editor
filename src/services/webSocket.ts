interface Message {
  type: string;
  data?: any;
}

class WebSocketClient {
  private socket: WebSocket | null = null;
  private connectTimeout: number | null = null;

  constructor(
    public url: string,
    private onmessage: (mesg: Message) => void,
    private onopen: () => void,
    private reconnectInterval = 5000
  ) {
    this.connect();
  }

  close() {
    if (this.connectTimeout) clearTimeout(this.connectTimeout);
    this.socket?.close();
  }

  connect() {
    this.socket = new WebSocket(this.url);

    this.connectTimeout = setTimeout(() => {
      if (this.socket?.readyState !== WebSocket.OPEN) {
        console.warn("WebSocket connection timed out. Reconnecting...");
        this.socket?.close();
      }
    }, this.reconnectInterval);

    this.socket.onopen = () => {
      if (this.connectTimeout) clearTimeout(this.connectTimeout);
      this.onopen();
    };

    this.socket.onmessage = (event) => this.onmessage(JSON.parse(event.data));
    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.socket.onclose = () => {
      console.log("WebSocket closed, attempting to reconnect...");
      setTimeout(() => this.connect(), this.reconnectInterval);
    };
  }

  send(mesg: Message) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(mesg));
    } else {
      console.warn("WebSocket not open. Message not sent.");
    }
  }
}

export { type Message, WebSocketClient };
