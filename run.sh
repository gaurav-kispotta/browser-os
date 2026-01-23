# Rebuild the container with updated Dockerfile
docker-compose down
docker-compose build

# Start the container
docker-compose run --rm browser-os-builder sh ./build-browser-os.sh