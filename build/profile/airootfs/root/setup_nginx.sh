#!/bin/bash
ln -sf /etc/nginx/sites-available/BROWSER_OS.conf /etc/nginx/sites-enabled/
systemctl enable nginx
