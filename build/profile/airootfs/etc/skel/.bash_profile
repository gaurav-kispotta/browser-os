if [ -z "$DISPLAY" ] && [ "$(tty)" = "/dev/tty1" ]; then
    # Make the welcome script executable
    chmod +x ~/.welcome.sh
    # Execute the welcome script
    ~/.welcome.sh
fi
