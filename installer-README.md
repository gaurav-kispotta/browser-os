# Browser OS Dialog Installer

This directory contains the Browser OS dialog-based installer components.

## Files

- `browser-os-installer` - Main dialog-based installer script
- `test-installer` - Simple test launcher for manual testing

## Installation Options

When you boot the Browser OS ISO, you'll see a boot menu with the following options:

1. **Browser OS (Live Mode)** - Boot into live mode without installing
2. **Install Browser OS** - Launch the dialog-based installer

## Installer Features

The dialog-based installer provides a user-friendly text interface with the following features:

- **Disk Selection**: Choose from available disks with size and model information
- **System Configuration**: Configure hostname, username, password, timezone, locale, and keymap
- **Progress Tracking**: Visual progress indicators during installation
- **Error Handling**: Clear error messages and graceful error handling
- **UEFI/BIOS Support**: Automatic detection and appropriate bootloader installation

## Default Configuration

The installer uses the following default values:

- **Hostname**: browser-os
- **Username**: BROWSER_OS
- **Password**: BROWSER_OS
- **Timezone**: UTC
- **Locale**: en_US.UTF-8
- **Keymap**: us

## Manual Testing

You can test the installer manually in live mode by running:

```bash
sudo test-installer
```

Or directly:

```bash
sudo browser-os-installer
```

## Requirements

The installer automatically installs any missing required tools:

- parted (disk partitioning)
- dosfstools (FAT filesystem)
- e2fsprogs (ext4 filesystem)
- rsync (file copying)
- arch-install-scripts (chroot tools)
- grub (bootloader)
- efibootmgr (EFI management)

## Installation Process

1. Welcome screen with configuration overview
2. Disk selection with confirmation
3. System configuration (optional customization)
4. Automatic partitioning (EFI + root partition)
5. System installation with progress tracking
6. Bootloader installation and configuration
7. Final system setup and completion

## Post-Installation

After successful installation:

- Remove the installation media
- Reboot the system
- Browser OS will boot automatically into kiosk mode
- Default login credentials are as configured during installation