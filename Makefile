# Licensed under the Tumbolia Public License. See footer for details.

.PHONY: vendor watch help static-demo

#-------------------------------------------------------------------------------
main: help

#-------------------------------------------------------------------------------
watch:
	node_modules/.bin/node-supervisor -w lib -n error -- lib/tooltap.js

#-------------------------------------------------------------------------------

VERSION_JQUERY    = 1.8.2

URL_JQUERY_MIN = http://code.jquery.com/jquery-$(VERSION_JQUERY).min.js
URL_JQUERY     = http://code.jquery.com/jquery-$(VERSION_JQUERY).js
URL_D3_MIN     = http://d3js.org/d3.v2.min.js
URL_D3         = http://d3js.org/d3.v2.js

#-------------------------------------------------------------------------------
vendor:
	@npm install
	@rm -rf www/vendor
	@mkdir  www/vendor

	curl --output www/vendor/jquery.min.js --progress-bar $(URL_JQUERY_MIN)
	curl --output www/vendor/jquery.js     --progress-bar $(URL_JQUERY)
	curl --output www/vendor/d3.v2.min.js  --progress-bar $(URL_D3_MIN)
	curl --output www/vendor/d3.v2.js      --progress-bar $(URL_D3)

#-------------------------------------------------------------------------------
OPENSSL_ARGS = "US\nNorth Carolina\nApex\nmuellerware.org\ndevelopment\nPatrick Mueller\npmuellr@yahoo.com\n\n\n"

ssl-files:
	openssl genrsa -out ssl.key.pem 1024
	echo $(OPENSSL_ARGS) | openssl req -new -key ssl.key.pem -out ssl.certrequest.csr
	openssl x509 -req -in ssl.certrequest.csr -signkey ssl.key.pem -out ssl.cert.pem
	rm ssl.certrequest.csr
	@echo "{"	                        > ssl.config.json
	@echo "\"key\":  \"ssl.key.pem\"," >> ssl.config.json
	@echo "\"cert\": \"ssl.cert.pem\"" >> ssl.config.json
	@echo "}"	                       >> ssl.config.json

#-------------------------------------------------------------------------------
help:
	@echo "This Makefile supports the following targets:"
	@echo "   watch       -  run the server under node-supervisor watching lib"
	@echo "   vendor      -  get the vendor files"

#-------------------------------------------------------------------------------
# Copyright (c) 2012 Patrick Mueller
#
# Tumbolia Public License
#
# Copying and distribution of this file, with or without modification, are
# permitted in any medium without royalty provided the copyright notice and this
# notice are preserved.
#
# TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
#
#   0. opan saurce LOL
#-------------------------------------------------------------------------------
