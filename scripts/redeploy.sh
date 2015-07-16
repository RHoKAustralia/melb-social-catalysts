#!/bin/bash
# Deploy from GitHub repository
cd /var/www/ghost
git pull
chown -R ghost:ghost *
chown ghost:ghost /var/www/melb-social-catalysts/tags.js
cd /var/www/melb-social-catalysts
NODE_ENV=production node tags.js
service ghost restart
