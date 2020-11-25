import express, {Express} from 'express';
import {createServer, Server as HttpServer} from 'http';
import createIO, {Server as SocketIOServer} from 'socket.io';
import next from 'next';

export class Server {
  private app: Express;
  private server: HttpServer;
  private nextApp;
  private io: SocketIOServer;
  private activeSockets: string[] = [];

  private readonly PORT = 3000;
  constructor() {
    this.init();
    this.handleSocketConnections();
  }

  private init = () => {
    this.app = express();
    this.server = createServer(this.app);
    // @ts-ignore
    this.io = createIO();
    const dev = process.env.NODE_ENV !== 'production';
    this.nextApp = next({dev});
  };

  private handleSocketConnections = () => {
    this.io.on('connection', (socket) => {
      socket.on('chat', (thing: any) => {
        console.log(`chat from client ${socket.id} >> ${thing} `);
      });
    });
  };

  public start = (callback?: (port: number) => void) => {
    const nextHandler = this.nextApp.getRequestHandler();

    this.nextApp.prepare().then(() => {
      this.app.get('*', (req, res) => {
        nextHandler(req, res);
      });

      this.server.listen(this.PORT, () => {
        console.log('> Server starting on http:.//localhost:', this.PORT);
        callback && callback(this.PORT);
      });
    });
  };
}

const server = new Server();

server.start();
