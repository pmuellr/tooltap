// Licensed under the Tumbolia Public License. See footer for details.

etc = exports

etc.verbose = false

tooltap = require("./tooltap")

DataHome = process.env["HOME"] || process.env["USERPROFILE"] || '.'

Debug = []

//------------------------------------------------------------------------------
etc.log = function log(message) {
    console.log(tooltap.PROGRAM + ": " + message)
}

//------------------------------------------------------------------------------
etc.error = function exit(message) {
    if (message) etc.log(message)
    process.exit(1)
}

//------------------------------------------------------------------------------
etc.dataFile = function dataFile(fileName) {
    return path.join(DataHome, tooltap.PROGRAM, fileName)
}

//------------------------------------------------------------------------------
etc.verbose = function(){}

//------------------------------------------------------------------------------
etc.debug = function(key, message){
    if (!Debug[key]) return
    etc.log(message)
}

function isDebugging(key) {
    return -1 != Debug.indexOf(key)
}

//------------------------------------------------------------------------------
etc.opts = function opts(opts) {
    if (opts.verbose) etc.verbose = function verbose(message){etc.log(message)}
    if (opts.debug)   Debug = opts.debug
}

//------------------------------------------------------------------------------
etc.left = function left(string, width) {
    while (string.length < width) {
        string += " "
    }
    return string
}

//------------------------------------------------------------------------------
etc.compare = function compare(a,b) {
    return (a>b) ? -1 : ((a<b) ? 1 : 0)
}

//------------------------------------------------------------------------------
etc.size = function length(x) {
    return x.length
}

//------------------------------------------------------------------------------
etc.identity = function identify(x) {
    return x
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
