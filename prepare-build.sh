#!/bin/bash

# Pre-build script to prepare for Browser OS build
# This script ensures we have good mirrors and up-to-date packages

set -e

echo "==> Preparing Browser OS build environment..."

# Update the host system's mirrorlist for better build performance
echo "==> Updating mirrorlist on host system..."
if command -v reflector >/dev/null 2>&1; then
    sudo reflector --protocol https \
                   --country "United States,Germany,France,United Kingdom,Netherlands,Canada" \
                   --latest 10 \
                   --fastest 5 \
                   --sort rate \
                   --save /etc/pacman.d/mirrorlist
    echo "==> Mirrorlist updated successfully"
else
    echo "==> reflector not found, using default mirrors"
fi

# Update package databases
echo "==> Updating package databases..."
sudo pacman -Sy

# Ensure archiso is up to date
echo "==> Updating archiso..."
sudo pacman -S --needed --noconfirm archiso

echo "==> Build environment ready!"
echo ""
echo "Now you can run the build script:"
echo "  sudo ./build-browser-os.sh"
