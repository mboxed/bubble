var escape = require('escape-html');

const LineType = {
    SYSTEM: "system",
    NORMAL: "normal",
    NOTICE: "notice",
    DEBUG: "debug",
    ERROR: "error"
}

class Line {
    constructor(text, type = LineType.NORMAL, sender=undefined) {
        this.text = text
        this.type = type
        this.sender = sender
    }

    toHtml() {
        return `<span class='line'>${this.sender?`&lt;${this.sender}&gt; `:""}${function (l) {
            switch (l.type) {
                case LineType.SYSTEM:
                    return `<span class='system'>${l.text}</span></span>`
                case LineType.NORMAL:
                    return `${escape(l.text)}`
                case LineType.DEBUG:
                    return `<span class='debug'>${escape(l.text)}</span>`
                case LineType.NOTICE:
                    return `<span class='notice'>${escape(l.text)}</span>`
                case LineType.ERROR:
                    return `<span class='error'>${escape(l.text)}</span>`
                default:
                    return `${escape(l.text)}`
            }
        }(this)}</span>`
    }
}

module.exports = { Line: Line, LineType: LineType }