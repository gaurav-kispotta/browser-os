if [ -z "$DISPLAY" ] && [ "$(tty)" = "/dev/tty1" ]; then
    # Show prompt for F10
    echo "Press F10 within 3 seconds to enter root shell..."
    
    # Read a single keypress with a timeout
    read -r -s -n 5 -t 3 key
    
    # Check if F10 was pressed
    if [ "$key" = $'\e[[21~' ] || [ "$key" = $'\e[21~' ]; then
        echo "Entering root shell..."
        exec sudo -i
        exit 0
    fi

    # If F10 was not pressed, continue with normal startup
    echo "Starting Browser OS..."
    
    # Set up environment for Wayland
    export XDG_RUNTIME_DIR="/run/user/$(id -u)"
    export WLR_NO_HARDWARE_CURSORS=1
    export WLR_BACKENDS=drm,libinput
    
    # Make the welcome script executable and execute it
    chmod +x ~/.welcome.sh
    ~/.welcome.sh
    
    # Start Sway if not already running
    if ! pgrep -x sway >/dev/null 2>&1; then
        exec sway
    fi
fi
