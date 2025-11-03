import net = require("net");
import EventEmitter = require("events");
import Socket = require("net");

interface Client {
  server: string;
  port: number;
  nick: string;
  username: string;
  realname: string;
}

class IRCClient implements Client {
  server: string;
  port: number;
  nick: string;
  username: string;
  realname: string;
  client: Socket.Socket;
  myEmitter: EventEmitter;
  private connectionStatus: boolean;

  constructor(
    server: string,
    port: number,
    nick: string,
    username: string,
    realname: string,
  ) {
    this.connectionStatus = false;
    this.server = server;
    this.port = port;
    this.nick = nick;
    this.username = username;
    this.realname = realname;
    this.myEmitter = new EventEmitter();

    this.client = net.connect(
      {
        host: server,
        port: port,
      },
      () => {
        console.log("connecting ....");
        this.client.write("CAP LS 302\r\n");
        this.client.write("PASS test123\r\n");
        this.client.write(`NICK ${nick}\r\n`);
        this.client.write(`USER ${username} 0 * :${realname}\r\n`);
        this.client.write("CAP END\r\n");
        console.log("connecting done");
      },
    );
    this.client.on("data", (data: any) => {
      console.log(data.toString("utf8"));
      if (data.includes("PING :")) {
        const token = data.toString().replace("PING :", "");
        this.client.write(`PONG ${token}\r\n`);
      } else if (data.includes("MOTD")) {
        console.log("GOT MOTD");
        this.connectionStatus = true;
      } else {
        this.myEmitter.emit("data", data);
      }
    });
  }

  joinChannel(channelName: string): void {
    if (this.connectionStatus) {
      console.log("connected successfully");
      console.log(channelName);
      this.client.write(`join #${channelName}\r\n`);
    } else {
      setTimeout(() => {
        this.joinChannel(channelName);
      }, 1000);
    }
  }

  msgChannel(channelName: string, msg: string): void {
    this.client.write(`privmsg #${channelName} : ${msg}\r\n`);
  }
}

export = { IRCClient };
