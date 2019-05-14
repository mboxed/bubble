var escape = require('escape-html');

class Console {
    constructor() {
        this.el = document.createElement("div")
        this.buffer = []
        if(localStorage.getItem("buflen")) {
            this.buflen = localStorage.getItem("buflen")
        } else {
            this.setBuflen(120)
        }
    }

    install(host) {
        this.el.id = "console"
        host.appendChild(this.el)
    }

    setBuflen(buflen) {
        this.buflen = buflen
        localStorage.setItem("buflen", buflen)
    }

    update() {
        var html = ""
        if(this.buffer.length > this.buflen) {
            this.buffer.splice(0,this.buffer.length-this.buflen)
        }
        this.buffer.forEach(line => {
            html += `<span class='line'>${!line.system ? escape(line.text) : "<span class='system'>" + line.text + "</span>"}</span>` + "\n"
        });
        this.el.innerHTML = html
        this.el.scrollTop = this.el.scrollHeight
    }

    append(line, system=false) {
        this.buffer.push({text: line, system: system})
    }
}

module.exports = Console