# Browser OS - Minimal Arch Linux for Browsing

A minimal Arch Linux distribution designed to boot directly into Mozilla Browser and nothing else.

## Overview

Browser OS is a lightweight, secure operating system tailored for single-purpose browsing environments. It features:

- Automatic boot into Mozilla Browser in fullscreen mode
- Minimal system footprint for fast boot times
- Locked-down environment with no additional applications or user access
- Optimized for simplicity and reliability

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

- Installed packages (e.g., Mozilla Browser)
- System settings
- Autologin and fullscreen browser behavior

## License

MIT