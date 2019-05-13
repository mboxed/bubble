class Textbox {
    constructor() {
        this.el = document.createElement("textarea")
    }

    install(host) {
        this.el.id = "textbox"
        this.el.onkeypress = function(evt) {
            if(evt.keyCode == 13) {
                bubble.onCommand(document.getElementById("textbox").value)
                document.getElementById("textbox").value = ""
                return false;
            }
            return true;
        }
        host.appendChild(this.el)
    }
}

module.exports = Textbox