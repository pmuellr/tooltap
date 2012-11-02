tooltap - a library / framework / server for web browser tools
==============================================================

initial thoughts here: [doc/2012-10-10-initial-thoughts.md]()

<!-- ======================================================================= -->

installation
============

Eventually, via published npm package.  Until then

    npm -g install git://github.com/pmuellr/tooltap.git#master

<!-- ======================================================================= -->

running
=======

    tooltapd [options]

To get a list of options, use

    tooltapd ?

<!-- ======================================================================= -->

URLs
====

URLs always contain a reference to a user.  This can be either with a virtual
host prefix of the userid, or using `/u/[userid]` as a prefix for all your
URLs.  Examples:

   http://example.com:3000/u/bob
   http://bob.example.com:3000/
   http://bob.example.com:3000/u/bob

These URL prefixes are all equivalent.  Presumably, you don't want to be using
the third style.  We'll refer to these forms as `[base-url]` below.

### `[base-url]/`

An HTML page with information about tooltap

### `[base-url]/vendor/`

A number of 3rd party files are available with a vendor prefix.  This
particular URL lists the resources available and their URLs, which are all
available under this prefix.

### `[base-url]/client`

The URL to the client web app for a particular user.  This is what you'll
end up bookmarking to go directly to the tooltap client.

### `[base-url]/target.js`

The URL to the target JavaScript file for a particular user.  This is what you'll
end up using as the `src` attribute in a `<script src=""></script>` element:

    http://example.com:3000/u/my-userid/target.js
    http://my-userid.example.com:3000/target.js

### `[base-url]/socket`

The WebSocket available for clients and targets to connect to.

### `[base-url]/client-agent/[agent-name]`

The URL where a client agent will be accessed from.


<!-- ======================================================================= -->

agents
======

Agents are a set of files that provide code that
is to be run in target devices, and/or code that is used as a client user
interface.  Typically, an agent will provide both - some interesting data
collection or code poking capabilities in the target, and a user interface to
see what that code is doing in the client.

Agents are packaged as a directory, with the following files and directories:

### `client` directory

This directory contains the client resources - HTML, CSS, JavaScript, etc,
needed to run the client side of the agent.  These files will be accessed
with the `[base-url]/client-agent/[agent-name]` URL, by the client shell.
Presumably you have an `index.html` file in that directory.

This directory is not required if the agent does not provide a client user
interface

### `target` directory

This directory contains the target resources, and is interpreted as a
node module - so you should have an `index.js` file in that directory.
You can include other secondary modules, resources, etc, using relative
`require()` invocations.

<!-- ======================================================================= -->

services
========

Services are collections of JavaScript functions which may be invoked
remotely in an asynchronous manner.  They are implemented in targets, and
invoked from clients.  Results may or may not be returned in callback
functions passed in the service function invocations.

In addition, services expose events, which are sent from the target to
clients, with no response expected or ever returned.

example
-------

Below


defining a service
------------------

Targets define and implement a service:

    tooltap.defineService(module, functions, events)

`module` is the instance of the `module` originally passed to the module factory.

`functions` is either an array of named functions, or an object whose keys are
the names of the functions, and whose values are the functions themselves.

`events` is an array of event names fired by this service

When a service function is invoked it will be passed the following




using a service
---------------

To use a service, first you'll need to get a reference to the agent object,
which is always reference by an id.  To obtain an id, use one of the following
functions:

### `tooltap.getServerId()`

### `tooltap.getSelectedTargetId()`

### `tooltap.getSelectedTargetId()`





* `server`

* `selected-target`

* `target-` + target.id

* `client-` + client.id

* `client-` + client.id

   tooltap.requireServerService(serviceName)
   var service = tooltap.requireServerService(serviceName)

The serivce object returned can be used to invoke service functions, by name.

   service.foo


built-in services
=================

`connector`
-----------

### events






<!-- ======================================================================= -->

license
=======

    Tumbolia Public License

    Copying and distribution of this file, with or without modification, are
    permitted in any medium without royalty provided the copyright notice and
    this notice are preserved.

    TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

      0. opan saurce LOL
