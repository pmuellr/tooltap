#!/usr/bin/env node

// Licensed under the Tumbolia Public License. See footer for details.

tooltap = exports

fs   = require("fs")
util = require("util")

nopt = require("nopt")

etc    = require("./etc")
server = require("./server")

tooltap.PROGRAM = path.basename(__filename)
tooltap.VERSION = require("../package.json").version

//------------------------------------------------------------------------------
tooltap.main = function(opts) {
    if (util.isArray(opts)) opts = parseArgs(opts)

    etc.log("use --help at the command line for help")
    server.start(opts)
}

//------------------------------------------------------------------------------
function parseArgs(args) {
    var knownOpts = {
        "port":    Number,
        "verbose": Boolean,
        "version": Boolean,
        "help":    Boolean
    }

    var shortHands = {
        "p": "--port",
        "v": "--verbose",
        "h": "--help",
        "?": "--help"
    }

    var parsed = nopt(knownOpts, shortHands, args, 0)

    if (parsed.help) help()

    if (parsed.version) {
        console.log(tooltap.VERSION)
        process.exit(0)
    }

    var opts = {}

    opts.verbose = !!parsed.verbose
    opts.port    = parsed.port

    return opts
}

//------------------------------------------------------------------------------
function help() {
    var fileName = path.join(path.dirname(__filename), "help.txt")
    var helpText = fs.readFileSync(fileName, "utf-8")
    console.log(helpText)
    process.exit(1)
}

//------------------------------------------------------------------------------
if (require.main === module) {
    tooltap.main(process.argv.slice(2))
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
