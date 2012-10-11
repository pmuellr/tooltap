tooltap - initial thoughts on generalizing web browser tools
============================================================

background
----------

I while back I built [weinre](http://people.apache.org/~pmuellr/weinre/).  Recently, I built [rsprofiler](http://pmuellr.github.com/rsprofiler/).  Both of these tools follow a pattern of a three-ring circus.  I'm using one browser on my desktop (client), to talk to a browser running somewhere else (target), and to make this work there's a server shuffling messages between them (server).

Besides my tools which use this pattern, there's [jsbin](http://jsbin.tumblr.com/post/27938253526/remote-rendering-js-bin-not-only-includes-live), and others.  And then today I read an [article by Christophe Coenraets](http://coenraets.org/blog/2012/10/real-time-web-analytics-with-node-js-and-socket-io/) about the same pattern.

Time to yak shave.

some basics
-----------

It's all JavaScript.  JavaScript code running in the target, client and server.

There should be a generic server which can be used by multiple tools.  You can add new tools to a server by adding packages to the server.

The base server should be able to be run on a person's desktop, or hosted on the cloud for millions of users.

There shall be security.

Security does not extend very deep into the tools, since it's hard to programmatically lock this kind of thing down.  You need to trust your tools.  People can write evil tools.  You shouldn't install those on your server.

The runtime will identify such things as users, devices, target applications (applications having tools run on them), client applications (user interface primarily aimed desktop) that interacts with target applications, and maybe other things like agents (things that collect or generate data).

It should be possible to allow many-to-many connections between things.  For example, you may want to allow multiple desktops to connect to a single mobile device for collaborative debugging.  Or you may want to control multiple devices from a single desktop.  It should be *possible* to do this, but it's likely you will have to do a lot of work to make this work well, for a particular application.

Provide the least amount of web ui as possible.  Probably the base server code should only provide only transport and protocol, and any "server manager" or "portal" would need to be provided as one of the first packages that you would install.

It should be as easy as it can possibly be to instrument a target application.  This will require in many cases that a script be added to the target application.

The communication model is commands and events.

A command is a JSON message sent from one party to another party.  A JSON response may be returned from the sendee to the sender.  The sender of the message registers interest in the response by passing a callback.

An event is a JSON message sent from one party to any interested party.  It's a simple one-way message.  No reply is expected.

server URLs
-----------

**`[base-server-url]/tooltap.js`**

This is the URL that you can use in a `<script>` element to have the web page that includes it participate with the tooltap server.

**`[base-server-url]/ws`**

The URL of the socket.io connection.  Everyone connects via socket.io.

**`[base-server-url]/pkg/[package-name]/[package-url]`**

The URL of the client UI that is provided by a package.  The `[package-url]` part it up to the package to handle.


example scenario - weinre
-------------------------

* download/install tooltap
* download/install the weinre-tooltap package
* run the tooltap server
* add `<script src="http://[my tooltap server ip address]/tooltap.js"></script>` to the web page you want to debug with weinre
* load the web page in the browser that you want to debug, say a mobile device
* on your desktop, load `http://locahost/pkg/weinre/` to bring up the
weinre client
* debug

more details:

The first time you load an application with tooltap, you need to register the user, device, application and such.  This starts with registering the user.  Using a 3rd party authentication service (OAuth).  Once the user is registered, a saved revokable token is used in later connections to avoid the registration step.  Configuration should be done at the desktop when at all possible.

