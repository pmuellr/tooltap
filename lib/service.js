// Licensed under the Tumbolia Public License. See footer for details.

var service = exports

//------------------------------------------------------------------------------
// Deals with interfaces, implementations, and proxies.
//
// Implementations are just objects that expose properties that are primarily
// functions.  Interfaces are descriptions of those objects.  From an interface
// you can create a proxy to access an implementation remotely.
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
service.intfFromImpl = function intfFromImpl(name, impl) {
    var intf = {
        functions:  {}
        properties: {}
    }

    for (var propKey in impl) {
        var propVal = impl[propKey]

        if (typeof propVal == "function") {
            intf.functions[propKey] = propVal.length
        }
        else {
            intf.properties[propKey] = propVal
        }
    }

    return intf
}

//------------------------------------------------------------------------------
service.proxyFromIntf = function proxyFromIntf(name, intf, forwarder) {
    var proxy = {}

    for (var propKey in intf.properties) {
        proxy[propKey] = intf.properties[propKey]
    }

    for (var propKey in intf.functions) {
        var argCount = intf.functions[propKey]
        proxy[propKey] = buildProxyFunction(forwarder, propKey, argCount)
    }

    return proxy
}

//------------------------------------------------------------------------------
function buildProxyFunction(forwarder, serviceName, fnName, argCount) {
    return function() {
        var lastArg = !arguments.length ? undefined : arguments[arguments.length-1]
        var hasCallback = (typeof lastArg == "function")

        var callback    = null
        var callbackId  = null
        var args        = [].slice.call(arguments)

        if (hasCallback) {
            callback   = lastArg
            callbackId = callbackRegister(callback)
            args       = args.slice(0, args.length-1)
        }

        var message = {
            service:    serviceName,
            fn:         fnName,
            args:       args,
            callbackId: callbackId
        }

        try {
            forwarder(message, callbackId)
        }
        catch(e) {
            if (!hasCallback) {
                console.log("error forwarding thru proxy: " +
                    serviceName + "." + fnName + "()"
                )
                throw e
            }

            callbackDeregister(callbackId)
            later(callback, e, null)
        }
    }
}

//------------------------------------------------------------------------------
function later(fn, err, result) {
    setTimeout(function() {
        fn.call(null, err, result)
    }, 0)
}

//------------------------------------------------------------------------------
function callbackRegister(fn) {
    var id = nextId()
    Callbacks[id] = fn
    return id
}

//------------------------------------------------------------------------------
function callbackDeregister(id) {
    delete Callbacks[id]
}

var Callbacks = {}


//------------------------------------------------------------------------------
function nextId() {
    return NextId++
}

var NextId = 0

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
