tooltap
=======

a tool for instrumenting JavaScript stuff
-----------------------------------------

* a web server that agent code running in your environment connects to
to provide information
* a web app running on that web server which displays information from agent
code however it wishes

Web pages can be instrumented by adding a `<script>` element to their page,
pointing into the tooltap web server.  Node.js applications can be
instrumented by running them with the `tooltap` command.

source and more information
---------------------------

    https://github.com/pmuellr/tooltap

usage
-----

    tooltapd <options>           run the tooltap server
    tooltap  <options> <cmd>     run a node.js CLI under tooltap

common options are one of the following:

    -d --data-dir                tooltap data directory (default: ~/.tooltap)
    -v --verbose                 run verbosely
    -z --debug                   comma-separated list of debug flags:
             conn                display diagnostics for connections
             message             display diagnostics for messages
    -o --options <json file>     use options in specified file
    -V --version                 print the version then exit
    -h --help                    print this help then exit

server options are one of the following:

    -p --http-port  <port>       https port to run server on (default: 8080)
    -s --https-port <port>       http  port to run server on (default: 8443)
    -i --bind-ip <ip-or-host>    ip / hostname to bind to (default: 127.0.0.1)
                                 (using ALL will bind to all if's)
    -u --virtual-host            parse userid from host
    -c --ssl-cert <pem-file>     name of the ssl cert file
    -k --ssl-key  <pem-file>     name of the ssl key file

utility options / cmds are one of the following:

    <script> <args>              run script with args under tooltap
    -i --init <data-dir>         initialize a new data directory
    -c --clean                   clean out the data directory

The default for --options is the file `<data-dir>`/config.json

The default for --data-dir is ~/.tooltap, where ~ is the either the value
of the HOME or USERPROFILE environment variable.
