import * as EventEmitter from "events";
import * as net from "net"

interface Client {
  server: string;
  port: number;
  nick: string;
  username: string;
  realname: string;
}

export interface MessagePayload {
  sender: string;
  msg: string;
}

export class IRCClient implements Client {
  server: string;
  port: number;
  nick: string;
  username: string;
  realname: string;
  client: net.Socket;
  myEmitter: EventEmitter;
  private connectionStatus: boolean;
  private channels: string[];

  constructor(
    server: string,
    port: number,
    nick: string,
    username: string,
    realname: string,
  ) {
    this.connectionStatus = false;
    this.channels = [];
    this.server = server;
    this.port = port;
    this.nick = nick;
    this.username = username;
    this.realname = realname;
    this.myEmitter = new EventEmitter.EventEmitter();

    this.client = net.connect(
      {
        host: server,
        port: port,
      },
      () => {
        this.client.write("CAP LS 302\r\n");
        this.client.write("PASS test123\r\n");
        this.client.write(`NICK ${nick}\r\n`);
        this.client.write(`USER ${username} 0 * :${realname}\r\n`);
        this.client.write("CAP END\r\n");
      },
    );
    this.client.on("data", (data: any) => {
      if (data.includes("PING :")) {
        const token = data.toString().replace("PING :", "");
        this.client.write(`PONG ${token}\r\n`);
      } else if (data.includes("MOTD")) {
        this.connectionStatus = true;
      } else if (data.includes("JOIN")) {
        let channelName = data
          .toString("utf-8")
          .split("#")
          .pop()
          .replace("\r\n", "");
        this.channels.push(channelName);
      } else if (data.includes("PRIVMSG")) {
        let sender = data
          .toString("utf-8")
          .substring(data.indexOf("PRIVMSG") + 8, data.lastIndexOf(":"));
        let msg = data.toString("utf-8").split(":").pop().replace("\r\n", "");
        const payload: MessagePayload = {
          sender: sender,
          msg: msg,
        };
        let payloadStr = JSON.stringify(payload);
        this.myEmitter.emit("msg", payloadStr);
      } else {
        this.myEmitter.emit("data", data);
      }
    });
  }

  joinChannel(channelName: string): void {
    if (this.connectionStatus) {
      this.client.write(`join #${channelName}\r\n`);
      return;
    }
    setTimeout(() => {
      this.joinChannel(channelName);
    }, 1000);
  }

  msgChannel(channelName: string, msg: string): void {
    if (this.connectionStatus) {
      if (this.channels.includes(channelName)) {
        this.client.write(`privmsg #${channelName} : ${msg}\r\n`);
      } else {
        this.joinChannel(channelName);
        setTimeout(() => {
          this.msgChannel(channelName, msg);
        }, 1000);
      }
      return;
    }
    setTimeout(() => {
      this.msgChannel(channelName, msg);
    }, 1000);
  }
}

