#!/bin/bash

# Colors for the message
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Clear the screen
clear

# Display welcome message
echo -e "${GREEN}========================================${NC}"
echo -e "${BLUE}Welcome to Easy Kiosk!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "\nStarting your kiosk session..."
echo -e "Please wait while we initialize the system...\n"

# Add a small delay to make the message visible
sleep 2

# Start sway
exec sway