#!/bin/bash

# Browser OS Smooth Transition Script
# This script ensures a seamless transition from Plymouth to Firefox

set -e

# Function to log without showing on console
log_silent() {
    echo "$(date): $1" >> /var/log/smooth-transition.log 2>/dev/null || true
}

log_silent "Starting smooth transition process"

# Wait for system to fully initialize
sleep 1

# Disable console cursor and messages
echo 0 > /sys/class/graphics/fbcon/cursor_blink 2>/dev/null || true
printf '\033[?25l' > /dev/tty1 2>/dev/null || true  # Hide cursor
printf '\033[2J\033[H' > /dev/tty1 2>/dev/null || true  # Clear screen

# Set all TTYs to blank
for tty in /dev/tty{1..6}; do
    printf '\033[?25l\033[2J\033[H' > "$tty" 2>/dev/null || true
done

log_silent "Console prepared, starting user session"

# Ensure BROWSER_OS user environment is ready
if ! id BROWSER_OS >/dev/null 2>&1; then
    log_silent "ERROR: BROWSER_OS user not found"
    exit 1
fi

# Set up environment for BROWSER_OS user
export HOME=/home/BROWSER_OS
export USER=BROWSER_OS
export XDG_RUNTIME_DIR="/run/user/$(id -u BROWSER_OS)"

# Ensure XDG runtime directory exists
mkdir -p "$XDG_RUNTIME_DIR" 2>/dev/null || true
chown BROWSER_OS:BROWSER_OS "$XDG_RUNTIME_DIR" 2>/dev/null || true
chmod 700 "$XDG_RUNTIME_DIR" 2>/dev/null || true

log_silent "Starting Sway for BROWSER_OS user"

# Start Sway as BROWSER_OS user with all output suppressed
runuser -l BROWSER_OS -c 'export XDG_RUNTIME_DIR="/run/user/$(id -u)" && exec sway' >/dev/null 2>&1 &

# Give Sway time to initialize
sleep 4

log_silent "Quitting Plymouth"

# Check if Plymouth is running before attempting to quit
if pgrep -x "plymouth" >/dev/null 2>&1; then
    # Smoothly quit Plymouth
    systemctl stop plymouth-quit.service >/dev/null 2>&1 || true
    plymouth quit --retain-splash >/dev/null 2>&1 || true
    
    # Wait a moment for Plymouth to fully exit
    sleep 1
    
    # Force quit if still running
    if pgrep -x "plymouth" >/dev/null 2>&1; then
        plymouth quit >/dev/null 2>&1 || true
        killall plymouth >/dev/null 2>&1 || true
    fi
else
    log_silent "Plymouth not running, skipping quit"
fi

# Final screen clear
for tty in /dev/tty{1..6}; do
    printf '\033[?25l\033[2J\033[H' > "$tty" 2>/dev/null || true
done

log_silent "Smooth transition completed successfully"

exit 0
