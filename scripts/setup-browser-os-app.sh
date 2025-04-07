#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
WEB_DIR="$PROJECT_DIR/build/profile/airootfs/var/www/BROWSER_OS"

# Create web directory
mkdir -p "$WEB_DIR"

# Create a simple BROWSER_OS webpage
cat > "$WEB_DIR/index.html" << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Browser OS</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #000;
            color: #fff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            text-align: center;
        }
        
        .logo {
            max-width: 300px;
            margin-bottom: 2rem;
        }
        
        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        .content {
            max-width: 800px;
            padding: 2rem;
        }
        
        .time {
            font-size: 2rem;
            margin-top: 2rem;
        }
    </style>
</head>
<body>
    <img src="/logo.png" alt="Browser OS Logo" class="logo">
    <h1>Welcome to Browser OS</h1>
    <div class="content">
        <p>This is a customized Arch Linux BROWSER_OS system.</p>
        <p>Modify this page with your own content.</p>
    </div>
    <div class="time" id="current-time"></div>

    <script>
        // Update the time display
        function updateTime() {
            const now = new Date();
            document.getElementById('current-time').textContent = now.toLocaleTimeString();
        }
        
        // Update time every second
        setInterval(updateTime, 1000);
        updateTime();
    </script>
</body>
</html>
EOF

mkdir -p "$PROJECT_DIR/build/profile/airootfs/etc/nginx/sites-available/"

# Create a simple web server configuration for nginx
cat > "$PROJECT_DIR/build/profile/airootfs/etc/nginx/sites-available/BROWSER_OS.conf" << EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/BROWSER_OS;
    index index.html;

    location / {
        try_files \$uri \$uri/ =404;
    }

    location /logo.png {
        alias /etc/browser-os/logo.png;
    }
}
EOF

# Create directory for sites-enabled
mkdir -p "$PROJECT_DIR/build/profile/airootfs/etc/nginx/sites-enabled"

# Create symbolic link
cat > "$PROJECT_DIR/build/profile/airootfs/root/setup_nginx.sh" << 'EOF'
#!/bin/bash
ln -sf /etc/nginx/sites-available/BROWSER_OS.conf /etc/nginx/sites-enabled/
systemctl enable nginx
EOF

chmod +x "$PROJECT_DIR/build/profile/airootfs/root/setup_nginx.sh"

# Update packages list to include nginx
if ! grep -q "nginx" "$PROJECT_DIR/config/packages.x86_64"; then
    echo "nginx" >> "$PROJECT_DIR/config/packages.x86_64"
fi

# Update customize_airootfs.sh to run nginx setup
if [ -f "$PROJECT_DIR/build/profile/airootfs/root/customize_airootfs.sh" ]; then
    sed -i '/\/etc\/browser-os\/scripts\/setup-BROWSER_OS.sh/a\\n# Setup nginx\n/root/setup_nginx.sh' "$PROJECT_DIR/build/profile/airootfs/root/customize_airootfs.sh"
fi

# Update openbox autostart to point to localhost
if [ -f "$PROJECT_DIR/build/profile/airootfs/etc/browser-os/scripts/setup-BROWSER_OS.sh" ]; then
    sed -i 's|firefox --BROWSER_OS http://localhost &|firefox --BROWSER_OS http://localhost &|' "$PROJECT_DIR/build/profile/airootfs/etc/browser-os/scripts/setup-BROWSER_OS.sh"
fi

echo "BROWSER_OS web app setup complete!" 