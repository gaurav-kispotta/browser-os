#!/bin/bash
set -e

echo "===== Browser OS Builder ====="
echo "This script will build a custom Arch Linux BROWSER_OS ISO."
echo

# Check for root privileges
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root"
  echo "Usage: sudo ./build-BROWSER_OS.sh"
  exit 1
fi

# Check for required packages
for pkg in archiso squashfs-tools xz plymouth; do
    if ! pacman -Q "$pkg" &>/dev/null; then
        echo "Installing required package: $pkg"
        pacman -S --noconfirm "$pkg"
    fi
done

# Setup directory structure
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR"
BUILD_DIR="$PROJECT_DIR/build"
WORK_DIR="$BUILD_DIR/work"

# Clean up previous build artifacts
echo "Cleaning up previous build artifacts..."
rm -rf "$BUILD_DIR/$PROJECT_DIR/output"
mkdir -p "$BUILD_DIR" "$PROJECT_DIR/output"

# Step 1: Run the main build script to setup the profile
echo "Step 1: Setting up build profile..."
"$PROJECT_DIR/scripts/build.sh" setup

# Step 2: Setup BROWSER_OS web app
echo "Step 2: Setting up BROWSER_OS web application..."
"$PROJECT_DIR/scripts/setup-BROWSER_OS-app.sh"

# Step 3: Setup Calamares
echo "Step 3: Setting up Calamares installer..."
mkdir -p "$BUILD_DIR/airootfs/etc/calamares"
cp -r "$PROJECT_DIR/config/calamares/"* "$BUILD_DIR/airootfs/etc/calamares/"

# Step 5: Verify SquashFS tools and settings
echo "Step 5: Verifying SquashFS configuration..."
if ! command -v mksquashfs >/dev/null 2>&1; then
    echo "Error: mksquashfs not found. Installing squashfs-tools..."
    pacman -S --noconfirm squashfs-tools
fi

# Set explicit SquashFS options for better compatibility
export ARCHISO_SQUASHFS_COMP_OPTS="-b 1M -comp xz -Xbcj x86"
export ARCHISO_SQUASHFS_COMP_TYPE="xz"

# Step 6: Build the final ISO
echo "Step 6: Building the ISO image..."
"$PROJECT_DIR/scripts/build.sh" build

# Step 7: Verify the built ISO
echo "Step 7: Verifying the built ISO..."
if [ -f "$PROJECT_DIR/output/"*.iso ]; then
    ISO_FILE=$(ls "$PROJECT_DIR/output/"*.iso | head -n1)
    echo "ISO file created successfully: $ISO_FILE"
    
    # Calculate and store checksums
    cd "$PROJECT_DIR/output"
    sha256sum "$(basename "$ISO_FILE")" > "$(basename "$ISO_FILE").sha256"
    echo "SHA256 checksum has been saved to: $(basename "$ISO_FILE").sha256"
else
    echo "Error: ISO file was not created successfully!"
    exit 1
fi

echo
echo "===== Build Complete ====="
echo "Your custom Browser OS ISO is available in the output/ directory."
echo "You can verify the ISO with: sha256sum -c output/*.iso.sha256"
echo
echo "To burn this ISO to a USB drive:"
echo "  sudo dd if=$ISO_FILE of=/dev/sdX bs=4M status=progress"
echo "  (Replace /dev/sdX with your USB device)"
echo
echo "Thank you for using Browser OS Builder!" 