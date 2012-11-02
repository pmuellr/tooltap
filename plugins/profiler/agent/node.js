// Licensed under the Tumbolia Public License. See footer for details.

var common = require("./common")

exports.tooltapInit = common.tooltapInit

common.setup([start, stop, isSupported])

//------------------------------------------------------------------------------
var TimeStart
var ProfileName

//------------------------------------------------------------------------------
function start(name) {
    ProfileName = name
    TimeStart   = Date.now()
}

//------------------------------------------------------------------------------
function stop() {
    var elapsed = Date.now() - TimeStart

    var nodes = {
        title: ProfileName,
        head: {
            children:      [],
            functionName:  "<unknown>",
            lineNumber:    1,
            numberOfCalls: 1,
            selfTime:      elapsed,
            totalTime:     elapsed
        }
    }

    return nodes
}

//------------------------------------------------------------------------------
function isSupported() {
    return true
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
