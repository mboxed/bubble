const Theme = require('./scripts/lib/theme')
const Command = require('./scripts/lib/command')
const Navi = require('./scripts/navi')
const Console = require('./scripts/console')
const Connection = require('./scripts/connection')
const Textbox = require('./scripts/textbox')

class Bubble {
    constructor() {
        this.theme = new Theme()
        this.command = new Command()
        this.navi = new Navi()
        this.cons = new Console()
        this.textbox = new Textbox()
        this.connection = new Connection()
        this.drag_el = document.createElement('drag')
    }

    onCommand(line) {
        this.cons.append(`<system> ${line}`)
        if(line.startsWith("!")) {
            var parsed = line.substring(1).split(" ")
            var cmd = parsed.splice(0,1)
            this.command.callCommand(cmd, parsed, this.cons, this.connection)
        }
        this.update()
    }

    install(host = document.body) {
        this.navi.install(host)
        this.textbox.install(host)
        this.cons.install(host)

        host.appendChild(this.drag_el)
        this.theme.install(host)
    }

    start() {
        this.theme.start()
        this.connection.start(this.cons)

        this.cons.append("Welcome to Bubble.", true)
        this.cons.append("----------------------------")

        this.update()
    }

    update() {
        this.navi.update()
        this.cons.update()
    }
}

module.exports = Bubble