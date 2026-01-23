#!/bin/bash
CONTAINER_NAME="browser-os-build"

# Check if container is running
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "Found running container: $CONTAINER_NAME"
    echo "Syncing files to container..."
    
    # Copy current directory to workspace inside container
    # Excluding build artifacts and .git to make it faster
    tar --exclude='./output' \
        --exclude='./.git' \
        --exclude='./.idea' \
        --exclude='./.vscode' \
        -cf - . | docker exec -i $CONTAINER_NAME tar xf - -C /workspace/
    
    echo "Files synced successfully."
    echo "Starting build process..."
    
    # Execute the build script inside the container
    docker exec -it $CONTAINER_NAME sh build-browser-os.sh
else
    echo "Error: Container '$CONTAINER_NAME' is not running."
    echo "Please start the environment first: docker-compose up -d"
    exit 1
fi
