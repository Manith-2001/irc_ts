import * as net from "net";
import * as readline from "node:readline";
import { stdin, stdout } from "node:process";
const PORT = 6665;
const HOST = "irc.libera.chat";
const rl = readline.createInterface({ input: stdin, output: stdout });

function ask() {
  rl.question("Enter your command: ", (answer) => {
    const command = answer + '\r\n';
    const raw = Buffer.from(command, "ascii");
    console.log(raw.toString('hex'));
    client.write(command);
    ask();
  });
}

var client = net.connect(
  {
    host: HOST,
    port: PORT,
  },
  () => {
    client.write("CAP LS 302\r\n");
    client.write("PASS test123\r\n");
    client.write("NICK gx_ultra\r\n");
    client.write("USER gxultra 0 * :GXULTRA\r\n");
    client.write("CAP END\r\n");
    ask();
  },
);

client.on("data", (data) => {
  console.log(data.toString("utf8"));
  if (data.includes("PING :")) {
    const token = data.toString().replace("PING :", "");
    client.write(`PONG ${token}\r\n`);
  }
});
