# Rebuild the container with updated Dockerfile
docker-compose down
docker-compose build --no-cache

# Start the container
docker-compose run --rm browser-os-builder