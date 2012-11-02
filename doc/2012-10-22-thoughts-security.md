tooltap - initial thoughts on security
======================================

2012-10-22 pmuelllr

Discussion of some aspects of security for tooltap.

nomenclature
============

target - the JavaScript application being probed
client - the user interface that displays the probing of the target
server - coordinates targets and clients


single-user vs multi-user
-------------------------

The tooltap server should be able to be run in two different modes.

single-user: For someone who wants to run a server on their own machine

multi-user: For someone who wants to host a server for use by millions over
a series of tubes.

Presumably, multi-user has more "security" in place, compared to
single-user.  single-user mode is also appropriate for cases where you
can get by with  having the targets, clients, and server all running on
the same machine, and have the server only bind to `localhost`.


target capability
-----------------

To make things a little easier to grok, security-wise, it seems easiest to
restrict the capability of the targets.  Targets will also be difficult to
connect in an authorized fashion, as this would require some user interaction
to "sign on" to a server.  Instead, just allow any target to connect to a
server, specifying the userid for whom the target is connecting for.  Eg, you
would use the following URL as `src` attribute in the `<script src=""></script>`
element in your document:

    http://example.com:3000/u/my-userid/target.js
    http://my-userid.example.com:3000/target.js

Because any target can connect to a server like this, the damage a target can
inflict should be minimized.  Thus, targets can only respond to service
requests, and send events.  They cannot make service requests themselves.
They respond and react, but they do not give orders.

This means that all service requests and events should be considered somewhat
suspect, and ensure their data involved is "safe", whatever that means.

In terms of associating targes and clients, targets will be accessible to
clients that are referenced by the same userid.  In the URL examples above,
a target using one of those URLs will only be accessible to a client which
is available for the user `my-userid`.


client capability
-----------------

As clients are web applications, they can be secured via various methods,
including basic auth, oauth, etc.  Pluggable?  TBD

Perhaps further richness can be added, such as having "groups" of userids whose
clients can see any targets running for any userids in the group.  Or perhaps
you can "friend" someone to allow them to see your targets.  TBD


http: vs https:
---------------

You should be able to run tooltap using either plain old http, or under
https.  When running under https, expect more required configuration, like
ssl certs.  Dealing with self-signed certs may well be an issue, especially
for targets which need programmatic access (eg, XHR) to tooltap resources.
In this case, it may be desirable to run both an http server for target access,
and an https server for client access.


