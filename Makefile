# Licensed under the Tumbolia Public License. See footer for details.

.PHONY: vendor watch help static-demo

#-------------------------------------------------------------------------------
main: help

#-------------------------------------------------------------------------------
watch:
	node_modules/.bin/node-supervisor -w lib -n error -- lib/tooltapd.js --verbose

#-------------------------------------------------------------------------------

VERSION_JQUERY     = 1.8.2
VERSION_JQUERYUI   = 1.9.0
VERSION_NODEWEBKIT = 0.3.3

URL_JQUERY_MIN = http://code.jquery.com/jquery-$(VERSION_JQUERY).min.js
URL_JQUERY     = http://code.jquery.com/jquery-$(VERSION_JQUERY).js
URL_D3_MIN     = http://d3js.org/d3.v2.min.js
URL_D3         = http://d3js.org/d3.v2.js
URL_JQUERYUI   = http://jqueryui.com/resources/download/jquery-ui-$(VERSION_JQUERYUI).custom.zip
URL_NODEWEBKIT = http://s3.amazonaws.com/node-webkit/v$(VERSION_NODEWEBKIT)/node-webkit-v$(VERSION_NODEWEBKIT)

UNP_JQUERYUI   = tmp/jquery-ui-$(VERSION_JQUERYUI).custom

#-------------------------------------------------------------------------------
vendor:
	@npm install

	@rm -rf vendor
	@mkdir  vendor

	@rm -rf tmp
	@mkdir  tmp

	curl --output vendor/jquery.min.js        --progress-bar $(URL_JQUERY_MIN)
	curl --output vendor/jquery.js            --progress-bar $(URL_JQUERY)
	curl --output vendor/d3.v2.min.js         --progress-bar $(URL_D3_MIN)
	curl --output vendor/d3.v2.js             --progress-bar $(URL_D3)
	curl --output vendor/nw-osx-ia32.zip      --progress-bar $(URL_NODEWEBKIT)-osx-ia32.zip
#	curl --output vendor/nw-win-ia32.zip      --progress-bat $(URL_NODEWEBKIT)-win-ia32.zip
#	curl --output vendor/nw-linux-ia32.tar.gz --progress-bat $(URL_NODEWEBKIT)-linux-ia32.tar.gz
#	curl --output vendor/nw-linux-x64.tar.gz  --progress-bat $(URL_NODEWEBKIT)-linux-x64.tar.gz

	curl --output tmp/jquery-ui.zip           --progress-bar $(URL_JQUERYUI)

	@mkdir -p vendor/jquery-ui/themes/smoothness/images

	@unzip -q tmp/jquery-ui.zip -d tmp
	@cp $(UNP_JQUERYUI)/js/jquery-ui-$(VERSION_JQUERYUI).custom.js                  vendor/jquery-ui/jquery-ui.js
	@cp $(UNP_JQUERYUI)/js/jquery-ui-$(VERSION_JQUERYUI).custom.min.js              vendor/jquery-ui/jquery-ui.min.js
	@cp $(UNP_JQUERYUI)/css/smoothness/jquery-ui-$(VERSION_JQUERYUI).custom.css     vendor/jquery-ui/themes/smoothness/jquery-ui.css
	@cp $(UNP_JQUERYUI)/css/smoothness/jquery-ui-$(VERSION_JQUERYUI).custom.min.css vendor/jquery-ui/themes/smoothness/jquery-ui.min.css
	@cp $(UNP_JQUERYUI)/css/smoothness/images/*                                     vendor/jquery-ui/themes/smoothness/images


#-------------------------------------------------------------------------------
build-app-osx-ia32:
	rm -rf tmp/*
	unzip -q vendor/nw-osx-ia32.zip -d tmp

	@rm -rf  build/osx-ia32
	mkdir -p build/osx-ia32/tooltap.app

	cp -R tmp/node-webkit.app/*      build/osx-ia32/tooltap.app
	cp -R app/osx-ia32/tooltap.app/* build/osx-ia32/tooltap.app

	iconutil --convert icns \
		--output build/osx-ia32/tooltap.app/Contents/Resources/tooltap.icns \
		         build/osx-ia32/tooltap.app/Contents/Resources/icns.iconset

	rm -rf build/osx-ia32/tooltap.app/Contents/Resources/icns.iconset
	rm -rf build/osx-ia32/tooltap.app/Contents/Resources/app.icns
	mv build/osx-ia32/tooltap.app/Contents/MacOS/node-webkit \
	   build/osx-ia32/tooltap.app/Contents/MacOS/tooltap

#-------------------------------------------------------------------------------
OPENSSL_ARGS = "US\nNorth Carolina\nApex\nexample.org\ntooltap development\ntooltap developer\ntooltap-dev@example.com\n\n\n"

ssl-files:
	@rm -rf data-dir-template/ssl
	@mkdir  data-dir-template/ssl

	@echo ----------------------------------------------------------
	@echo creating data-dir-template/ssl/key.pem
	@echo ----------------------------------------------------------
	@openssl genrsa \
		-out data-dir-template/ssl/tooltap-key.pem 1024

	@echo ""
	@echo ----------------------------------------------------------
	@echo creating transient data-dir-template/ssl/certrequest.pem
	@echo ----------------------------------------------------------
	@echo $(OPENSSL_ARGS) | \
		openssl req -new \
			-key data-dir-template/ssl/tooltap-key.pem \
			-out data-dir-template/ssl/tooltap-certrequest.csr

	@echo ""
	@echo ----------------------------------------------------------
	@echo creating data-dir-template/ssl/cert.pem
	@echo ----------------------------------------------------------
	@openssl x509 -days 365 -req \
		-in      data-dir-template/ssl/tooltap-certrequest.csr \
		-signkey data-dir-template/ssl/tooltap-key.pem \
		-out     data-dir-template/ssl/tooltap-cert.pem

	@rm data-dir-template/ssl/tooltap-certrequest.csr

#-------------------------------------------------------------------------------
help:
	@echo "This Makefile supports the following targets:"
	@echo "   watch              -  run the server under node-supervisor watching lib"
	@echo "   vendor             -  get the vendor files"
	@echo "   ssl-files          -  create demo ssl files"
	@echo "   build-app-osx-ia32 -  create demo ssl files"

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
