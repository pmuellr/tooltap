// Licensed under the Tumbolia Public License. See footer for details.

var tooltap = require("tooltap")

var origConsole    = console
var origConsoleLog = console.log

var service = tooltap.defineService([])

//------------------------------------------------------------------------------
// override the global console log method
//------------------------------------------------------------------------------
console.log = function(message) {
    try {
        origConsoleLog.apply(origConsole, arguments)

        service.events.log("" + message)
    }
    catch(e) {}
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
