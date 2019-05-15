const Line = require('./lib/types/line').Line
const LineType = require('./lib/types/line').LineType
const Socket = require("net").Socket;
const IrcSocket = require("irc-socket");
const escape = require('escape-html');
const parse = require('irc-message').parse

const NumericReply = {
    "001": LineType.DEBUG,
    "002": LineType.DEBUG,
    "003": LineType.DEBUG,
    "004": LineType.DEBUG,
    "005": LineType.DEBUG,
    "250": LineType.DEBUG,
    "251": LineType.DEBUG,
    "252": LineType.DEBUG,
    "253": LineType.DEBUG,
    "254": LineType.DEBUG,
    "255": LineType.DEBUG,
    "265": LineType.DEBUG,
    "266": LineType.DEBUG,
    "372": LineType.DEBUG,
    "375": LineType.DEBUG,
    "376": LineType.DEBUG,
}
class Connection {
    constructor() {
    }

    start(cons) {
        if (!localStorage.getItem("nickname")) {
            cons.append(new Line("Hey there! Before you connect, please set yourself a nickname.", LineType.SYSTEM))
            cons.append(new Line("Type <code>!nickname set &lt;nickname&gt;</code> to do that.", LineType.SYSTEM))
            cons.append(new Line("----------------------------"))
        }
    }

    setRealname(real, cons) {
        if (real) {
            localStorage.setItem("realname", real)
            cons.append(new Line(`Updated realname to <code>${escape(localStorage.getItem("realname"))}</code>.`, LineType.SYSTEM))
        } else {
            cons.append(new Line(`<code>!realname set</code> requires a realname.`, LineType.SYSTEM))
        }
    }

    setNickname(nick, cons) {
        if (nick) {
            localStorage.setItem("nickname", nick)
            cons.append(new Line(`Updated nickname to <code>${escape(localStorage.getItem("nickname"))}</code>.`, LineType.SYSTEM))
        } else {
            cons.append(new Line(`<code>!nick set</code> requires a nickname.`, LineType.SYSTEM), true)
        }
    }

    connect(server, cons) {
        if (this.ircSocket && this.ircSocket.isConnected()) {
            cons.append(new Line(`Already connected to <code>${escape(this.ircSocket.connectOptions.host)}</code>`, LineType.SYSTEM), true)
            return;
        }
        var parts = server.split(":")
        var url = parts[0]
        var port = parts[1] ? parseInt(parts[1]) : 6667
        console.log(`Url: ${url} Port: ${port}`)
        this.netSocket = new Socket()
        this.ircSocket = IrcSocket({
            socket: this.netSocket,
            port: port,
            server: url,
            nicknames: [localStorage.getItem("nickname")],
            username: [localStorage.getItem("nickname")],
            realname: [localStorage.getItem("realname") ? localStorage.getItem("realname") : localStorage.getItem("nickname")],
            timeout: 5 * 60 * 1000
        })
        this.ircSocket.connect().then(function (res) {
            if (res.isFail()) {
                return;
            }
        })

        var theSocket = this.ircSocket

        this.ircSocket.on('data', function (msg) {
            var parsed = parse(msg)
            if (!parsed) {
                return;
            }

            if (parsed.command === "ERROR") {
                theSocket.end();
            }


            if(parsed.command.length === 3 && NumericReply[parsed.command]) {
                parsed.params.splice(0,1)
                var message = parsed.params.join(" ")
                cons.append(new Line(`${message}`, NumericReply[parsed.command], "server"))
            } else {
                switch (parsed.command) {
                    case "NOTICE":
                        var message = parsed.params[1]
                        var spl = parsed.prefix.split("!")
                        var sender = spl.length > 1 ? spl[0] : "server"
                        cons.append(new Line(`${message}`, LineType.NOTICE, sender))
                        break;
                    case "PRIVMSG":
                        var sender = parsed.prefix.split("!")[0]
                        // Check for a CTCP query
                        if (parsed.params[1].startsWith("\x01")) {
                            var ctcp = parsed.params[1].substring(1, parsed.params[1].length - 1).split(" ")
                            switch (ctcp[0]) {
                                case "PING":
                                    cons.append(new Line(`CTCP-PING Query recieved from ${sender}`, LineType.NOTICE, "system"))
                                    theSocket.raw(["NOTICE", sender, `:${parsed.params[1]}`])
                                    break;
                                case "ACTION":
                                    ctcp.splice(0,1)
                                    cons.append(new Line(`* ${sender} ${ctcp.join(" ")}`))
                                    break;
                                case "VERSION":
                                    cons.append(new Line(`CTCP-VERSION Query recieved from ${sender}`, LineType.NOTICE, "system"))
                                    theSocket.raw(["NOTICE", sender, ":\x01VERSION Bubble v0.1.0\x01"])
                                    break;
                            }
                        } else {
                            var message = parsed.params[1]
                            cons.append(new Line(`${message}`, LineType.NORMAL, "system"))
                        }
                        break;
                    default:
                        cons.append(new Line(`(${parsed.command}) ${parsed.params}`, LineType.NORMAL, "server"))
                }
            }

            cons.update()
        })
    }

    quit(args, cons) {
        this.ircSocket.raw(`QUIT :${args ? args : "From Bubble"}`)
    }

    join(args, cons) {
        this.ircSocket.raw(`JOIN ${args}`)
    }

    isConnected() {
        return this.ircSocket.isConnected()
    }
}

module.exports = Connection