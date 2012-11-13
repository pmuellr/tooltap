#!/usr/bin/env node

// Licensed under the Tumbolia Public License. See footer for details.

var tooltap = exports

var path = require("path")

var etc     = require("./etc")
var options = require("./options")

var packageJSON = require("../package.json")

var tooltap = exports

tooltap.run = run

//------------------------------------------------------------------------------
if (require.main === module) {
    run(process.argv.slice(2))
}

//------------------------------------------------------------------------------
function run(opts) {
    global.App = {}

    App.PROGRAM = path.basename(__filename)
    App.VERSION = packageJSON.version
    App.opts    = {}

    etc.app = App

    App.opts    = options.getOpts(opts)
    App.started = Date.now()

    etc.log("woulda run: " + JSON.stringify(App.opts))
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
