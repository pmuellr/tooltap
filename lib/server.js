// Licensed under the Tumbolia Public License. See footer for details.

var server = exports

var os    = require("os")
var dns   = require("dns")
var path  = require("path")
var http  = require("http")
var https = require("https")

var express   = require("express")
var websocket = require("websocket")

var etc    = require("./etc")
var routes = require("./routes")

//------------------------------------------------------------------------------
server.start = function(opts) {
    var port = opts.port

    var app        = express()
    var httpServer

    if (opts.https) {
        httpServer = https.createServer(opts.https, app)
    }
    else {
        httpServer = http.createServer(app)
    }

    var bindName = opts.bindip
    if (bindName == "ALL") bindName = undefined

    var serverURL = opts.serverurl
    var serving
    var protocol  = (opts.https ? "https" : "http")

    if (!serverURL) {
        if (bindName)
            serverURL = getServerURL(opts, port, bindName)
        else {
            serverURL = getServerURL(opts, port, os.hostname())
        }
    }

    app.set("port", port)

    routes.configure(app)

    app
        .use(express.static(path.join(__dirname, "..", "www")))
        .use(express.logger("dev"))
        .use(express.bodyParser())
        .use(app.router)
        .use(addCORSHeaders)
        .use(app.router)
        .use(notFoundHandler)
        .use(errorHandler)

    var wsServer = new websocket.server({
        httpServer:            httpServer,
        autoAcceptConnections: false
    })

    httpServer.listen(port, bindName, function() {
        etc.log("tooltap server started at: " + serverURL)
        if (bindName) return

        var nifs = os.networkInterfaces()
        for (var nifName in nifs) {
            var addrs = nifs[nifName]
            addrs.forEach(function(addr){
                if (addr.internal) return

                dns.reverse(addr.address, function(err, domains){
                    if (err) return
                    domains.forEach(function(domain){
                        var serverURL = getServerURL(opts, port, domain)
                        etc.log("tooltap server also at:    " + serverURL)
                    })
                })
            })
        }
    })

    httpServer.on("error", function(err){
        etc.error("error running server(" + port + ",'" + bindName + "': " + err)
    })

    wsServer.on("request", function(request){
        etc.debug("conn", "connection accepted from " + request.origin)
        var connection = request.accept("tooltap-protocol", request.origin)

        connection.on("message", function(message) {
            etc.debug("message", "message recv " + request.origin)
            if (message.type != "utf8") throw new Error("wops")

            etc.debug("message", "message sent " + request.origin)
            connection.sendUTF("Here's some text that the target is urgently awaiting!")
        })

        connection.on("close", function(reasonCode, description){
            etc.debug("conn", "connection closed from  " + request.origin)
        })
    })

}

//-----------------------------------------------------------------------------
function getServerURL(opts, port, hostName) {
    var result    = ""
    var protocol  = (opts.https ? "https" : "http")

    result = protocol + "://" + hostName

    if (!opts.https && port != 80)  result += ":" + port
    if ( opts.https && port != 443) result += ":" + port

    return result
}

//-----------------------------------------------------------------------------
function notFoundHandler(req, res) {
    res.status(404)
    res.end("resource not found: " + req.url)
}

//-----------------------------------------------------------------------------
function errorHandler(err, req, res, next) {
    res.status(500)
    res.end("an error occurred: " + err)
}

//-----------------------------------------------------------------------------
function addCORSHeaders(req, res, next) {
    var origin = req.header("Origin")
    if (!origin) return next()

    res.header("Access-Control-Allow-Origin"),  origin
    res.header("Access-Control-Max-Age"),       "600"
    res.header("Access-Control-Allow-Methods"), "GET, POST, DELETE"

    next()
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
