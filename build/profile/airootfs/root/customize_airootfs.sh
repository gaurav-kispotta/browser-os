#!/usr/bin/env bash

set -e -u

echo "Running customize_airootfs.sh"

# Set timezone to UTC
ln -sf /usr/share/zoneinfo/UTC /etc/localtime
hwclock --systohc

# Set root password
echo "root:root" | chpasswd
# Set up the BROWSER_OS user
echo "BROWSER_OS:BROWSER_OS" | chpasswd

# Update the plymouth theme in plymouth.conf file
sed -i 's/Theme=.*/Theme=browser-os/g' /etc/plymouth/plymouthd.conf

# Update the plymouth theme in the default file
# This is needed for the live ISO
# because the default file is used to set the theme
# in the live environment
sed -i 's/Theme=.*/Theme=browser-os/g' /usr/share/plymouth/plymouthd.defaults

