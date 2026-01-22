#!/bin/bash

# Browser OS Smooth Transition Script
# This script ensures a seamless transition from Plymouth to Firefox

set -e

# Enable debug mode if requested
if [ "${DEBUG_TRANSITION:-0}" = "1" ]; then
    set -x
    exec > >(tee -a /var/log/smooth-transition-debug.log) 2>&1
fi

# Function to log with timestamps
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S'): $1" | tee -a /var/log/smooth-transition.log >/dev/null 2>&1 || true
}

# Function to handle errors
handle_error() {
    log "ERROR: $1"
    # Fallback: try to start a basic login on tty1
    systemctl start getty@tty1.service || true
    exit 1
}

# Set error trap
trap 'handle_error "Script failed at line $LINENO"' ERR

log "Starting smooth transition process"

# Wait for system to stabilize
sleep 2

# Check for required components
log "Checking system requirements..."

if ! command -v sway >/dev/null 2>&1; then
    handle_error "Sway not found in system"
fi

if ! command -v firefox >/dev/null 2>&1; then
    handle_error "Firefox not found in system"
fi

# Ensure BROWSER_OS user exists
if ! id BROWSER_OS >/dev/null 2>&1; then
    handle_error "BROWSER_OS user not found"
fi

# Get user ID
BROWSER_OS_UID=$(id -u BROWSER_OS)
XDG_RUNTIME_DIR="/run/user/$BROWSER_OS_UID"

log "Setting up environment for BROWSER_OS user (UID: $BROWSER_OS_UID)"

# Ensure XDG runtime directory exists with proper permissions
mkdir -p "$XDG_RUNTIME_DIR"
chown BROWSER_OS:BROWSER_OS "$XDG_RUNTIME_DIR"
chmod 700 "$XDG_RUNTIME_DIR"

# Set up environment variables for the session
export XDG_RUNTIME_DIR="$XDG_RUNTIME_DIR"

# Create a proper session for the user
loginctl enable-linger BROWSER_OS || true

# Gracefully quit Plymouth if it's running
if pgrep -x "plymouth" >/dev/null 2>&1; then
    log "Gracefully stopping Plymouth"
    plymouth quit --retain-splash >/dev/null 2>&1 || true
    sleep 1
    
    # Force quit if still running
    if pgrep -x "plymouth" >/dev/null 2>&1; then
        log "Force stopping Plymouth"
        plymouth quit >/dev/null 2>&1 || true
        killall plymouth >/dev/null 2>&1 || true
    fi
    sleep 1
fi

log "Preparing display environment"

# Clear and prepare TTY1 for Sway
{
    printf '\033[?25l'     # Hide cursor
    printf '\033[2J'       # Clear screen
    printf '\033[H'        # Move cursor to home
} > /dev/tty1 2>/dev/null || true

# Start Sway as BROWSER_OS user with proper environment
log "Starting Sway window manager"

# Detect if we're in a VM and set appropriate rendering
if systemd-detect-virt -q || grep -q "QEMU\|VirtualBox\|VMware" /proc/cpuinfo 2>/dev/null; then
    log "VM environment detected, using software rendering"
    WLR_RENDERER="pixman"
    WLR_BACKENDS="drm,libinput"
else
    log "Physical hardware detected"
    WLR_RENDERER="auto"
    WLR_BACKENDS="drm,libinput"
fi

# Ensure DRM device exists
if [ ! -e /dev/dri/card0 ]; then
    log "WARNING: No DRM device found, trying to load modules"
    modprobe -a drm bochs virtio-gpu qxl >/dev/null 2>&1 || true
    sleep 1
fi

# Use systemd-run to start Sway with proper session management
systemd-run --uid=BROWSER_OS --gid=BROWSER_OS \
    --setenv=XDG_RUNTIME_DIR="$XDG_RUNTIME_DIR" \
    --setenv=HOME=/home/BROWSER_OS \
    --setenv=USER=BROWSER_OS \
    --setenv=WLR_NO_HARDWARE_CURSORS=1 \
    --setenv=WLR_RENDERER="$WLR_RENDERER" \
    --setenv=WLR_BACKENDS="$WLR_BACKENDS" \
    --service-type=notify \
    --slice=user-$BROWSER_OS_UID.slice \
    --unit=sway-session \
    sway >/dev/null 2>&1 &

# Wait for Sway to initialize
log "Waiting for Sway to start..."
SWAY_TIMEOUT=15
SWAY_COUNT=0
while [ $SWAY_COUNT -lt $SWAY_TIMEOUT ]; do
    if pgrep -x sway >/dev/null 2>&1; then
        log "Sway is running"
        break
    fi
    sleep 1
    SWAY_COUNT=$((SWAY_COUNT + 1))
done

if [ $SWAY_COUNT -eq $SWAY_TIMEOUT ]; then
    log "WARNING: Sway did not start within timeout"
else
    log "Sway started successfully"
fi

# Give the system a moment to settle
sleep 2

# Final cleanup of other TTYs
for tty in /dev/tty{2..6}; do
    {
        printf '\033[?25l'
        printf '\033[2J'
        printf '\033[H'
    } > "$tty" 2>/dev/null || true
done

log "Smooth transition completed successfully"

exit 0
