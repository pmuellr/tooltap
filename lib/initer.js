// Licensed under the Tumbolia Public License. See footer for details.

var fs   = require("fs")
var path = require("path")

var etc = require("./etc")

//------------------------------------------------------------------------------
exports.initialize = initialize

function initialize(dir) {
    var templateDir = path.join(path.dirname(__dirname), "data-dir-template")
    etc.log("initializing data-dir directory: " + dir)
    copyDirectory(templateDir, dir)
}

//------------------------------------------------------------------------------
function copyDirectory(src, dst) {
    try {
        fs.mkdirSync(dst)
    }
    catch (e) {
        etc.error("error creating directory: " + dst + " error: " + e)
    }

    var srcEntries = fs.readdirSync(src)

    srcEntries.forEach(function(entry){
        var srcEntry = path.join(src, srcEntry)
        var dstEntry = path.join(dst, srcEntry)

        var stats = fs.statSync(srcEntry)
        if (stats.isDirectory()) {
            copyDirectory(srcEntry, dstEntry)
        }
        else {
            copyFile(srcEntry, dstEntry)
        }
    })

}

//------------------------------------------------------------------------------
function copyFile(src, dst) {
    try {
        fs.writeFileSync(dst, fs.readFileSync(src))
    }
    catch (e) {
        etc.error("error writing file: " + dst + " error: " + e)
    }
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
