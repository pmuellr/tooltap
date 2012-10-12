// Licensed under the Tumbolia Public License. See footer for details.

var path = require("path")

//------------------------------------------------------------------------------
var serviceName = path.basename(__dirname) // profiler

//------------------------------------------------------------------------------
var Started     = false
var IsSupported = getIsSupported()
var Prims

exports.setup = function setup(prims) {
    Prims = prims

    tooltap.register(serviceName, start)
    tooltap.register(serviceName, stop)
    tooltap.register(serviceName, isSupported)
}

//------------------------------------------------------------------------------
function start(name) {
    if (!IsSupported) return false
    if (Started)      return false

    Started = true

    if (name == null) {
        name = new Date().toISOString().replace(":", "-")
    }

    Prims.start(name)

    return true
}

//------------------------------------------------------------------------------
function stop() {
    if (!IsSupported) return {}
    if (!Started)     return {}

    Started = false

    return Prims.stop()
}

//------------------------------------------------------------------------------
function isSupported() {
    return Prims.isSupported()
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
