# TRVE Frontend Deployment Guide

This guide explains how to deploy the TRVE frontend to EC2 using GitHub Actions.

## Overview

- **Trigger:** Manual (workflow_dispatch)
- **Environments:** staging, production
- **Branch Selection:** Choose any branch to deploy
- **Target:** EC2 instance (63.182.249.47)
- **Deploy Path:** `/var/www/trve-frontend`
- **Web Server:** Nginx

## Prerequisites

1. EC2 instance setup completed (see `EC2-SETUP.md`)
2. GitHub Secrets configured
3. SSH key (`trve-key.pem`) added to GitHub Secrets

## Deployment Methods

### Method 1: GitHub Web UI (Recommended)

1. Go to GitHub repository: `https://github.com/masaj84/AssetRegistry-Web`
2. Click on **Actions** tab
3. Select **"Deploy TRVE Frontend to EC2"** workflow
4. Click **"Run workflow"** button (top right)
5. Fill in the form:
   - **Branch:** Select branch to deploy (e.g., `main`, `develop`, `feature/new-ui`)
   - **Environment:** Choose `staging` or `production`
6. Click **"Run workflow"** (green button)
7. Monitor the workflow progress

### Method 2: GitHub CLI

```bash
# Install GitHub CLI (if not installed)
# https://cli.github.com/

# Login to GitHub
gh auth login

# Deploy main branch to staging
gh workflow run "Deploy TRVE Frontend to EC2" \
  -f branch=main \
  -f environment=staging

# Deploy feature branch to staging (test before merge)
gh workflow run "Deploy TRVE Frontend to EC2" \
  -f branch=feature/new-feature \
  -f environment=staging

# Deploy main to production
gh workflow run "Deploy TRVE Frontend to EC2" \
  -f branch=main \
  -f environment=production

# View workflow runs
gh run list --workflow="Deploy TRVE Frontend to EC2"

# View logs of the latest run
gh run view --log
```

## Deployment Workflow Steps

The workflow consists of 3 jobs:

### 1. Build Job (~1-2 minutes)

- Checks out selected branch
- Installs Node.js 20.x dependencies
- Runs ESLint
- Creates environment-specific `.env` file
- Builds the application (`npm run build`)
- Creates deployment metadata (`deployment-info.json`)
- Uploads build artifact

### 2. Deploy Job (~1-2 minutes)

- Downloads build artifact
- Sets up SSH connection to EC2
- Creates backup of current deployment
- Deploys files via `rsync` (with `--delete` flag)
- Sets correct permissions (nginx:nginx)
- Reloads Nginx
- Cleans up old backups (keeps last 5)

### 3. Health Check Job (~15 seconds)

- Waits 10 seconds for deployment to settle
- Checks if the site is accessible:
  - **Staging:** `http://63.182.249.47`
  - **Production:** `https://trve.io`
- Validates HTTP response (200, 301, or 302)
- Provides rollback instructions on failure

## Environment Configuration

### Staging

- **URL:** http://63.182.249.47
- **API Endpoint:** `http://63.182.249.47:5000/api`
- **Use Case:** Testing features before production

### Production

- **URL:** https://trve.io
- **API Endpoint:** `https://trve.io/api`
- **Use Case:** Live production environment

## Verification After Deployment

### 1. Check Workflow Logs

- GitHub → Actions → Select workflow run
- Review logs for each job (Build, Deploy, Health Check)
- Ensure all jobs completed successfully (green checkmarks)

### 2. Check Website in Browser

**Staging:**
```
http://63.182.249.47
```

**Production:**
```
https://trve.io
```

### 3. Check Deployment Metadata

```bash
# SSH to EC2
ssh -i trve-key.pem ec2-user@63.182.249.47

# View deployment info
cat /var/www/trve-frontend/deployment-info.json
```

Expected output:
```json
{
  "branch": "main",
  "environment": "staging",
  "commit": "abc123def456...",
  "commitShort": "abc123d",
  "deployedBy": "masaj84",
  "deployedAt": "2026-02-08T14:30:22Z",
  "workflowRun": "123456789",
  "workflowUrl": "https://github.com/masaj84/AssetRegistry-Web/actions/runs/123456789"
}
```

### 4. Check Nginx Logs (if issues)

```bash
# SSH to EC2
ssh -i trve-key.pem ec2-user@63.182.249.47

# View access logs
sudo tail -f /var/log/nginx/access.log

# View error logs
sudo tail -f /var/log/nginx/error.log
```

### 5. Test API Proxy

```bash
# From EC2
curl http://localhost/health          # Frontend health check
curl http://localhost/api/health      # Backend health check (via proxy)

# From local machine
curl http://63.182.249.47/api/health  # Staging
curl https://trve.io/api/health       # Production
```

### 6. Browser Testing

1. Open the deployed URL
2. Check browser console (F12) for errors
3. Check Network tab:
   - All assets loading (JS, CSS, images)
   - No 404 errors
   - API calls working
4. Test navigation (React Router should work)
5. Test login/authentication (if backend is running)

## Rollback Procedure

If a deployment fails or introduces issues, you can rollback to a previous version.

### View Available Backups

```bash
# SSH to EC2
ssh -i trve-key.pem ec2-user@63.182.249.47

# List available backups
sudo /usr/local/bin/rollback-frontend.sh
```

Expected output:
```
Available backups:
drwxr-xr-x. 4 root root 4096 Feb  8 14:30 backup-20260208-143022-staging
drwxr-xr-x. 4 root root 4096 Feb  8 12:15 backup-20260208-121530-staging
drwxr-xr-x. 4 root root 4096 Feb  7 18:45 backup-20260207-184500-production
```

### Perform Rollback

```bash
# Rollback to specific backup
sudo /usr/local/bin/rollback-frontend.sh backup-20260208-143022-staging

# Output:
# Rolling back to: backup-20260208-143022-staging
# Rollback complete!
```

### Verify Rollback

```bash
# Check deployment info
cat /var/www/trve-frontend/deployment-info.json

# Check site in browser
# http://63.182.249.47 (staging) or https://trve.io (production)
```

## Best Practices

### 1. Always Deploy to Staging First

```bash
# Step 1: Deploy to staging
gh workflow run "Deploy TRVE Frontend to EC2" -f branch=main -f environment=staging

# Step 2: Test staging thoroughly
# - Check functionality
# - Test user flows
# - Verify API integration

# Step 3: Deploy to production (if staging is OK)
gh workflow run "Deploy TRVE Frontend to EC2" -f branch=main -f environment=production
```

### 2. Test Feature Branches on Staging

```bash
# Deploy feature branch to staging for testing
gh workflow run "Deploy TRVE Frontend to EC2" \
  -f branch=feature/new-dashboard \
  -f environment=staging

# After testing, merge to main
git checkout main
git merge feature/new-dashboard
git push origin main

# Deploy main to production
gh workflow run "Deploy TRVE Frontend to EC2" -f branch=main -f environment=production
```

### 3. Monitor Workflow Logs

Always watch the workflow execution:
- Build logs for TypeScript errors
- Deploy logs for SSH/rsync issues
- Health check logs for connectivity problems

### 4. Keep Backups

- Automatic backups are created before each deployment
- Last 5 backups are kept per environment
- Manual cleanup: `sudo rm -rf /var/www/backups/trve-frontend/backup-*`

### 5. Document Deployments

After successful production deployment, add a note:
```bash
# Create deployment note
git tag -a v1.0.1 -m "Production deployment: Added user dashboard"
git push origin v1.0.1
```

## Troubleshooting

### Health Check Fails

**Symptom:** Health check job fails, but website works

**Solution:**
```bash
# Check if Cloudflare is blocking direct IP access (production)
curl -I https://trve.io

# For staging, check EC2 security group allows HTTP from GitHub Actions IPs
# Or test manually:
curl -I http://63.182.249.47
```

### SSH Connection Timeout

**Symptom:** Deploy job fails with "Connection timed out"

**Solution:**
1. Check EC2 Security Group allows SSH (port 22) from GitHub Actions IPs
2. Or use self-hosted GitHub Actions runner on EC2

### Permission Denied During Deploy

**Symptom:** rsync fails with "Permission denied"

**Solution:**
```bash
ssh -i trve-key.pem ec2-user@63.182.249.47
sudo chown -R ec2-user:nginx /var/www/trve-frontend
sudo chmod -R 755 /var/www/trve-frontend
```

### Nginx 403 Forbidden

**Symptom:** Website shows "403 Forbidden"

**Solution:**
```bash
ssh -i trve-key.pem ec2-user@63.182.249.47
sudo chown -R nginx:nginx /var/www/trve-frontend
sudo find /var/www/trve-frontend -type f -exec chmod 644 {} \;
sudo find /var/www/trve-frontend -type d -exec chmod 755 {} \;
sudo systemctl reload nginx
```

### Build Fails with TypeScript Errors

**Symptom:** Build job fails during `npm run build`

**Solution:**
1. Fix TypeScript errors locally first
2. Test build locally: `npm run build`
3. Commit fixes and re-run workflow

### API Calls Fail (CORS)

**Symptom:** Browser shows CORS errors

**Solution:**
1. Check backend CORS configuration allows frontend origin
2. Check `VITE_API_URL` is correct for environment
3. Verify Nginx proxy configuration

### Assets Not Loading (404)

**Symptom:** CSS/JS files return 404

**Solution:**
1. Check Vite base URL configuration
2. Verify Nginx `root` directive points to `/var/www/trve-frontend`
3. Check file permissions (should be 644)

## Deployment Timeline

**Initial setup (one-time):** ~30-45 minutes
- EC2 setup: 15-20 min
- GitHub secrets: 5 min
- Workflow creation: 10 min
- First test deployment: 5-10 min

**Subsequent deployments:** ~3-5 minutes
- Build job: 1-2 min
- Deploy job: 1-2 min
- Health check: 15 sec

## Security Considerations

- ✅ SSH private key stored only in GitHub Secrets (encrypted)
- ✅ EC2 Security Group restricts SSH to specific IPs
- ✅ Nginx runs with least-privilege user (nginx:nginx)
- ✅ Automatic backups before each deployment
- ✅ Health checks validate deployment success
- ✅ No secrets in code or logs
- ✅ HTTPS for production (via Cloudflare)

## Support

**Issues with deployment?**
1. Check workflow logs in GitHub Actions
2. SSH to EC2 and check Nginx logs
3. Review EC2-SETUP.md for configuration
4. Test manually with curl commands

**Need to rollback?**
1. SSH to EC2
2. Run: `sudo /usr/local/bin/rollback-frontend.sh`
3. Select backup to restore
4. Verify with browser

**GitHub Actions not running?**
1. Check GitHub Secrets are configured
2. Verify EC2 is accessible via SSH
3. Review Security Group rules
4. Test SSH manually: `ssh -i trve-key.pem ec2-user@63.182.249.47`
