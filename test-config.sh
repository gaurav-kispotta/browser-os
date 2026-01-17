#!/bin/bash

# Browser OS Configuration Test
# This script verifies the configuration is correct

echo "=== Browser OS Configuration Test ==="

ERRORS=0

# Check required files exist
echo "Checking required files..."

REQUIRED_FILES=(
    "/Users/gauravkispotta/Documents/GrvKisLabs.nosync/GitHub/browser-os/build/profile/airootfs/usr/local/bin/smooth-transition.sh"
    "/Users/gauravkispotta/Documents/GrvKisLabs.nosync/GitHub/browser-os/build/profile/airootfs/usr/local/bin/browser-os-debug.sh"
    "/Users/gauravkispotta/Documents/GrvKisLabs.nosync/GitHub/browser-os/build/profile/airootfs/usr/local/bin/display-watchdog.sh"
    "/Users/gauravkispotta/Documents/GrvKisLabs.nosync/GitHub/browser-os/build/profile/airootfs/etc/systemd/system/smooth-transition.service"
    "/Users/gauravkispotta/Documents/GrvKisLabs.nosync/GitHub/browser-os/build/profile/airootfs/etc/systemd/system/display-watchdog.service"
    "/Users/gauravkispotta/Documents/GrvKisLabs.nosync/GitHub/browser-os/build/profile/airootfs/etc/skel/.config/sway/config"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file"
    else
        echo "✗ $file (missing)"
        ERRORS=$((ERRORS + 1))
    fi
done

# Check symbolic links
echo ""
echo "Checking service links..."

REQUIRED_LINKS=(
    "/Users/gauravkispotta/Documents/GrvKisLabs.nosync/GitHub/browser-os/build/profile/airootfs/etc/systemd/system/graphical.target.wants/smooth-transition.service"
    "/Users/gauravkispotta/Documents/GrvKisLabs.nosync/GitHub/browser-os/build/profile/airootfs/etc/systemd/system/graphical.target.wants/display-watchdog.service"
)

for link in "${REQUIRED_LINKS[@]}"; do
    if [ -L "$link" ]; then
        echo "✓ $link -> $(readlink "$link")"
    else
        echo "✗ $link (missing symlink)"
        ERRORS=$((ERRORS + 1))
    fi
done

# Check script syntax
echo ""
echo "Checking script syntax..."

bash -n "/Users/gauravkispotta/Documents/GrvKisLabs.nosync/GitHub/browser-os/build/profile/airootfs/usr/local/bin/smooth-transition.sh" && echo "✓ smooth-transition.sh syntax OK" || { echo "✗ smooth-transition.sh syntax error"; ERRORS=$((ERRORS + 1)); }

bash -n "/Users/gauravkispotta/Documents/GrvKisLabs.nosync/GitHub/browser-os/build/profile/airootfs/usr/local/bin/display-watchdog.sh" && echo "✓ display-watchdog.sh syntax OK" || { echo "✗ display-watchdog.sh syntax error"; ERRORS=$((ERRORS + 1)); }

bash -n "/Users/gauravkispotta/Documents/GrvKisLabs.nosync/GitHub/browser-os/build/profile/airootfs/usr/local/bin/browser-os-debug.sh" && echo "✓ browser-os-debug.sh syntax OK" || { echo "✗ browser-os-debug.sh syntax error"; ERRORS=$((ERRORS + 1)); }

echo ""
if [ $ERRORS -eq 0 ]; then
    echo "✓ All configuration checks passed!"
    echo ""
    echo "=== Next Steps ==="
    echo "1. Copy these changes to your Arch Linux build machine"
    echo "2. Build the ISO using: sudo ./build-browser-os.sh"
    echo "3. If you encounter a black screen, try the 'Debug Mode' boot option"
    echo "4. Use 'Emergency Shell' boot option if the system won't start"
    echo "5. In the emergency shell, run: /usr/local/bin/browser-os-debug.sh"
else
    echo "✗ $ERRORS configuration errors found!"
    exit 1
fi
