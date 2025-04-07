#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$PROJECT_DIR/build"
OUTPUT_DIR="$PROJECT_DIR/output"
CONFIG_DIR="$PROJECT_DIR/config"
WORK_DIR="$BUILD_DIR/work"
PROFILE_DIR="$BUILD_DIR/profile"
ISO_NAME="easy-kiosk"
ISO_LABEL="EASY_KIOSK"
ISO_VERSION=$(date +%Y.%m.%d)
ISO_FILENAME="${ISO_NAME}-${ISO_VERSION}-x86_64.iso"
ARCHISO_PROFILE="releng"

# Function to setup the build profile
setup_profile() {
    echo "Setting up build profile..."
    
    # Create required directories
    mkdir -p "$BUILD_DIR" "$OUTPUT_DIR" "$WORK_DIR" "$PROFILE_DIR"

    # Enable necessary services
    mkdir -p "$PROFILE_DIR/airootfs/etc/systemd/system/multi-user.target.wants"
    ln -sf "/usr/lib/systemd/system/systemd-networkd.service" "$PROFILE_DIR/airootfs/etc/systemd/system/multi-user.target.wants/"
    ln -sf "/usr/lib/systemd/system/systemd-resolved.service" "$PROFILE_DIR/airootfs/etc/systemd/system/multi-user.target.wants/"

    # Create a basic system configuration
    mkdir -p "$PROFILE_DIR/airootfs/etc"
    cat > "$PROFILE_DIR/airootfs/etc/os-release" << EOF
NAME="Easy Kiosk"
PRETTY_NAME="Easy Kiosk"
ID=easy-kiosk
BUILD_ID=${ISO_VERSION}
ANSI_COLOR="0;36"
HOME_URL="https://example.com"
EOF

    echo "Build profile setup complete!"
}

# Function to build the ISO
build_iso() {
    echo "Building ISO..."
    
    # Check for root privileges
    if [ "$EUID" -ne 0 ]; then
      echo "Please run as root"
      exit 1
    fi

    # Check for required commands
    for cmd in mkarchiso mksquashfs; do
      if ! command -v $cmd &> /dev/null; then
        echo "Error: Required command '$cmd' not found. Please install 'archiso' and 'squashfs-tools' packages."
        exit 1
      fi
    done
    
    # Clean work directory to ensure fresh build
    rm -rf "$WORK_DIR"
    mkdir -p "$WORK_DIR"

    # Set explicit SquashFS options
    export ARCHISO_SQUASHFS_COMP_OPTS="-b 1M -comp xz -Xbcj x86"
    export ARCHISO_SQUASHFS_COMP_TYPE="xz"
    
    # Build the ISO
    cd "$PROJECT_DIR"
    mkdir -p "$OUTPUT_DIR"
    mkarchiso -v -w "$WORK_DIR" -o "$OUTPUT_DIR" "$PROFILE_DIR"

    echo "Build complete!"
    echo "ISO available at: $OUTPUT_DIR/$ISO_FILENAME"
}

# Main execution
case "$1" in
    setup)
        setup_profile
        ;;
    build)
        build_iso
        ;;
    *)
        # If no arguments provided, do both
        setup_profile
        build_iso
        ;;
esac 