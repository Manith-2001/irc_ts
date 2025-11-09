# IRC Library written in TypeScript

## Installation

The module is currently not available on the npm registrary so you will have to clone the project and add it to your `package.json`
path like this :

```json
    "irc_ts": "file:path/to/irc_ts"
```

or npm link it :

```bash
 npm link /path/to/your/clone
```

## Basic Usage

The basic functionality any IRC library has to provide is connectivity so to connect to an IRC server you can do the following

```ts
var client = new IRCClient(
  "irc.yourserver.com",
  port,
  "yourNick",
  "yourUsername",
  "yourRealName",
);
```

Connection is not enough though you would like to connect to a channel also right ? So in order to do that you can do the following:

```ts
client.joinChannel("yourChannel");
```

As per the IRC spec if the channel doesn't exist this will create the channel for you.

Now you have joined the channle but how about sending a message to the channel, well you can do it like this :

```ts
client.msgChannel("yourChannel", "Hello world");
```

Ok so we have joined a channel sent a message great we have covered most of the basics only one last thing remaining listening for messages sent to our client. This includes messages sent to channels our client has joined or even private messages sent to us directly by users

```ts
client.myEmitter.addListener("msg", function (message: string) {
  let message_json: MessagePayload = JSON.parse(message);
  console.log(
    "message received : " + message_json.sender + " " + message_json.msg,
  );
});
```

So your question would be how to distinguish a channel message from a message directly from a user well that is simple if the sender has `#` then its from a channel for example `#yourChannel` but if its from a user it will look something like this `user`

Now this library is still in a very primitive stage so there will be many Commands of IRC that the moduke wont be handling but for that I have left a provision :

```ts
client.myEmitter.addListener("data", function (message: any) {
  console.log("listener" + message.toString("utf8"));
});
```

## What is IRC even

For those of you lost up until now don't worry I didnt know about IRC either uo until a few months ago so what is IRC (Internet Relay Chat):

```
While based on the client-server model, the IRC (Internet Relay Chat)
protocol allows servers to connect to each other effectively forming
a network.
```

This is the abstract provided by the Internet Engineering Task Force (IETF). Basically it is a messaging protocol that you could use if you dont want to spin up a central server of your own. It's pretty neat for setting up things like in game chat rooms or in general custome service chats where you dont want to invest on a server and just get things working.

There are obvious cons to this a glaringly obvious one is that if your client is not online then all the messages sent to you client or to a channel you were a part of is gone in the wind. There are ways people have found work arounds one is an [IRC Bouncer](https://www.reddit.com/r/irc/comments/35vcth/comment/cr86hcs/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button)

TODO's :
- [ ] Add a password option when creating a client
- [ ] write tests

