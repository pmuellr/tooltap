// Licensed under the Tumbolia Public License. See footer for details.

var os    = require("os")
var dns   = require("dns")
var path  = require("path")
var http  = require("http")
var https = require("https")

var Q         = require("q")
var express   = require("express")
var websocket = require("websocket")

var etc    = require("./etc")
var routes = require("./routes")

var server = exports

//------------------------------------------------------------------------------
server.start = function start() {
    var opts = App.opts

    Q.resolve(true)
        .then(function() {return startHttp( opts)})
        .then(function() {return startHttps(opts)})
        .then(function() {
            if (!opts.verbose) return
            server.dumpInfo()
        })
}

//------------------------------------------------------------------------------
server.dumpInfo = function dumpInfo() {
    getAllDomains(App.opts, dumpInfo2)
}

//------------------------------------------------------------------------------
function dumpInfo2(allDomains) {
    etc.log("server available at:")

    allDomains.forEach(function(domain){
        etc.log("   http://" + domain + ":" + App.opts["http-port"])
        etc.log("   https://" + domain + ":" + App.opts["https-port"])
    })

    etc.log()
}

//------------------------------------------------------------------------------
function startHttp(opts) {
    var deferred   = Q.defer()
    var expressApp = express()
    var httpServer = http.createServer(expressApp)
    var port       = opts["http-port"]

    startGeneric(deferred, opts, expressApp, httpServer, port, "http")

    return deferred.promise
}

//------------------------------------------------------------------------------
function startHttps(opts) {
    var httpsOpts = {
        key:  opts["ssl-key"],
        cert: opts["ssl-cert"]
    }

    var deferred   = Q.defer()
    var expressApp = express()
    var httpServer = https.createServer(httpsOpts, expressApp)
    var port       = opts["https-port"]

    startGeneric(deferred, opts, expressApp, httpServer, port, "https")

    return deferred.promise
}

//------------------------------------------------------------------------------
function startGeneric(deferred, opts, expressApp, httpServer, port, protocol) {
    var bindName = opts["bind-ip"]
    if (bindName == "ALL") bindName = undefined

    routes.configure(expressApp)

    expressApp
        .use(express.static(path.join(__dirname, "..", "www")))
        .use(express.logger("dev"))
        .use(express.bodyParser())
        .use(addCORSHeaders)
        .use(expressApp.router)
        .use(notFoundHandler)
        .use(errorHandler)

    var wsServer = new websocket.server({
        httpServer:            httpServer,
        autoAcceptConnections: false
    })

    httpServer.listen(port, bindName, function() { deferred.resolve() })

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
function getAllDomains(opts, fn) {
    var promises   = []
    var allDomains = ["localhost", "127.0.0.1"]

    if (opts["bind-ip"] != "ALL") {
        fn([opts["bind-ip"]])
        return
    }

    var nifs = os.networkInterfaces()

    for (var nifName in nifs) {
        var addrs = nifs[nifName]
        addrs.forEach(function(addr){
            if (addr.internal) return

            var promise = Q.ninvoke(dns, "reverse", addr.address)
            promise
                .then(function(domains){
                    domains.forEach(function(domain){ allDomains.push(domain) })
                })
                .fail(function(err){
                    domains.push("<unable-to-resolve--" + addr + ">")
                })

            promises.push(promise)
        })
    }

    Q.allResolved(promises)
        .then(function(){ fn(allDomains) })
}


//-----------------------------------------------------------------------------
function getServerURL(opts, port, hostName, protocol) {
    var result    = ""

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
