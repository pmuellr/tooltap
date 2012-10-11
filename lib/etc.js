// Licensed under the Tumbolia Public License. See footer for details.

etc = exports

tooltap = require("./tooltap")

DataHome = process.env["HOME"] || process.env["USERPROFILE"] || '.'

//------------------------------------------------------------------------------
etc.log = function log(message) {
    console.log(tooltap.PROGRAM + ": " + message)
}

//------------------------------------------------------------------------------
etc.error = function exit(message) {
    if (message) console.error(message)
    process.exit(1)
}

//------------------------------------------------------------------------------
etc.dataFile = function dataFile(fileName) {
    return path.join(DataHome, tooltap.PROGRAM, fileName)
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
