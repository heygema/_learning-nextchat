const express = require("express");
const { createServer } = require('http');
const createIO = require('socket.io');
const next = require('next');

class Server {
  app;
  server;
  io;
  activeSockets = [];

  PORT = 3000;
  constructor() {
    this.init();
    this.handleSocketConnections();
  }

  init = () => {
    this.app = express();
    this.server = createServer(this.app);
    // @ts-ignore
    this.io = createIO();
    const dev = process.env.NODE_ENV !== "production";
    this.nextApp = next({ dev });
  };

  handleSocketConnections = () => {
    this.io.on("connection", socket => {
      socket.on("chat", thing => {
        console.log(`chat from client ${socket.id} >> ${thing} `);
      });
    });
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
