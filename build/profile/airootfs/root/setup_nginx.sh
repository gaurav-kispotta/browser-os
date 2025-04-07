#!/bin/bash
ln -sf /etc/nginx/sites-available/kiosk.conf /etc/nginx/sites-enabled/
systemctl enable nginx
