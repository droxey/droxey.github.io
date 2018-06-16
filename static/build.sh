#!/bin/bash

rm -rf dist/
mkdir dist
echo "[BUILD] Distribution folder reset."

uglifyjs --compress -o dist/site.min.js -- static/js/jquery.address-1.5.min.js static/js/antiscroll.jsstatic/js/jquery.fittext.js static/js/jquery.imagesloaded.min.js static/js/jquery.validate.min.js static/
js/moment.min.js static/js/twitterFetcher_v10_min.js static/js/main.js static/js/custom.js
echo "[BUILD] JS minified."

