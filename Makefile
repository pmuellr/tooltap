# Licensed under the Tumbolia Public License. See footer for details.

.PHONY: vendor watch help static-demo

#-------------------------------------------------------------------------------
main: help

#-------------------------------------------------------------------------------
watch:
	node_modules/.bin/node-supervisor -w lib -n error -- lib/tooltapd.js --verbose

#-------------------------------------------------------------------------------

VERSION_JQUERY    = 1.8.2
VERSION_JQUERY_UI = 1.9.0

URL_JQUERY_MIN = http://code.jquery.com/jquery-$(VERSION_JQUERY).min.js
URL_JQUERY     = http://code.jquery.com/jquery-$(VERSION_JQUERY).js
URL_D3_MIN     = http://d3js.org/d3.v2.min.js
URL_D3         = http://d3js.org/d3.v2.js
URL_JQUERYUI   = http://jqueryui.com/resources/download/jquery-ui-$(VERSION_JQUERY_UI).custom.zip

UNP_JQUERYUI   = tmp/jquery-ui-$(VERSION_JQUERY_UI).custom

#-------------------------------------------------------------------------------
vendor:
	@npm install

	@rm -rf vendor
	@mkdir  vendor

	@rm -rf tmp
	@mkdir  tmp

	curl --output vendor/jquery.min.js --progress-bar $(URL_JQUERY_MIN)
	curl --output vendor/jquery.js     --progress-bar $(URL_JQUERY)
	curl --output vendor/d3.v2.min.js  --progress-bar $(URL_D3_MIN)
	curl --output vendor/d3.v2.js      --progress-bar $(URL_D3)
	curl --output tmp/jquery-ui.zip    --progress-bar $(URL_JQUERYUI)

	@mkdir -p vendor/jquery-ui/themes/smoothness/images

	@unzip -q tmp/jquery-ui.zip -d tmp
	@cp $(UNP_JQUERYUI)/js/jquery-ui-$(VERSION_JQUERY_UI).custom.js                  vendor/jquery-ui/jquery-ui.js
	@cp $(UNP_JQUERYUI)/js/jquery-ui-$(VERSION_JQUERY_UI).custom.min.js              vendor/jquery-ui/jquery-ui.min.js
	@cp $(UNP_JQUERYUI)/css/smoothness/jquery-ui-$(VERSION_JQUERY_UI).custom.css     vendor/jquery-ui/themes/smoothness/jquery-ui.css
	@cp $(UNP_JQUERYUI)/css/smoothness/jquery-ui-$(VERSION_JQUERY_UI).custom.min.css vendor/jquery-ui/themes/smoothness/jquery-ui.min.css
	@cp $(UNP_JQUERYUI)/css/smoothness/images/*                                      vendor/jquery-ui/themes/smoothness/images

#-------------------------------------------------------------------------------
OPENSSL_ARGS = "US\nNorth Carolina\nApex\nexample.org\ntooltap development\ntooltap developer\ntooltap-dev@example.com\n\n\n"

ssl-files:
	@rm -rf ssl
	@mkdir  ssl

	@echo ----------------------------------------------------------
	@echo creating ssl/key.pem
	@echo ----------------------------------------------------------
	@openssl genrsa -out ssl/key.pem 1024

	@echo ""
	@echo ----------------------------------------------------------
	@echo creating transient ssl/certrequest.pem
	@echo ----------------------------------------------------------
	@echo $(OPENSSL_ARGS) | openssl req -new -key ssl/key.pem -out ssl/certrequest.csr

	@echo ""
	@echo ----------------------------------------------------------
	@echo creating ssl/cert.pem
	@echo ----------------------------------------------------------
	@openssl x509 -days 365 -req -in ssl/certrequest.csr -signkey ssl/key.pem -out ssl/cert.pem

	@rm ssl/certrequest.csr

	@echo ""
	@echo ----------------------------------------------------------
	@echo ssl/config.json
	@echo ----------------------------------------------------------
	@echo "{"	                    > ssl/config.json
	@echo "\"key\":  \"key.pem\"," >> ssl/config.json
	@echo "\"cert\": \"cert.pem\"" >> ssl/config.json
	@echo "}"	                   >> ssl/config.json

#-------------------------------------------------------------------------------
help:
	@echo "This Makefile supports the following targets:"
	@echo "   watch       -  run the server under node-supervisor watching lib"
	@echo "   vendor      -  get the vendor files"
	@echo "   ssl-files   -  create demo ssl files"

#-------------------------------------------------------------------------------
# Copyright (c) 2012 Patrick Mueller
#
# Tumbolia Public License
#
# Copying and distribution of this file, with or without modification, are
# permitted in any medium without royalty provided the copyright notice and
# this notice are preserved.
#
# TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
#
#   0. opan saurce LOL
#-------------------------------------------------------------------------------
