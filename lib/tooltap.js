#!/usr/bin/env node

// Licensed under the Tumbolia Public License. See footer for details.

var tooltap = exports

var fs   = require("fs")
var path = require("path")
var util = require("util")

var nopt = require("nopt")
var _    = require("underscore")

var etc    = require("./etc")
var server = require("./server")

//------------------------------------------------------------------------------

tooltap.PROGRAM = path.basename(__filename)
tooltap.VERSION = require("../package.json").version

//------------------------------------------------------------------------------
tooltap.main = function(opts) {
    if (util.isArray(opts)) opts = parseArgs(opts)
    validateOpts(opts)

    etc.opts(opts)

    if (opts.verbose) printOpts(opts)

    server.start(opts)
}

//------------------------------------------------------------------------------
function validateOpts(opts) {
    var stats

    if (opts.port < 0 || opts.port > 65537)
        etc.error("port number invalid: " + opts.port)

    // bindip - check ip address / hostname

    // datadir - directory must be writable
    if (!fs.existsSync(opts.datadir))
        etc.error("datadir does not exist: " + opts.datadir)

    stats = fs.statSync(opts.datadir)
    if (!stats.isDirectory())
        etc.error("datadir is a file, not a directory: " + opts.datadir)

    if (!canWrite(opts.datadir))
        etc.error("datadir is not writable: " + opts.datadir)

    // packagedir - directory must be readable
    if (!fs.existsSync(opts.packagedir))
        etc.error("packagedir does not exist: " + opts.packagedir)

    stats = fs.statSync(opts.packagedir)
    if (!stats.isDirectory())
        etc.error("packagedir is a file, not a directory: " + opts.packagedir)

    if (!canRead(opts.packagedir))
        etc.error("packagedir is not readable: " + opts.packagedir)

    // serverurl - valid url

    // https - check config file
    if (opts.https) {
        opts.https = readJSONfile(opts.https)

        var fileKeys = ["pfx", "key", "cert"]

        fileKeys.forEach(function(fileKey) {
            var fileName = opts.https[fileKey]
            if (!fileName) return

            if (!fs.existsSync(fileName))
                etc.error("https." + fileKey + " file does not exist: " + fileName)

            var contents
            try {
                contents = fs.readFileSync(fileName, "utf-8")
            }
            catch(e) {
                etc.error("error reading https." + fileKey + " file: " + fileName + ": " + e)
            }

            opts.https[fileKey] = contents
        })
    }
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
function parseArgs(args) {
    if (args.length == 0) etc.log("use --help at the command line for help")

    var defaultPort        = process.env.PORT || process.env.npm_package_config_port || 3000
    var defaultHomeDir     = process.env.HOME || process.env.USERPROFILE || '.'
    var defaultOptionsFile = path.join(defaultHomeDir, ".tooltap", "config.json")
    var defaultDataDir     = path.join(defaultHomeDir, ".tooltap", "data")
    var defaultPackageDir  = path.join(defaultHomeDir, ".tooltap", "packages")

    var knownDebugValues = [
        "conn",
        "message"
    ]

    var defaults = {
        port:       defaultPort,
        bindip:     "localhost",
        multiuser:  false,
        datadir:    defaultDataDir,
        packagedir: defaultPackageDir,
        verbose:    false,
        debug:      "",
        options:    defaultOptionsFile
    }

    var optTable = [
        [ "p", "port",       Number],
        [ "b", "bindip",     String],
        [ "h", "https",      String],
        [ "m", "multiuser",  Boolean],
        [ "d", "datadir",    String],
        [ "k", "packagedir", String],
        [ "s", "serverurl",  String],
        [ "v", "verbose",    Boolean],
        [ "z", "debug",      String],
        [ "o", "options",    String],
        [ "V", "version",    Boolean],
        [ "h", "help",       Boolean]
    ]

    var knownOpts = optTable.reduce(function(result, entry) {
        result[entry[1]] = entry[2]
        return result
    }, {})

    var shortHands = optTable.reduce(function(result, entry) {
        result[entry[0]] = "--" + entry[1]
        return result
    }, {})

    var parsed = nopt(knownOpts, shortHands, args, 0)

    // read the options file, apply defaults
    var optionsFileDefaults = getOptionsFileObject(parsed.options, defaults.options)

    _.defaults(parsed, optionsFileDefaults, defaults)

    // check for some early exit options

    if (parsed.help) help()
    if (args[0] == "?") help()

    if (parsed.version) {
        console.log(tooltap.VERSION)
        process.exit(0)
    }

    // create new opts object

    var opts = {}
    optTable.forEach(function(entry){
        opts[entry[1]] = parsed[entry[1]]
    })

    delete opts.help
    delete opts.version

    // additional option checks

    if (opts.multiuser) etc.error("multi-user mode is not yet supported")

    opts.debug = {}
    if (parsed.debug) {
        parsed.debug.split(",").forEach(function(value){
            value = value.trim()
            if (value == "") return

            if (knownDebugValues.indexOf(value) == -1) {
                etc.log("ignoring unknown debug flag: '" + value + "'")
                return
            }

            opts.debug[value] = true
        })
    }

    return opts
}

//------------------------------------------------------------------------------
function getOptionsFileObject(argName, defName) {
    var name = argName || defName

    var contents = readJSONfile(name, name == defName)
    if (!contents) return {}

    etc.log("options read from: " + name)

    delete contents.options

    return contents
}

//------------------------------------------------------------------------------
function readJSONfile(name, ignoreNotExists) {
    var contents

    try {
        contents = fs.readFileSync(name, "utf-8")
    }
    catch(e) {
        if (ignoreNotExists) return null

        etc.error("error reading JSON file: " + name + ": " + e)
    }

    try {
        contents = JSON.parse(contents)
    }
    catch(e) {
        etc.error("error parsing JSON in file: " + name + ": " + e)
    }

    return contents
}

//------------------------------------------------------------------------------
function printOpts(opts) {
    var keys = _.chain(opts)
        .keys()
        .without("https")
        .sortBy(etc.identity)
        .value()

    var width = _.chain(keys)
        .map(etc.size)
        .max()
        .value()

    etc.verbose("starting with options:")
    keys.forEach(function(key){
        var pkey = etc.left(key + ": ", width + 2)
        etc.verbose("   " + pkey + JSON.stringify(opts[key]))
    })
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
