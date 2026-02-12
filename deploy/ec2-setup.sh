#!/bin/bash
# EC2 Setup Script - Separate staging and production directories
# Run this on EC2 BEFORE the first deploy with new workflow
#
# Usage: ssh ec2-user@<EC2_HOST> 'bash -s' < ec2-setup.sh

set -e

echo "=== Setting up separate staging/production directories ==="

# Create new directories
sudo mkdir -p /var/www/trve-production
sudo mkdir -p /var/www/trve-staging
sudo mkdir -p /var/www/backups/trve-production
sudo mkdir -p /var/www/backups/trve-staging

# Copy current deployment to both (so nothing is lost)
if [ -d "/var/www/trve-frontend" ] && [ "$(ls -A /var/www/trve-frontend 2>/dev/null)" ]; then
    echo "Copying current deployment to staging..."
    sudo cp -r /var/www/trve-frontend/* /var/www/trve-staging/
    echo "Copying current deployment to production..."
    sudo cp -r /var/www/trve-frontend/* /var/www/trve-production/
    echo "Current deployment copied to both directories"
else
    echo "No existing deployment at /var/www/trve-frontend, skipping copy"
fi

# Set ownership
sudo chown -R ec2-user:nginx /var/www/trve-production /var/www/trve-staging
sudo chown -R ec2-user:nginx /var/www/backups/trve-production /var/www/backups/trve-staging

echo ""
echo "=== Installing nginx config ==="

# Backup existing nginx config
if [ -f /etc/nginx/conf.d/default.conf ]; then
    sudo cp /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.bak
    echo "Backed up default.conf to default.conf.bak"
fi

# Write new nginx config
sudo tee /etc/nginx/conf.d/trve.conf > /dev/null << 'NGINX'
# Production - trve.io (landing page with TEASER_MODE=true)
server {
    listen 80;
    server_name trve.io www.trve.io;
    root /var/www/trve-production;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Staging - default server (full app, access via IP)
server {
    listen 80 default_server;
    server_name _;
    root /var/www/trve-staging;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX

# Remove default config if it has a conflicting default_server
if [ -f /etc/nginx/conf.d/default.conf ]; then
    sudo rm /etc/nginx/conf.d/default.conf
    echo "Removed default.conf (backup at default.conf.bak)"
fi

# Test and reload nginx
echo ""
echo "=== Testing nginx config ==="
sudo nginx -t

echo ""
echo "=== Reloading nginx ==="
sudo systemctl reload nginx

echo ""
echo "=== Done! ==="
echo ""
echo "Directory structure:"
echo "  /var/www/trve-production  -> trve.io (TEASER_MODE=true)"
echo "  /var/www/trve-staging     -> IP access (TEASER_MODE=false)"
echo ""
echo "Next steps:"
echo "  1. Deploy staging:    Run workflow with environment=staging"
echo "  2. Deploy production: Run workflow with environment=production"
