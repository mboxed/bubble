const Theme = require('./scripts/lib/theme')
const Navi = require('./scripts/navi')
const Console = require('./scripts/console')
const Connection = require('./scripts/connection')
const Textbox = require('./scripts/textbox')

class Bubble {
    constructor() {
        this.theme = new Theme()
        this.navi = new Navi()
        this.console = new Console()
        this.textbox = new Textbox()
        this.connection = new Connection()
        this.drag_el = document.createElement('drag')
    }

    onCommand(line) {
        this.console.append(`<system> ${line}`)
        if(line.startsWith("!")) {
            var parsed = line.substring(1).split(" ")
            switch(parsed[0]) {
                case 'help':
                    this.console.append("<code>!nick</code> - nickname operations", true)
                    this.console.append("(type <code>!help &lt;command&gt;</code> for more info on a command)", true)
                    break;
                case 'nick':
                    if(parsed[1] == "set") {
                        if(parsed[2]) {
                        localStorage.setItem("nick", parsed[2])
                        this.console.append(`Updated nickname to <code>${localStorage.getItem("nick")}</code>.`, true)
                        } else {
                            this.console.append(`<code>!nick set</code> requires a nickname.`, true)
                        }
                    } else {
                        this.console.append(`Your current nickname is <code>${localStorage.getItem("nick")}</code>.`, true)
                    }
                    break;
                default:
                    this.console.append(`Unknown command <code>!${parsed[0]}</code>`, true)
            }
        }
        this.update()
    }

    install(host = document.body) {
        this.navi.install(host)
        this.textbox.install(host)
        this.console.install(host)

        host.appendChild(this.drag_el)
        this.theme.install(host)
    }

    start() {
        this.theme.start()
        this.connection.start(this.console)

        this.console.append("Welcome to Bubble.", true)
        this.console.append("----------------------------")

        this.update()
    }

    update() {
        this.navi.update()
        this.console.update()
    }
}

module.exports = Bubble