#!/bin/bash
#
# Browser OS Installer Test Script
# Tests the dialog installer without actually installing anything
#

set -e

echo "=== Browser OS Installer Test ==="
echo "Testing installer components..."
echo

# Test 1: Check if dialog package would be available
echo "Test 1: Checking dialog availability..."
if command -v dialog >/dev/null 2>&1; then
    echo "✓ dialog command found"
else
    echo "⚠ dialog command not found (this is expected in build environment)"
    echo "  The installer will install dialog automatically when needed"
fi
echo

# Test 2: Check installer script syntax
echo "Test 2: Checking installer script syntax..."
if bash -n /home/runner/work/browser-os/browser-os/build/profile/airootfs/usr/local/bin/browser-os-installer; then
    echo "✓ Installer script syntax is valid"
else
    echo "✗ Installer script has syntax errors"
    exit 1
fi
echo

# Test 3: Check file permissions in profiledef.sh
echo "Test 3: Checking file permissions configuration..."
if grep -q "browser-os-installer" /home/runner/work/browser-os/browser-os/build/profile/profiledef.sh; then
    echo "✓ Installer permissions configured in profiledef.sh"
else
    echo "✗ Installer permissions not found in profiledef.sh"
    exit 1
fi
echo

# Test 4: Check boot menu configurations
echo "Test 4: Checking boot menu configurations..."
if grep -q "Install Browser OS" /home/runner/work/browser-os/browser-os/build/profile/grub/grub.cfg; then
    echo "✓ GRUB boot menu includes installer option"
else
    echo "✗ GRUB boot menu missing installer option"
    exit 1
fi

if grep -q "Install Browser OS" /home/runner/work/browser-os/browser-os/build/profile/syslinux/archiso_sys-linux.cfg; then
    echo "✓ SYSLINUX boot menu includes installer option"
else
    echo "✗ SYSLINUX boot menu missing installer option"
    exit 1
fi
echo

# Test 5: Check automated script integration
echo "Test 5: Checking automated script integration..."
if grep -q "browser-os-installer" /home/runner/work/browser-os/browser-os/build/profile/airootfs/root/.automated_script.sh; then
    echo "✓ Automated script handles installer execution"
else
    echo "✗ Automated script missing installer handling"
    exit 1
fi
echo

# Test 6: Check package list includes dialog
echo "Test 6: Checking package list..."
if grep -q "^dialog$" /home/runner/work/browser-os/browser-os/build/profile/packages.x86_64; then
    echo "✓ dialog package included in package list"
else
    echo "✗ dialog package missing from package list"
    exit 1
fi
echo

echo "=== All Tests Passed! ==="
echo
echo "The Browser OS installer has been successfully integrated."
echo "When you build the ISO, users will see:"
echo "1. Browser OS (Live Mode) - for trying without installing"
echo "2. Install Browser OS - launches the dialog-based installer"
echo
echo "The installer provides:"
echo "• User-friendly dialog interface"
echo "• Guided disk selection"
echo "• System configuration"
echo "• Progress tracking"
echo "• Automatic partitioning and installation"
echo "• Error handling"
echo
echo "To build the ISO with the new installer, run:"
echo "sudo ./build-browser-os.sh"