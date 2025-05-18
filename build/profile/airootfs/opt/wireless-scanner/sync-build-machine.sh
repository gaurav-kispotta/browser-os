while true; do
    rsync -avz --delete . gauravkispotta@192.168.1.101:~/Documents/browser-os-client-agent
    sleep 60
done