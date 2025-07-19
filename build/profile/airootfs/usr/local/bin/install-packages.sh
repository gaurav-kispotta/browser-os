#!/bin/bash

# Browser OS Package Installation Script
# This script handles package installation with better error handling

set -e

echo "==> Updating package databases and mirrors..."

# Update archlinux-keyring first to avoid key issues
pacman -Sy --noconfirm archlinux-keyring || {
    echo "Warning: Failed to update keyring, continuing..."
}

# Initialize and populate pacman keyring
pacman-key --init
pacman-key --populate archlinux

# Update package databases
pacman -Sy --noconfirm

# Install packages with retry mechanism
install_with_retry() {
    local max_attempts=3
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        echo "==> Installation attempt $attempt of $max_attempts"
        
        if pacman -S --noconfirm --needed "$@"; then
            echo "==> Installation successful"
            return 0
        else
            echo "==> Installation attempt $attempt failed"
            if [ $attempt -lt $max_attempts ]; then
                echo "==> Retrying in 5 seconds..."
                sleep 5
                # Update package database again
                pacman -Sy --noconfirm
            fi
            ((attempt++))
        fi
    done
    
    echo "==> All installation attempts failed"
    return 1
}

echo "==> Installing Browser OS packages..."
install_with_retry $(cat /etc/archiso/packages.x86_64 | grep -v '^#' | grep -v '^$')
