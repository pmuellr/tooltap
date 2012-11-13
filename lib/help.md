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

    -c --config <file>           config file
    -d --data-dir <dir>          data directory (default: ~/.tooltap)
    -v --verbose                 run verbosely
    -z --debug                   run very verbosely
    -i --init <dir>              initialize a new data directory
    -V --version                 print the version then exit
    -h --help                    print this help then exit

tooltapd (server) options are one of the following:

    -p --http-port  <port>       https port to run server on (default: 8080)
    -s --https-port <port>       http  port to run server on (default: 8443)
    -b --bind-ip <ip-or-host>    ip / hostname to bind to (default: 127.0.0.1)
                                 (using ALL will bind to all if's)
       --virtual-host            parse userid from host
       --ssl-cert <pem-file>     name of the ssl cert file
       --ssl-key  <pem-file>     name of the ssl key file

tooltap (runner) options / cmds are one of the following:

    <cmd>                        script and args to run under tooltap
    -s --server-url <url>        tooltap server url

The default for --data-dir is ~/.tooltap, where ~ is the either the value
of the HOME or USERPROFILE environment variable.

The default for --config is the file `<data-dir>`/tooltap-config.json

The default for --ssl-cert is the file `<data-dir>`/ssl/tooltap-cert.pem

The default for --ssl-key is the file `<data-dir>`/ssl/tooltap-key.pem

Any options (besides --config, --version, --help , --init) can be added to
the config file, like so:

    {
        "data-dir":     ".",
        "verbose":      true,
        "debug":        false,
        "http-port":    80,
        "https-port":   443,
        "bind-ip":      "my-tooltap.example.com",
        "virtual-host": true,
        "ssl-cert":     "./ssl/my-cert.pem",
        "ssl-key":      "./ssl/my-key.pem",
        "server-url":   "http://bob.my-tooltap.example.com"
    }

Options which specify file names or directories can use relative paths for
those options, which will be interpreted relative to the path of the config
file.

A string of command-line options can also be set in the environment variable
TOOLTAP_OPTS.

Option precedence: command-line, environment variable, config file.