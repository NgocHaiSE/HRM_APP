import { ipcMain } from "electron";
import * as zmq from "zeromq";

export class ZmqSub {
  private sock: zmq.Subscriber; // Socket của ZeroMQ Subscriber
  private id: number;           // ID để phân biệt subscriber
  private host: string;         // Host của ZMQ server
  private port: number;         // Port được tính dựa trên ID
  private address: string;      // Địa chỉ đầy đủ (tcp://host:port)
  private isRunning: boolean;   // Trạng thái để kiểm soát vòng lặp

  constructor(id: number, host: string) {
    this.sock = new zmq.Subscriber();
    this.id = id;
    this.host = host;
    this.port = 8000 + id;
    this.address = `tcp://${this.host}:${this.port}`;
    this.isRunning = false;
  }

  // Phương thức bắt đầu subscriber
  public async start(): Promise<void> {
    try {
      await this.sock.connect(this.address);
      this.sock.subscribe(""); // Subscribe vào tất cả tin nhắn
      console.log(`ZMQ Subscriber connected to ${this.address}`);
      
      this.isRunning = true;
      this.listenForMessages(); // Bắt đầu lắng nghe tin nhắn
    } catch (err) {
      console.error(`Failed to connect to ZMQ with id ${this.id}:`, err);
      throw err; // Ném lỗi để xử lý bên ngoài nếu cần
    }
  }

  // Phương thức lắng nghe tin nhắn (tách riêng để dễ quản lý)
  private async listenForMessages(): Promise<void> {
    while (this.isRunning) {
      try {
        for await (const [topic, msg] of this.sock) {
          if (!this.isRunning) break; // Thoát vòng lặp nếu stop được gọi
          const base64Image = msg.toString("base64");
          ipcMain.emit("image-frame", null, { id: this.id, data: base64Image });
        }
      } catch (err) {
        console.error(`Error in ZMQ Subscriber id ${this.id}:`, err);
      }
    }
  }

  // Phương thức dừng subscriber
  public stop(): void {
    this.isRunning = false;
    this.sock.unsubscribe(""); // Ngừng subscribe
    this.sock.disconnect(this.address); // Ngắt kết nối
    console.log(`ZMQ Subscriber with id ${this.id} stopped`);
  }

}