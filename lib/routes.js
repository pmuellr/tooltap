// Licensed under the Tumbolia Public License. See footer for details.

routes = exports

//------------------------------------------------------------------------------
routes.configure = function configure(app) {
    app.get("/u/:userid",  dummy)
    app.get("/p/:package", dummy)
}

//------------------------------------------------------------------------------
function dummy(req, res, next) {
    res.end("dummy for " + req.url)
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
