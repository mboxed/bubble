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
            html += line.toHtml()
        });
        this.el.innerHTML = html
        this.el.scrollTop = this.el.scrollHeight
    }

    append(line, system=false) {
        this.buffer.push(line)
    }
}

module.exports = Console