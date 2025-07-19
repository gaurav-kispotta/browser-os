#!/usr/bin/env bash

set -e -u

echo "Running customize_airootfs.sh"

# Update package databases and keys first
echo "==> Updating package databases and keyring..."
pacman-key --init
pacman-key --populate archlinux
pacman -Sy --noconfirm

# Update mirrors for better connectivity
echo "==> Updating mirror list..."
if command -v reflector >/dev/null 2>&1; then
    reflector --protocol https --country "United States,Germany,France,United Kingdom,Netherlands,Canada" --latest 10 --fastest 5 --sort rate --save /etc/pacman.d/mirrorlist
fi

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

# Make the smooth transition script executable
chmod +x /usr/local/bin/smooth-transition.sh

# Enable the smooth transition service
systemctl enable smooth-transition.service

# Disable unnecessary services for smoother boot
systemctl disable systemd-resolved
systemctl disable systemd-networkd-wait-online

# Disable console messages
systemctl mask systemd-ask-password-console.path
systemctl mask systemd-ask-password-console.service
systemctl mask systemd-ask-password-wall.path
systemctl mask systemd-ask-password-wall.service

# Ensure silent boot
echo "kernel.printk = 0 0 0 0" >> /etc/sysctl.conf

