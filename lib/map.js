// Licensed under the Tumbolia Public License. See footer for details.

//-----------------------------------------------------------------------------
function SimpleMap(initial) {
    if (!(this instanceof SimpleMap)) return new SimpleMap(initial)

    this._map = {}

    if (!initial) return

    function hop(object, key) {
        return Object.prototype.hasOwnProperty.call(object, key)
    }

    for (var key in initial) {
        if (hop(initial, key)) {
            this._map[this._keyName(key)] = initial[key]
        }
    }
}

//-----------------------------------------------------------------------------
SimpleMap.prototype.get = function get(key) {
    return this._map[this._keyName(key)]
}

//-----------------------------------------------------------------------------
SimpleMap.prototype.has = function has(key) {
    return Object.prototype.hasOwnProperty.call(this._map, this._keyName(key))
}

//-----------------------------------------------------------------------------
SimpleMap.prototype.set = function set(key, val) {
    this._map[this._keyName(key)] = val
    return this
}

//-----------------------------------------------------------------------------
SimpleMap.prototype.del = function del(key) {
    delete this._map[this._keyName(key)]
    return this
}

//-----------------------------------------------------------------------------
SimpleMap.prototype._keyName = function _keyName(key) {
    return "#" + key
}

//-----------------------------------------------------------------------------
module.exports = SimpleMap

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
