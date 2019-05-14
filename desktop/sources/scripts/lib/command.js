class Command {
    constructor() {
    }

    callCommand(name, args, cons, connection) {
        if(this[name]) {
            this[name](args, cons, connection)
        } else {
            cons.append(`Unknown command <code>!${name}</code>`, true)
        }
    } 

    help(args, cons, connection) {
        cons.append("<code>!nickname</code> - nickname operations", true)
        cons.append("<code>!realname</code> - realname operations", true)
        cons.append("<code>!connect</code>  - connects to a server", true)
        cons.append("<code>!quit</code>     - quits from a server", true)
        cons.append("<code>!buflen</code>   - sets the scrollback buffer length", true)
        cons.append("(type <code>!help &lt;command&gt;</code> for more info on a command)", true)
    }

    nickname(args, cons, connection) {
        if(args[0] == "set") {
            connection.setNickname(args[1], cons)
        } else {
            cons.append(`Your current nickname is <code>${localStorage.getItem("nickname")}</code>.`, true)
        }
    }

    realname(args, cons, connection) {
        if(args[0] == "set") {
            args.splice(0,1)
            connection.setRealname(args.join(" "), cons)
        } else {
            cons.append(`Your current realname is <code>${localStorage.getItem("realname")}</code>.`, true)
        }
    }

    connect(args, cons, connection) {
        if(args[0]) {
            connection.connect(args[0], cons)
        }
    }

    quit(args, cons, connection) {
        if(connection.isConnected()) {
            connection.quit(args.join(" "), cons)
        } else {
            cons.append("Unable to <code>!quit</code> - no connection currently active!", true)
        }
    }

    buflen(args, cons, _) {
        if(args[0] && parseInt(args[0]) != NaN) {
            cons.setBuflen(parseInt(args[0]))
            cons.append(`Set buffer length to ${cons.buflen}`, true)
        } else {
            cons.append(`Your current buffer length is ${cons.buflen}`, true)
        }
    }

    join(args, cons, connection) {
        if(connection.isConnected()) {
            if(args[0]) {
                connection.join(args[0], cons)
            } else {
                cons.append(`<code>!join</code> needs a channel argument`, true)
            }
        } else {
            cons.append(`Unable to <code>!join</code> - no connection currently active!`, true)
        }
    }
}

module.exports = Command