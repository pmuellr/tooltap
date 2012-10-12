// Licensed under the Tumbolia Public License. See footer for details.

var common = require("./agent-common")

var prims = {
    start:       profileStart,
    stop:        profileStop,
    isSupported: profileIsSupported
}

common.setup(prims)

//------------------------------------------------------------------------------
function profileStart(name) {
    console.profile(name)
}

//------------------------------------------------------------------------------
function profileStop() {
    console.profileEnd()

    return console.profiles[console.profiles.length-1]
}

//------------------------------------------------------------------------------
function isSupported() {
    if (!window.console)     return false
    if (!console.profile)    return false
    if (!console.profileEnd) return false
    if (!console.profiles)   return false
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
