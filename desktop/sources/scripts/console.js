var escape = require('escape-html');

class Console {
    constructor() {
        this.el = document.createElement("div")
        this.buffer = []
    }

    install(host) {
        this.el.id = "console"
        host.appendChild(this.el)
    }

    update() {
        var html = ""
        this.buffer.forEach(line => {
            html += `<span class='line'>${!line.system ? escape(line.text) : "<span class='system'>" + line.text + "</span>"}</span>` + "\n"
        });
        this.el.innerHTML = html
    }

    append(line, system=false) {
        this.buffer.push({text: line, system: system})
    }
}

module.exports = Console