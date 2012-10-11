// Licensed under the Tumbolia Public License. See footer for details.

var tooltap

(function(){
//------------------------------------------------------------------------------

if (tooltap) return

tooltap = {}
ws      = null

ws = new WebSocket("ws://localhost:3000", "tooltap-protocol")
ws.onopen = function (event) {
  ws.send("Here's some text that the server is urgently awaiting!")
}

ws.onmessage = function (event) {
  console.log("received message: " + event.data)
}

setInterval(function(){
  ws.send("Here's some text that the server is urgently awaiting!")
}, 1000)

//------------------------------------------------------------------------------
tooltap.connect = function connect(fn) {
    var url = "ws://" + location.host
    if (location.port != "") url += ":" + port

    ws = new WebSocket(url, "tooltap-protocol")
}

//------------------------------------------------------------------------------
function Connection() {
    if (!(this instanceof Connection)) return new Connection()
    this.onReceive = null
    this.onClose   = null
}

//------------------------------------------------------------------------------
Connection.prototype.send = function send(address, message, fn) {
}

//------------------------------------------------------------------------------
tooltap.onReceive = function onReceive(address, fn) {

}

//------------------------------------------------------------------------------
tooltap.onClose = function onClose(fn) {

}


//------------------------------------------------------------------------------
})()

//------------------------------------------------------------------------------
// Copyright (c) 2012 Patrick Mueller
//
// Tumbolia Public License
//
// Copying and distribution of this file, with or without modification, are
// permitted in any medium without royalty provided the copyright notice and
// this notice are preserved.
//
// TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
//
//   0. opan saurce LOL
//------------------------------------------------------------------------------
