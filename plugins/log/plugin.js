// Licensed under the Tumbolia Public License. See footer for details.

var path    = require("path")
var tooltap = require("tooltap")

var pluginName = path.basename(__dirname)

var plugin = tooltap.getPlugin(pluginName)

plugin.registerAgentDir("node",    "./agent")
plugin.registerAgentDir("browser", "./agent")

var client = plugin.registerClientDir("./client")

client.setLauncherModule("./client/launcher")

var service = plugin.registerService({
    functions: [],
    events:    ["log"]
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
