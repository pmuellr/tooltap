// Licensed under the Tumbolia Public License. See footer for details.

var tooltap = require("tooltap")

var plugin  = tooltap.getCurrentPlugin()
var service = plugin.service
var $pre    = null

$(document).ready(on_ready)

//------------------------------------------------------------------------------
function on_ready() {
    $pre = $("#log")

    service.events.on("log", on_log)

    tooltap.on("target-attached", on_target_attached)
    tooltap.on("target-detached", on_target_detached)
}

//------------------------------------------------------------------------------
function on_log(message) {
    $pre.append(document.createTextNode(message))
}

//------------------------------------------------------------------------------
function on_target_attached(target) {
    on_log(">>> target attached: " + target.label)
}

//------------------------------------------------------------------------------
function on_target_detached(target) {
    on_log("<<< target detached: " + target.label)
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
