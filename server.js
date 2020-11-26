const express = require("express");
const { createServer } = require("http");
const createIO = require("socket.io");
const next = require("next");

class Server {
  app;
  server;
  io;
  activeSockets = [];

  PORT = 3000;
  constructor(port) {
    this.init();
    this.PORT = port || this.PORT;
    this.io.on("connection", this.onConnection);
  }

  init = () => {
    this.app = express();
    this.server = createServer(this.app);
    // @ts-ignore
    this.io = createIO(this.server);
    const dev = process.env.NODE_ENV !== "production";
    this.nextApp = next({ dev });
  };

  onConnection = socket => {
    socket.on("chat", thing => {
      console.log(`chat from client ${socket.id} >> ${thing} `);
    });

    for (let i = 0; i < 10; i++) {
      console.log('ran', i);
      socket.emit("chat", i);
    }
  };

  start = callback => {
    const nextHandler = this.nextApp.getRequestHandler();

    this.nextApp.prepare().then(() => {
      this.app.get("*", (req, res) => {
        nextHandler(req, res);
      });

      this.server.listen(this.PORT, () => {
        console.log("> Server starting on http:.//localhost:", this.PORT);
        callback && callback(this.PORT);
      });
    });
  };
}

const server = new Server();

server.start();
