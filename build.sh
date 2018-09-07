#!/bin/bash

echo "[BUILD] Removing old minified files..."
rm static/js/site.min.js
rm static/css/site.min.css
echo "[BUILD] Removed old minified CSS and JS."

echo "[BUILD] JS minifying..."
uglifyjs --compress -o static/js/site.min.js -- static/js/jquery.address-1.5.min.js static/js/antiscroll.js static/js/jquery.fittext.js static/js/jquery.imagesloaded.min.js static/js/jquery.validate.min.js static/js/moment.min.js static/js/main.js static/js/custom.js
echo "[BUILD] JS minified."

echo "[BUILD] CSS minifying..."
uglifycss --output static/css/site.min.css static/css/normalize.css static/css/bootstrap.min.css static/css/animate.css static/css/book.css static/css/main.css static/css/style.css
echo "[BUILD] CSS minified."
