// Licensed under the Tumbolia Public License. See footer for details.

var tooltap = require("tooltap")

var launcher = exports

launcher.launch = function launch(client) {
    var shells = tooltap.getShells(client)

    if (0 == shell.length) {
        tooltap.newShell(client)
        return
    }

    shells.forEach(function(shell){
        shell.pushToTop()
    })
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
