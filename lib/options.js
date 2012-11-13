// Licensed under the Tumbolia Public License. See footer for details.

var fs   = require("fs")
var url  = require("url")
var path = require("path")
var util = require("util")

var nopt = require("nopt")
var _    = require("underscore")

var etc    = require("./etc")
var initer = require("./initer")

var HOME             = process.env.HOME || process.env.USERPROFILE || '.'
var DATA_DIR_DEFAULT = path.join(HOME, ".tooltap")
var CFG_NAME_DEFAULT = "tooltap-config.json"
var CFG_FILE_DEFAULT = path.join(DATA_DIR_DEFAULT, CFG_NAME_DEFAULT)

//------------------------------------------------------------------------------
var OptsCommon = [
    ["c", "config",       path,       CFG_FILE_DEFAULT],
    ["d", "data-dir",     path,       DATA_DIR_DEFAULT],
    ["v", "verbose",      Boolean,    false],
    ["z", "debug",        Boolean,    false],
    ["i", "init",         path],
    ["V", "version",      Boolean],
    ["h", "help",         Boolean]
]

var OptsTooltapD = OptsCommon.concat([
    ["p", "http-port",    Number, 8080],
    ["s", "https-port",   Number, 8443],
    ["b", "bind-ip",      String, "localhost"],
    ["",  "virtual-host", Boolean],
    ["",  "ssl-cert",     path],
    ["",  "ssl-key",      path]
])

var OptsTooltap = OptsCommon.concat([
    ["u", "server-url",   url]
])

var OptsCfgRelPath = "data-dir ssl-cert ssl-key".split(" ")

//------------------------------------------------------------------------------
exports.getOpts = function getOpts(opts) {
    var optTable

    if (App.PROGRAM == "tooltapd.js")
        optTable = OptsTooltapD
    else
        optTable = OptsTooltap

    var parts      = optsFromTable(optTable)
    var knownOpts  = parts[0]
    var shortHands = parts[1]

    if (util.isArray(opts)) {
        opts = getCmdOpts(knownOpts, shortHands, opts)
        etc.log(JSON.stringify(opts))
    }
    else {
        if (typeof opts != "object") {
            etc.error("options passed were not an object")
        }
    }

    var envOpts = getEnvOpts(knownOpts, shortHands, "TOOLTAP_OPTS")

    _.defaults(opts, envOpts)

    var cfgOpts = getCfgOpts(knownOpts, shortHands, opts)
    var defOpts = getDefaultOpts(optTable)

    _.defaults(opts, cfgOpts, defOpts)

    if (opts.debug) {
        var debug = {}
        opts.debug.split(",").forEach(function(value){
            value = value.trim()
            if (value == "") return

            debug[value] = true
        })

        opts.debug = debug
    }

    opts.argv = opts.argv.remain

    if (!opts["ssl-cert"]) {
        opts["ssl-cert"] = path.join(opts["data-dir"], "ssl", "tooltap-cert.pem")
    }

    if (!opts["ssl-key"]) {
        opts["ssl-key"] = path.join(opts["data-dir"], "ssl", "tooltap-key.pem")
    }

    if (opts.init) {
        etc.log(JSON.stringify(opts))

        initer.initialize(opts.init)
        process.exit(0)
    }

    validate(opts)

    if (opts.version) {
        console.log(App.VERSION)
        process.exit(0)
    }

    if (opts.argv[0] == "?") opts.help = true
    if (opts.help) help()

    if (opts.verbose) {
        exports.printOpts(opts)
    }

    return opts
}

//------------------------------------------------------------------------------
exports.printOpts = function printOpts(opts) {
    var keys = _.chain(opts)
        .keys()
        .sortBy(function(x){return x})
        .value()

    var width = _.chain(keys)
        .map(function(key){return key.length})
        .max()
        .value()

    etc.log("options:")
    keys.forEach(function(key){
        var pkey = etc.left(key + ": ", width + 2)
        etc.log("   " + pkey + JSON.stringify(opts[key]))
    })

    etc.log()
}

//------------------------------------------------------------------------------
function validate(opts) {
    var dataDir = opts["data-dir"]
    if (!fs.existsSync(dataDir)) {
        etc.log("error reading configuration.")
        etc.log("use --init <dir> to initialize a new configuration directory.")
        etc.error("data-dir directory not found: " + dataDir)
    }

    var stat = fs.statSync(dataDir)
    if (!stat.isDirectory()) {
        etc.log("error reading configuration.")
        etc.log("use --init <dir> to initialize a new configuration directory.")
        etc.error("data-dir directory not a directory: " + dataDir)
    }

    if (App.PROGRAM == "tooltapd.js") {
        var port = opts["http-port"]
        if (port <= 0 || port >= 256*256) {
            etc.error("http-port out of range: " + port)
        }

        var port = opts["https-port"]
        if (port <= 0 || port >= 256*256) {
            etc.error("https-port out of range: " + port)
        }

        var sslFile = opts["ssl-cert"]
        if (!fs.existsSync(sslFile)) {
            etc.error("ssl-cert file not found: " + sslFile)
        }

        var sslFile = opts["ssl-key"]
        if (!fs.existsSync(sslFile)) {
            etc.error("ssl-key file not found: " + sslFile)
        }
    }

    else  {
        var urlServer = opts["server-url"]
        if (!urlServer) {
            etc.error("no server-url option specified")
        }

        var parsed = url.parse(urlServer)
        if (!parsed.protocol) {
            etc.error("server-url has no protocol: " + urlServer)
        }
        if (!parsed.hostname) {
            etc.error("server-url has no host name: " + urlServer)
        }
    }

}

//------------------------------------------------------------------------------
function getCmdOpts(knownOpts, shortHands, optsArray) {
    return nopt(knownOpts, shortHands, optsArray, 0)
}

//------------------------------------------------------------------------------
function getEnvOpts(knownOpts, shortHands, envName) {
    var envVal = process.env[envName]

    if (!envVal) return {}

    var envOpts = envVal.trim().split(/\s+/)

    return getCmdOpts(knownOpts, shortHands, envOpts)
}

//------------------------------------------------------------------------------
function getCfgOpts(knownOpts, shortHands, opts) {
    var configFile = opts.config
    if (!configFile) {
        var dataDir = opts["data-dir"]
        if (!dataDir) {
            configFile = path.join(dataDir, CFG_NAME_DEFAULT)
        }
        else {
            configFile = CFG_FILE_DEFAULT
        }
    }

    if (!fs.existsSync(configFile)) return {}

    try {
        contents = fs.readFileSync(configFile, "utf-8")
    }
    catch (e) {
        etc.error("error reading config file: " + configFile + ": " + e)
    }

    try {
        contents = JSON.parse(contents)
    }
    catch(e) {
        etc.error("error parsing JSON in file: " + configFile + ": " + e)
    }

    var configDir = path.dirname(configFile)
    OptsCfgRelPath.forEach(function(opt) {
        if (contents[opt]) {
            contents[opt] = path.join(configDir, contents[opt])
        }
    })

    return contents

}

//------------------------------------------------------------------------------
function getDefaultOpts(optTable) {
    var defaultOpts = {}

    for (var i=0; i<optTable.length; i++) {
        var knownOpt   = optTable[i][1]
        var defaultVal = optTable[i][3]

        if (defaultVal == undefined) continue

        defaultOpts[knownOpt] = defaultVal
    }

    return defaultOpts
}

//------------------------------------------------------------------------------
function optsFromTable(optTable) {
    var knownOpts  = {}
    var shortHands = {}

    // ["c", "config",       path,       path.join(DATA, "tooltap-config.json")],

    for (var i=0; i<optTable.length; i++) {
        var shortHand = optTable[i][0]
        var knownOpt  = optTable[i][1]
        var optType   = optTable[i][2]

        knownOpts[knownOpt] = optType

        if (shortHand) {
            shortHands[shortHand] = ["--" + knownOpt]
        }
    }

    return [knownOpts, shortHands]
}

//------------------------------------------------------------------------------
function canWrite(file) {
    var stat  = fs.statSync(file)
    var user  = process.getuid() === stat.uid
    var group = process.getgid() === stat.gid
    var mode  = stat.mode & 00777

//  console.log("canWrite(" + file + ")")
//  console.log("   stat.mode: " + Number(mode).toString(8))
//  console.log("   proc.uid:  " + process.getuid())
//  console.log("   stat.uid:  " + stat.uid)
//  console.log("   proc.gid:  " + process.getgid())
//  console.log("   stat.uid:  " + stat.uid)

    return false ||
        (user  && (mode & 00200)) ||
        (group && (mode & 00020)) ||
                  (mode & 00002)
}

//------------------------------------------------------------------------------
function canRead(file) {
    if (!fs.existsSync(file)) return false

    var stat  = fs.statSync(file)
    var user  = process.uid === stat.uid
    var group = process.gid === stat.gid

    return false ||
        (user  && (stat.mode & 00400)) ||
        (group && (stat.mode & 00040)) ||
                  (stat.mode & 00004)
}

//------------------------------------------------------------------------------
function help() {
    var fileName = path.join(path.dirname(__filename), "help.md")
    var helpText = fs.readFileSync(fileName, "utf-8")
    console.log(helpText)
    process.exit(1)
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
