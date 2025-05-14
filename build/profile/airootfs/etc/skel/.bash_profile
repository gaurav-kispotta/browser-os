if [ -z "$DISPLAY" ] && [ "$(tty)" = "/dev/tty1" ]; then
    # Show prompt for F10
    echo "Press F10 within 3 seconds to enter root shell..."
    
    # Read a single keypress with a timeout
    read -r -s -n 5 -t 10 key
    
    # Check if F10 was pressed
    if [ "$key" = $'\e[[21~' ] || [ "$key" = $'\e[21~' ]; then
        echo "Entering root shell..."
        exec sudo -i
        exit 0
    fi

    # If F10 was not pressed, continue with normal startup
    # Make the welcome script executable
    chmod +x ~/.welcome.sh
    # Execute the welcome script
    ~/.welcome.sh
fi
