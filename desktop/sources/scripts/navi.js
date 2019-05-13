class Navi {
    constructor() {
        this.el = document.createElement('navi')
    }

    install(host) {
        host.appendChild(this.el)
    }

    update() {
        let html = ''

        this.el.innerHTML = html
    }
}

module.exports = Navi