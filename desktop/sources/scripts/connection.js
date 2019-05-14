var Socket = require("net").Socket;
var IrcSocket = require("irc-socket");

class Connection {
    constructor() {
    }

    start(cons) {
        if(!localStorage.getItem("nickname")) {
            cons.append("Hey there! Before you connect, please set yourself a nickname.", true)
            cons.append("Type <code>!nickname set &lt;nickname&gt;</code> to do that.", true)
            cons.append("----------------------------")
        }
    }

    setRealname(real, cons) {
        if(real) {
            localStorage.setItem("realname", real)
            cons.append(`Updated realname to <code>${localStorage.getItem("realname")}</code>.`, true)
        } else {
            cons.append(`<code>!realname set</code> requires a realname.`, true)
        }
    }

    setNickname(nick, cons) {
        if(nick) {
            localStorage.setItem("nickname", nick)
            cons.append(`Updated nickname to <code>${localStorage.getItem("nickname")}</code>.`, true)
        } else {
            cons.append(`<code>!nick set</code> requires a nickname.`, true)
        }
    }

    connect(server, cons) {
        if(this.ircSocket && this.ircSocket.isConnected()) {
            cons.append(`Already connected to <code>${this.ircSocket.connectOptions.host}</code>`, true)
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
            realname: [localStorage.getItem("realname") ? localStorage.getItem("realname") :  localStorage.getItem("nickname")],
            timeout: 5 * 60 * 1000
        })
        this.ircSocket.connect().then(function(res) {
            if(res.isFail()) {
                return;
            }
        })

        var theSocket = this.ircSocket

        this.ircSocket.on('data', function(msg) {
            if (msg.slice(0, 5) === "ERROR") {
                theSocket.end();
            }

            cons.append(`<server> ${msg}`)
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