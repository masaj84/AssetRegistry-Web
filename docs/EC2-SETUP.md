# EC2 Pre-Deployment Setup

This document contains the one-time setup steps required on the EC2 instance before the first GitHub Actions deployment.

## Prerequisites

- SSH access to EC2: `ssh -i trve-key.pem ec2-user@63.182.249.47`
- EC2 instance: Amazon Linux 2023
- Nginx installed
- Node.js backend running on port 5000

## Setup Steps

### 1. Create Directory Structure

```bash
# SSH to EC2
ssh -i trve-key.pem ec2-user@63.182.249.47

# Create deployment and backup directories
sudo mkdir -p /var/www/trve-frontend
sudo mkdir -p /var/www/backups/trve-frontend

# Set ownership for deployment (ec2-user needs write access during rsync)
sudo chown -R ec2-user:nginx /var/www/trve-frontend
sudo chown -R ec2-user:nginx /var/www/backups

# Set permissions
sudo chmod -R 755 /var/www/trve-frontend
sudo chmod -R 755 /var/www/backups
```

### 2. Configure Nginx

```bash
# Create Nginx configuration for frontend
sudo tee /etc/nginx/conf.d/trve-frontend.conf << 'EOF'
server {
    listen 80;
    server_name trve.io www.trve.io;

    root /var/www/trve-frontend;
    index index.html;

    # React SPA - all routes redirect to index.html
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, must-revalidate";
    }

    # Static assets with caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "OK";
        add_header Content-Type text/plain;
    }
}
EOF

# Test Nginx configuration
sudo nginx -t

# If test passes, reload Nginx
sudo systemctl reload nginx

# Verify Nginx is running
sudo systemctl status nginx
```

### 3. Install Required Tools

```bash
# Install rsync (required for GitHub Actions deployment)
sudo yum install -y rsync

# Verify installation
rsync --version
```

### 4. Create Rollback Script

```bash
# Create rollback script for manual recovery
sudo tee /usr/local/bin/rollback-frontend.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/www/backups/trve-frontend"
DEPLOY_DIR="/var/www/trve-frontend"

if [ -z "$1" ]; then
    echo "Available backups:"
    ls -lht "$BACKUP_DIR"
    echo ""
    echo "Usage: $0 <backup-name>"
    exit 1
fi

BACKUP_PATH="$BACKUP_DIR/$1"

if [ ! -d "$BACKUP_PATH" ]; then
    echo "Error: Backup '$1' not found"
    exit 1
fi

echo "Rolling back to: $1"
rm -rf "$DEPLOY_DIR"
cp -r "$BACKUP_PATH" "$DEPLOY_DIR"
chown -R nginx:nginx "$DEPLOY_DIR"
chmod -R 755 "$DEPLOY_DIR"
systemctl reload nginx
echo "Rollback complete!"
EOF

# Make script executable
sudo chmod +x /usr/local/bin/rollback-frontend.sh

# Test script (it should list usage)
sudo /usr/local/bin/rollback-frontend.sh
```

### 5. Verify Setup

```bash
# Check directory structure
ls -la /var/www/

# Check Nginx config
sudo nginx -t

# Check Nginx is listening on port 80
sudo netstat -tlnp | grep :80

# Check backend is running on port 5000
curl http://localhost:5000/api/health
```

## GitHub Secrets Configuration

Add these secrets to your GitHub repository:

1. Go to: `https://github.com/masaj84/AssetRegistry-Web/settings/secrets/actions`
2. Add the following secrets:

| Secret Name | Value | Description |
|------------|-------|-------------|
| `SSH_PRIVATE_KEY` | (contents of trve-key.pem) | Full PEM file with headers |
| `EC2_HOST` | `63.182.249.47` | EC2 IP address |
| `EC2_USER` | `ec2-user` | SSH username |
| `VITE_API_URL_PRODUCTION` | `https://trve.io/api` | Production API endpoint |
| `VITE_API_URL_STAGING` | `http://63.182.249.47:5000/api` | Staging API endpoint |

### Adding SSH_PRIVATE_KEY

```bash
# On your local machine, copy the entire contents of trve-key.pem
# Including the -----BEGIN RSA PRIVATE KEY----- and -----END RSA PRIVATE KEY----- lines
cat trve-key.pem

# Paste the entire output into GitHub Secrets → SSH_PRIVATE_KEY
```

## Security Checklist

- [ ] EC2 Security Group: SSH (22) restricted to your IP
- [ ] EC2 Security Group: HTTP (80) open to 0.0.0.0/0
- [ ] EC2 Security Group: HTTPS (443) open to 0.0.0.0/0 (if using SSL)
- [ ] SSH private key stored only in GitHub Secrets
- [ ] Nginx user has correct permissions (nginx:nginx)
- [ ] Backup directory is writable by ec2-user
- [ ] Rollback script is executable

## Testing the Setup

After completing the setup, you can test manually:

```bash
# Create a test index.html
echo "<h1>Test Deployment</h1>" | sudo tee /var/www/trve-frontend/index.html

# Set permissions
sudo chown nginx:nginx /var/www/trve-frontend/index.html
sudo chmod 644 /var/www/trve-frontend/index.html

# Test via curl
curl http://localhost/

# Test from browser
# Open: http://63.182.249.47
```

## Backend API Configuration (Optional)

If you're also running the .NET backend API on this EC2 instance, configure the environment variables:

### Option 1: systemd Service (Recommended)

```bash
# Edit backend service file
sudo nano /etc/systemd/system/trve-backend.service
```

Add environment variables (replace `<RDS_ENDPOINT>` and `<DB_PASSWORD>` with actual values):

```ini
[Service]
User=ec2-user
WorkingDirectory=/var/www/trve-backend
ExecStart=/usr/bin/dotnet /var/www/trve-backend/AssetRegistry.Api.dll

# Environment Variables
Environment="ASPNETCORE_ENVIRONMENT=Production"
Environment="ConnectionStrings__DefaultConnection=Host=<RDS_ENDPOINT>;Port=5432;Database=trvedb;Username=trveadmin;Password=<DB_PASSWORD>"

[Install]
WantedBy=multi-user.target
```

Reload and restart:

```bash
sudo systemctl daemon-reload
sudo systemctl restart trve-backend
sudo systemctl status trve-backend
```

### Option 2: Environment File

```bash
# Create .env file
sudo nano /var/www/trve-backend/.env
```

Add variables (replace `<RDS_ENDPOINT>` and `<DB_PASSWORD>` with actual values):

```bash
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=Host=<RDS_ENDPOINT>;Port=5432;Database=trvedb;Username=trveadmin;Password=<DB_PASSWORD>
```

Set permissions:

```bash
sudo chown ec2-user:ec2-user /var/www/trve-backend/.env
sudo chmod 600 /var/www/trve-backend/.env
```

### Verify Backend Configuration

```bash
# Test backend API
curl http://localhost:5000/api/health

# Check backend logs
sudo journalctl -u trve-backend -n 50 --no-pager

# Test database connectivity
curl http://localhost:5000/api/admin/users  # Should require auth, not fail with DB error
```

## Next Steps

After completing this setup:

1. **Configure GitHub Secrets** (see `docs/GITHUB-SECRETS.md`)
2. Commit the `.github/workflows/deploy-frontend.yml` to your repository
3. Go to GitHub Actions and run the workflow manually
4. Select branch: `main`
5. Select environment: `staging`
6. Monitor the workflow logs

## Troubleshooting

### Permission Denied During rsync

```bash
sudo chown -R ec2-user:nginx /var/www/trve-frontend
sudo chmod -R 755 /var/www/trve-frontend
```

### Nginx 403 Forbidden

```bash
sudo chown -R nginx:nginx /var/www/trve-frontend
sudo find /var/www/trve-frontend -type f -exec chmod 644 {} \;
sudo find /var/www/trve-frontend -type d -exec chmod 755 {} \;
sudo systemctl reload nginx
```

### Cannot Connect to Backend API

```bash
# Check backend is running
curl http://localhost:5000/api/health

# Check Nginx proxy configuration
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```
