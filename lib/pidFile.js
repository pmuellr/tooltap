// Licensed under the Tumbolia Public License. See footer for details.

var fs   = require("fs")
var path = require("path")

var etc = require("./etc")

//------------------------------------------------------------------------------
// signal: "SIGUSR2" or whatever
//------------------------------------------------------------------------------
module.exports = function pidFile(fileName, signal) {
    fileName = path.join(App.opts["data-dir"], fileName)

    process.on(signal, function() {
        etc.log("someone trying to launch me again: " + fileName)
    })

    try {
        var pid = fs.readFileSync(fileName)
        process.kill(pid, signal)
        etc.error("already running, or so claims: " + fileName)
    }
    catch (e) {}

    console.log("writing pid to " + fileName)
    fs.writeFileSync(fileName, process.pid.toString(), "ascii")

    process.on("exit", function() {
        try {fs.unlinkSync(fileName)} catch(e){}
    })

    process.on("SIGINT", function() {
        try {fs.unlinkSync(fileName)} catch(e){}
        process.exit(1)
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
