// Licensed under the Tumbolia Public License. See footer for details.

//------------------------------------------------------------------------------
var Started     = false
var IsSupported = null
var Tooltap     = null
var Service     = null
var Prims       = null
var Console     = null

//------------------------------------------------------------------------------
exports.setup = function setup(prims) {
    Prims       = prims
    IsSupported = isSupported()
}

//------------------------------------------------------------------------------
exports.tooltapInit = function(tooltap, serviceName) {
    Tooltap = tooltap

    Service = Tooltap.createRemoteService(serviceName,
        events: [ "started", "stopped" ],
        functions: [ start, stop, isSupported ]
    )

    Console = Tooltap.getRemoteService("Console")
}

//------------------------------------------------------------------------------
function start(name) {
    if (!IsSupported) return false
    if (Started)      return false

    Started = true

    if (name == null) {
        name = new Date().toISOString().replace(":", "-")
    }

    Service.sendEvent("started")
    Prims.start(name)

    return true
}

//------------------------------------------------------------------------------
function stop() {
    if (!IsSupported) return {}
    if (!Started)     return {}

    Started = false

    Service.sendEvent("stopped")
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
