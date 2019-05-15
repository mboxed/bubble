const Line = require('./types/line').Line
const LineType = require('./types/line').LineType

const escape = require('escape-html')

class Command {
    constructor() {
    }

    callCommand(name, args, cons, connection) {
        if(this[name]) {
            this[name](args, cons, connection)
        } else {
            cons.append(new Line(`Unknown command <code>!${name}</code>`, LineType.SYSTEM))
        }
    } 

    help(args, cons, connection) {
        cons.append(new Line("<code>!nickname</code> - nickname operations", LineType.SYSTEM))
        cons.append(new Line("<code>!realname</code> - realname operations", LineType.SYSTEM))
        cons.append(new Line("<code>!connect</code>  - connects to a server", LineType.SYSTEM))
        cons.append(new Line("<code>!quit</code>     - quits from a server", LineType.SYSTEM))
        cons.append(new Line("<code>!buflen</code>   - sets the scrollback buffer length", LineType.SYSTEM))
        cons.append(new Line("(type <code>!help &lt;command&gt;</code> for more info on a command)", LineType.SYSTEM))
    }

    nickname(args, cons, connection) {
        if(args[0] == "set") {
            connection.setNickname(args[1], cons)
        } else {
            cons.append(new Line(`Your current nickname is <code>${escape(localStorage.getItem("nickname"))}</code>.`, LineType.SYSTEM))
        }
    }

    realname(args, cons, connection) {
        if(args[0] == "set") {
            args.splice(0,1)
            connection.setRealname(args.join(" "), cons)
        } else {
            cons.append(new Line(`Your current realname is <code>${escape(localStorage.getItem("realname"))}</code>.`, LineType.SYSTEM))
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
            cons.append(new Line("Unable to <code>!quit</code> - no connection currently active!", LineType.SYSTEM))
        }
    }

    buflen(args, cons, _) {
        if(args[0] && parseInt(args[0]) != NaN) {
            cons.setBuflen(parseInt(args[0]))
            cons.append(new Line(`Set buffer length to ${cons.buflen}`, LineType.SYSTEM))
        } else {
            cons.append(new Line(`Your current buffer length is ${cons.buflen}`, LineType.SYSTEM))
        }
    }

    join(args, cons, connection) {
        if(connection.isConnected()) {
            if(args[0]) {
                connection.join(args[0], cons)
            } else {
                cons.append(new Line(`<code>!join</code> needs a channel argument`, LineType.SYSTEM))
            }
        } else {
            cons.append(new Line(`Unable to <code>!join</code> - no connection currently active!`, LineType.SYSTEM))
        }
    }
}

module.exports = Command