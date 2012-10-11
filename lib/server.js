// Licensed under the Tumbolia Public License. See footer for details.

server = exports

path = require("path")
http = require("http")

express   = require("express")
websocket = require("websocket")

etc = require("./etc")

//------------------------------------------------------------------------------
server.start = function(opts) {
    etc.log("opts: " + JSON.stringify(opts))

    var port = opts.port ||
               process.env.PORT ||
               process.env.npm_package_config_port ||
               3000

    var app        = express()
    var httpServer = http.createServer(app)

    app.set("port", port)
    app.use(express.logger("dev"))
    app.use(express.bodyParser())
    app.use(express.static(path.join(__dirname, "..", "www")))
    app.use(app.router)

    var wsServer = new websocket.server({
        httpServer:            httpServer,
        autoAcceptConnections: false
    })

    httpServer.listen(port, function() {
        etc.log("tooltap server listening on port: " + port)
    })

    wsServer.on("request", function(request){
        console.log("accepted connection from " + request.origin)
        var connection = request.accept("tooltap-protocol", request.origin)

        connection.on("message", function(message) {
            if (message.type != "utf8") throw new Error("wops")
            console.log("received message: " + message.utf8Data)

            connection.sendUTF("Here's some text that the target is urgently awaiting!")
        })

        connection.on("close", function(reasonCode, description){

        })
    })


}

//------------------------------------------------------------------------------
function socketioConnection(socket) {
    etc.log("socket.io connected")

    socket.on(  "tooltap-connect", function (message, fn) {
        etc.log("tooltap-connect: " + JSON.stringify(message, null, 4))
        fn({})
    })

    socket.on(  "tooltap-command", function (message, fn) {
        etc.log("tooltap-command" + JSON.stringify(message, null, 4))
        fn({})
    })

    socket.on("disconnect", function () {
        etc.log("socket.io disconnected")
    })

}

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
