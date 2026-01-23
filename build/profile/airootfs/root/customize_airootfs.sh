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
# chmod +x /usr/local/bin/smooth-transition.sh

# Enable the smooth transition service
# systemctl enable smooth-transition.service

# Disable unnecessary services for smoother boot
systemctl disable systemd-resolved
systemctl disable systemd-networkd-wait-online

# Disable reflector (mirror updates) to speed up boot
systemctl disable reflector.service
systemctl disable reflector.timer

# Disable man-db cache update which spins disk on boot
systemctl mask man-db.timer
systemctl mask man-db.service

# Disable LVM/RAID monitoring if not using them
systemctl mask lvm2-monitor.service
systemctl mask lvm2-lvmetad.service
systemctl mask mdmonitor.service

# Disable bluetooth if not strictly needed immediately (often slow)
# systemctl disable bluetooth.service

# Mask plymouth-quit-wait as we manage it via smooth-transition
# systemctl mask plymouth-quit-wait.service

# Disable console messages
systemctl mask systemd-ask-password-console.path
systemctl mask systemd-ask-password-console.service
systemctl mask systemd-ask-password-wall.path
systemctl mask systemd-ask-password-wall.service

# Ensure silent boot
echo "kernel.printk = 0 0 0 0" >> /etc/sysctl.conf

# Enable lingering for BROWSER_OS user (allows user services to run without login)
mkdir -p /var/lib/systemd/linger
touch /var/lib/systemd/linger/BROWSER_OS

# Ensure BROWSER_OS user can access video and input devices
usermod -a -G video,input,audio BROWSER_OS || true

# Set proper permissions for runtime directory
mkdir -p /run/user/1000
chown 1000:1000 /run/user/1000
chmod 700 /run/user/1000

# Build Wireless Scanner App
if [ -d "/opt/wireless-scanner" ]; then
    echo "Building Wireless Scanner App..."
    cd /opt/wireless-scanner
    # npm install might fail if some packages need compilation and missing build tools
    # but we included 'base-devel' or similar? 'base' is in packages.
    # We should ensure we can build.
    npm install || echo "Warning: npm install failed"
    npm run build || echo "Warning: npm run build failed"
    
    # Prune dev dependencies to save space
    npm prune --production
fi

