var tooltap = require("tooltap-plugin")

var client    = tooltap.registerClient("client")

var agentNode   = tooltap.registerAgent("node",   "./agent-node")
var agentClient = tooltap.registerAgent("client", "./agent-client")

// Licensed under the Tumbolia Public License. See footer for details.

var path    = require("path")
var tooltap = require("tooltap")

var pluginName = path.basename(__dirname)

var plugin = tooltap.getPlugin(pluginName)

plugin.registerAgentDir("node",    "./agent/node")
plugin.registerAgentDir("browser", "./agent/browser")

var client = plugin.registerClientDir("./client")

var service = plugin.registerService({
    functions: ["start", "stop"],
    events:    ["started", "stopped", "data"]
})

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
