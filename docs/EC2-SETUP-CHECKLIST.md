# EC2 Setup Checklist

Use this checklist to ensure all EC2 setup steps are completed before first deployment.

## Pre-Setup Verification

- [ ] SSH key file available: `trve-key.pem`
- [ ] Can SSH to EC2: `ssh -i trve-key.pem ec2-user@63.182.249.47`
- [ ] Nginx is installed: `sudo systemctl status nginx`
- [ ] Backend API is running on port 5000: `curl http://localhost:5000/api/health`

## Directory Setup

```bash
# SSH to EC2
ssh -i trve-key.pem ec2-user@63.182.249.47
```

- [ ] Create frontend directory:
  ```bash
  sudo mkdir -p /var/www/trve-frontend
  ```

- [ ] Create backup directory:
  ```bash
  sudo mkdir -p /var/www/backups/trve-frontend
  ```

- [ ] Set ownership (frontend):
  ```bash
  sudo chown -R ec2-user:nginx /var/www/trve-frontend
  ```

- [ ] Set ownership (backups):
  ```bash
  sudo chown -R ec2-user:nginx /var/www/backups
  ```

- [ ] Set permissions (frontend):
  ```bash
  sudo chmod -R 755 /var/www/trve-frontend
  ```

- [ ] Set permissions (backups):
  ```bash
  sudo chmod -R 755 /var/www/backups
  ```

- [ ] Verify directories exist:
  ```bash
  ls -la /var/www/
  ```

## Nginx Configuration

- [ ] Create Nginx config file:
  ```bash
  sudo nano /etc/nginx/conf.d/trve-frontend.conf
  ```

- [ ] Paste configuration (from EC2-SETUP.md)

- [ ] Save and exit (Ctrl+X, Y, Enter)

- [ ] Test Nginx configuration:
  ```bash
  sudo nginx -t
  ```

- [ ] Should see: "syntax is ok" and "test is successful"

- [ ] Reload Nginx:
  ```bash
  sudo systemctl reload nginx
  ```

- [ ] Verify Nginx is running:
  ```bash
  sudo systemctl status nginx
  ```

- [ ] Check Nginx is listening on port 80:
  ```bash
  sudo netstat -tlnp | grep :80
  ```

## Install Required Tools

- [ ] Install rsync:
  ```bash
  sudo yum install -y rsync
  ```

- [ ] Verify rsync installation:
  ```bash
  rsync --version
  ```

## Create Rollback Script

- [ ] Create rollback script:
  ```bash
  sudo nano /usr/local/bin/rollback-frontend.sh
  ```

- [ ] Paste script contents (from EC2-SETUP.md)

- [ ] Save and exit (Ctrl+X, Y, Enter)

- [ ] Make script executable:
  ```bash
  sudo chmod +x /usr/local/bin/rollback-frontend.sh
  ```

- [ ] Test script (should show usage):
  ```bash
  sudo /usr/local/bin/rollback-frontend.sh
  ```

## Test EC2 Setup

- [ ] Create test HTML file:
  ```bash
  echo "<h1>Test Deployment</h1><p>If you see this, Nginx is configured correctly.</p>" | sudo tee /var/www/trve-frontend/index.html
  ```

- [ ] Set permissions:
  ```bash
  sudo chown nginx:nginx /var/www/trve-frontend/index.html
  sudo chmod 644 /var/www/trve-frontend/index.html
  ```

- [ ] Test via curl from EC2:
  ```bash
  curl http://localhost/
  ```

- [ ] Should see the HTML content

- [ ] Test health endpoint:
  ```bash
  curl http://localhost/health
  ```

- [ ] Should see "OK"

- [ ] Test from local machine (browser or curl):
  ```
  http://63.182.249.47
  ```

- [ ] Should see "Test Deployment" page

- [ ] Clean up test file:
  ```bash
  sudo rm /var/www/trve-frontend/index.html
  ```

## Backend API Configuration (Optional)

**Only if running .NET backend on this EC2 instance:**

- [ ] Configure backend environment variables:
  ```bash
  sudo nano /etc/systemd/system/trve-backend.service
  ```

- [ ] Add environment variables to service file:
  ```ini
  Environment="ASPNETCORE_ENVIRONMENT=Production"
  Environment="ConnectionStrings__DefaultConnection=Host=<RDS_ENDPOINT>;Port=5432;Database=trvedb;Username=trveadmin;Password=<DB_PASSWORD>"
  ```

- [ ] Reload systemd:
  ```bash
  sudo systemctl daemon-reload
  ```

- [ ] Restart backend:
  ```bash
  sudo systemctl restart trve-backend
  ```

- [ ] Verify backend is running:
  ```bash
  sudo systemctl status trve-backend
  ```

- [ ] Test backend API:
  ```bash
  curl http://localhost:5000/api/health
  ```

## GitHub Secrets Setup

Go to: `https://github.com/masaj84/AssetRegistry-Web/settings/secrets/actions`

**Complete guide:** See `docs/GITHUB-SECRETS.md`

### Frontend Secrets

- [ ] Click "New repository secret"

- [ ] Add `EC2_SSH_KEY`:
  - Name: `EC2_SSH_KEY`
  - Value: Full contents of `trve-key.pem` (including BEGIN/END lines)
  - Click "Add secret"

- [ ] Add `EC2_HOST`:
  - Name: `EC2_HOST`
  - Value: `63.182.249.47`
  - Click "Add secret"

- [ ] Add `EC2_USER`:
  - Name: `EC2_USER`
  - Value: `ec2-user`
  - Click "Add secret"

- [ ] Add `VITE_API_URL_PRODUCTION`:
  - Name: `VITE_API_URL_PRODUCTION`
  - Value: `https://trve.io/api`
  - Click "Add secret"

- [ ] Add `VITE_API_URL_STAGING`:
  - Name: `VITE_API_URL_STAGING`
  - Value: `http://63.182.249.47:5000/api`
  - Click "Add secret"

### Backend Secrets (for future backend workflow)

- [ ] Add `DB_HOST`:
  - Name: `DB_HOST`
  - Value: `<your-rds-endpoint>.rds.amazonaws.com`
  - Click "Add secret"

- [ ] Add `DB_PASSWORD`:
  - Name: `DB_PASSWORD`
  - Value: `<your-rds-password>`
  - Click "Add secret"

- [ ] Verify all 7 secrets are listed on the Secrets page

## Security Configuration

- [ ] Check EC2 Security Group allows SSH (port 22):
  - From your IP: `217.97.72.147/32` (or 0.0.0.0/0 for GitHub Actions)

- [ ] Check EC2 Security Group allows HTTP (port 80):
  - From: `0.0.0.0/0`

- [ ] Check EC2 Security Group allows HTTPS (port 443):
  - From: `0.0.0.0/0` (if using SSL)

- [ ] Verify backend port 5000 is NOT exposed publicly:
  - Only accessible via localhost/Nginx proxy

## Final Verification

- [ ] Can SSH to EC2 without errors
- [ ] Nginx is running and configured correctly
- [ ] Directories exist with correct permissions
- [ ] rsync is installed
- [ ] Rollback script is executable
- [ ] All 5 GitHub Secrets are configured
- [ ] Test HTML served successfully
- [ ] Backend API accessible via proxy: `curl http://localhost/api/health`

## Post-Setup Actions

- [ ] Commit GitHub Actions workflow:
  ```bash
  cd D:\AI\Cargoo_v1\AssetRegistry-Web
  git add .github/ docs/ DEPLOYMENT-SETUP-SUMMARY.md
  git commit -m "feat: Add GitHub Actions CI/CD workflow"
  git push
  ```

- [ ] Run first test deployment:
  1. Go to GitHub Actions
  2. Select "Deploy TRVE Frontend to EC2"
  3. Run workflow with:
     - Branch: `main` (or current branch)
     - Environment: `staging`

- [ ] Monitor deployment logs

- [ ] Test deployed site:
  ```
  http://63.182.249.47
  ```

- [ ] Check deployment info:
  ```bash
  ssh -i trve-key.pem ec2-user@63.182.249.47
  cat /var/www/trve-frontend/deployment-info.json
  ```

## Troubleshooting

If anything fails during setup, check:

### SSH Connection Issues
```bash
# Test SSH connectivity
ssh -i trve-key.pem -v ec2-user@63.182.249.47

# Check EC2 Security Group (AWS Console)
# Ensure port 22 is open from your IP
```

### Nginx Issues
```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx error logs
sudo tail -50 /var/log/nginx/error.log

# Check Nginx access logs
sudo tail -50 /var/log/nginx/access.log

# Test configuration
sudo nginx -t
```

### Permission Issues
```bash
# Reset permissions
sudo chown -R ec2-user:nginx /var/www/trve-frontend
sudo chmod -R 755 /var/www/trve-frontend

# For deployed files (after deployment)
sudo chown -R nginx:nginx /var/www/trve-frontend
sudo find /var/www/trve-frontend -type f -exec chmod 644 {} \;
sudo find /var/www/trve-frontend -type d -exec chmod 755 {} \;
```

### Backend API Issues
```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Check backend process
ps aux | grep dotnet

# Check backend logs (if using systemd)
sudo journalctl -u your-backend-service -n 50
```

## Summary

✅ **Setup Complete!**

You can now:
1. Run GitHub Actions workflow to deploy
2. Use staging environment for testing
3. Deploy to production after validation
4. Rollback if needed using the script

---

**Next Steps:**
1. Read `docs/DEPLOYMENT-QUICKSTART.md` for deployment instructions
2. Run your first deployment to staging
3. Test thoroughly
4. Deploy to production

**Time Required:** ~30-45 minutes for complete setup

**Support:** See `docs/DEPLOYMENT.md` for troubleshooting and detailed guides
