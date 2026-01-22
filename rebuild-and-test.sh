#!/bin/bash

echo "=== Rebuilding Browser OS ISO ==="
sh run.sh

echo ""
echo "=== Build complete! ==="
echo ""
echo "To test the ISO, use:"
echo "  qemu-system-x86_64 -cdrom output/browser-os-*.iso -m 2048 -enable-kvm"
echo ""
echo "Or use the UTM/VMware/VirtualBox with the generated ISO"
