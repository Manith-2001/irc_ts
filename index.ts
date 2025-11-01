import * as net from "net";

interface ClientProps {
  server: string;
  port: number;
  nick: string;
  username: string;
  realname: string;
}

export function IRCClient({
  server,
  port,
  nick,
  username,
  realname,
}: ClientProps) {
  var client = net.connect(
    {
      host: server,
      port: port,
    },
    () => {
      client.write("CAP LS 302\r\n");
      client.write("PASS test123\r\n");
      client.write(`NICK ${nick}\r\n`);
      client.write(`USER ${username} 0 * :${realname}\r\n`);
      client.write("CAP END\r\n");
    },
  );
  return client;
}
