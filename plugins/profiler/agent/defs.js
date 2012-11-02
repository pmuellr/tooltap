// Licensed under the Tumbolia Public License. See footer for details.

var defs = exports

//------------------------------------------------------------------------------
defs.types = {
    Profile: {
        id:       String,
        name:     String,
        started:  Number,
        finished: Number
    }
    ProfileNode: {
        functionName:  String,
        url:           String,
        lineNumber:    Number,
        numberOfCalls: Number,
        selfTime:      Number,
        totalTime:     Number,
        children:      ["ProfileNode"]
    }

}

//------------------------------------------------------------------------------
defs.functions = {
    start: {
        parms: [
            {name: String}
        ],
        returns: "Profile",
    },
    stop: {
        parms: [
            {id: String}
        ],
    },
    isSupported: {
        returns: Boolean
    }
}

//------------------------------------------------------------------------------
defs.events = {
    started: {
        parms: [
            {profile: "Profile"}
        ]
    },
    stopped: {
        parms: [
            {profile: "Profile"}
            {nodes:   "ProfileNodes"}
        ]
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
