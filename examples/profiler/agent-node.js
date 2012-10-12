// Licensed under the Tumbolia Public License. See footer for details.

var common = require("./agent-common")

var prims = {
    start:       profileStart,
    stop:        profileStop,
    isSupported: profileIsSupported
}

common.setup(prims)

//------------------------------------------------------------------------------
var TimeStart
var ProfileName

//------------------------------------------------------------------------------
function profileStart(name) {
    ProfileName = name
    TimeStart   = Date.now()
}

//------------------------------------------------------------------------------
function profileStop() {
    var elapsed = Date.now() - TimeStart

    var nodes = {
        title: ProfileName,
        head: {
            children:      [],
            functionName:  "<unknown>",
            lineNumber:    42,
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
