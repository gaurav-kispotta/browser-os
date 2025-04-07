# Easy Kiosk - Custom Arch Linux OS

A customized Arch Linux distribution designed for kiosk applications with custom branding.

## Overview

This project creates a minimal, secure Arch Linux-based operating system tailored for kiosk displays. It features:

- Automatic boot to a fullscreen browser application
- Custom branding and splash screens
- Locked-down environment with restricted user access
- Optimized for performance and reliability

## Project Structure

- `branding/` - Logo and branding assets
- `build/` - Build artifacts and temporary files
- `config/` - System configuration files
- `output/` - Final ISO output directory
- `scripts/` - Build and customization scripts

## Getting Started

### Prerequisites

- Arch Linux host system (recommended) or any Linux with `archiso`
- Required packages: `archiso`, `cdrtools`, `squashfs-tools`, `git`

### Building the ISO

```bash
# Install dependencies
sudo pacman -S archiso cdrtools squashfs-tools git

# Run the build script
./scripts/build.sh
```

The final ISO will be generated in the `output/` directory.

## Customization

Edit the configuration files in the `config/` directory to customize:

- Installed packages
- System settings
- Kiosk browser application
- Autologin and autostart behavior

## License

MIT 