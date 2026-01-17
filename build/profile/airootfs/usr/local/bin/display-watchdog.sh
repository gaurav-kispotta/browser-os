#!/bin/bash

# Browser OS Display Watchdog
# Monitors the display session and restarts if necessary

log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S'): $1" | tee -a /var/log/display-watchdog.log >/dev/null 2>&1 || true
}

log "Display watchdog started"

while true; do
    sleep 10
    
    # Check if Sway is running
    if ! pgrep -x sway >/dev/null 2>&1; then
        log "Sway not running, attempting restart..."
        
        # Try to restart the smooth transition
        systemctl restart smooth-transition.service || true
        sleep 5
        
        # If still not running, start manually
        if ! pgrep -x sway >/dev/null 2>&1; then
            log "Manual Sway restart..."
            runuser -l BROWSER_OS -c 'XDG_RUNTIME_DIR="/run/user/$(id -u)" sway' >/dev/null 2>&1 &
        fi
    fi
    
    # Check if Firefox is running
    if pgrep -x sway >/dev/null 2>&1 && ! pgrep -x firefox >/dev/null 2>&1; then
        log "Firefox not running, starting..."
        runuser -l BROWSER_OS -c 'firefox --kiosk --profile ~/.mozilla/browserOs http://localhost:3000' >/dev/null 2>&1 &
    fi
done
