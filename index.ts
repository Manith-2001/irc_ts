import * as net from "net";
const PORT = 6665;
const HOST = "irc.libera.chat";

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
  },
);

client.on("data", (data) => {
  console.log("server: ", data.toString("utf8"));
});
