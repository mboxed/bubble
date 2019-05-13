class Connection {
    constructor() {

    }

    start(console) {
        if(!localStorage.getItem("nick")) {
            console.append("Hey there! Before you connect, it'd be wise to set yourself a nickname.", true)
            console.append("Type <code>!nick set &lt;nickname&gt;</code> to do that.", true)
        }
    }
}

module.exports = Connection