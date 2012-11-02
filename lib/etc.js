// Licensed under the Tumbolia Public License. See footer for details.

//------------------------------------------------------------------------------
module.exports = new etc()

function etc() {
    this.app = { opts: {}}
}

var methods = etc.prototype

//------------------------------------------------------------------------------
methods.log = function log(message) {
    if (!message) {
        console.log()
        return
    }

    console.log(this.app.PROGRAM + ": " + message)
}

//------------------------------------------------------------------------------
methods.error = function error(message) {
    this.log(message)

    process.exit(1)
}

//------------------------------------------------------------------------------
methods.verbose = function verbose(message){
    if (!this.app.opts.verbose) return

    this.log(message)
}

//------------------------------------------------------------------------------
methods.debug = function debug(key, message){
    if (!this.app.opts.debug) return
    if (!this.app.opts.debug[key]) return

    this.log(message)
}

//------------------------------------------------------------------------------
methods.dataFile = function dataFile(fileName) {
    return path.join(this.app.opts.dataHome, fileName)
}

//------------------------------------------------------------------------------
methods.left = function left(string, width, fill) {
    fill = fill || " "
    return pad(string, width, function(s) {return s + fill})
}

//------------------------------------------------------------------------------
methods.right = function right(string, width, fill) {
    fill = fill || " "
    return pad(string, width, function(s) {return fill + s})
}

//------------------------------------------------------------------------------
function pad(string, width, fn) {
    while (string.length < width) {
        string = fn(string)
    }

    return string
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
