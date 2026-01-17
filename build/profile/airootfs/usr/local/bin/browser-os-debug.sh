#!/bin/bash

# Browser OS Debug Script
# This script helps diagnose boot and transition issues

echo "=== Browser OS Debug Information ==="
echo "Date: $(date)"
echo "Uptime: $(uptime)"
echo ""

echo "=== System Information ==="
echo "Kernel: $(uname -r)"
echo "Architecture: $(uname -m)"
echo "Distribution: $(cat /etc/os-release | grep PRETTY_NAME)"
echo ""

echo "=== User Information ==="
echo "Current user: $(whoami)"
echo "Current TTY: $(tty)"
echo "BROWSER_OS user exists: $(id BROWSER_OS >/dev/null 2>&1 && echo "YES" || echo "NO")"
if id BROWSER_OS >/dev/null 2>&1; then
    echo "BROWSER_OS UID: $(id -u BROWSER_OS)"
    echo "BROWSER_OS GID: $(id -g BROWSER_OS)"
    echo "BROWSER_OS groups: $(groups BROWSER_OS)"
fi
echo ""

echo "=== Environment ==="
echo "XDG_RUNTIME_DIR: ${XDG_RUNTIME_DIR:-not set}"
echo "DISPLAY: ${DISPLAY:-not set}"
echo "WAYLAND_DISPLAY: ${WAYLAND_DISPLAY:-not set}"
echo ""

echo "=== Running Processes ==="
echo "Plymouth: $(pgrep -x plymouth >/dev/null 2>&1 && echo "RUNNING" || echo "not running")"
echo "Sway: $(pgrep -x sway >/dev/null 2>&1 && echo "RUNNING" || echo "not running")"
echo "Firefox: $(pgrep -x firefox >/dev/null 2>&1 && echo "RUNNING" || echo "not running")"
echo ""

echo "=== Service Status ==="
echo "smooth-transition.service: $(systemctl is-active smooth-transition.service 2>/dev/null || echo "unknown")"
echo "getty@tty1.service: $(systemctl is-active getty@tty1.service 2>/dev/null || echo "unknown")"
echo "graphical.target: $(systemctl is-active graphical.target 2>/dev/null || echo "unknown")"
echo ""

echo "=== Log Files ==="
if [ -f /var/log/smooth-transition.log ]; then
    echo "--- Smooth Transition Log (last 10 lines) ---"
    tail -n 10 /var/log/smooth-transition.log
    echo ""
fi

if [ -f /var/log/smooth-transition-debug.log ]; then
    echo "--- Debug Log (last 10 lines) ---"
    tail -n 10 /var/log/smooth-transition-debug.log
    echo ""
fi

echo "=== Journal Entries (last 20 lines) ==="
journalctl --no-pager -n 20 -u smooth-transition.service 2>/dev/null || echo "No journal entries found"
echo ""

echo "=== Network Status ==="
echo "Interfaces: $(ip -o link show | awk -F': ' '{print $2}' | tr '\n' ' ')"
echo "Default route: $(ip route show default 2>/dev/null | head -n1)"
echo ""

echo "=== Display Information ==="
if [ -d /sys/class/drm ]; then
    echo "DRM devices:"
    ls -la /sys/class/drm/ | grep card
fi
echo ""

echo "=== Debug Complete ==="
