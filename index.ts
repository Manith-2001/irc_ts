import net = require("net");
import EventEmitter = require("events");

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
	client: any;
	myEmitter: EventEmitter;

	constructor(
		server: string,
		port: number,
		nick: string,
		username: string,
		realname: string,
	) {
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
			}
			else {
				this.myEmitter.emit("data", data);
			}
		});
	}
}

export = { IRCClient };
