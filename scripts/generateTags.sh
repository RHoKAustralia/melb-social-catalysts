#!/bin/sh
cd /var/www/melb-social-catalysts
NODE_END=production /usr/local/bin/node tags.js
NODE_END=production /usr/local/bin/node authors.js
