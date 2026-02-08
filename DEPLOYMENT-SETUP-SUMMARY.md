# TRVE Frontend CI/CD Implementation Summary

This document summarizes the GitHub Actions CI/CD setup for TRVE Frontend.

## ✅ What Was Created

### 1. GitHub Actions Workflow
**File:** `.github/workflows/deploy-frontend.yml`

- **Trigger:** Manual (`workflow_dispatch`) with branch and environment selection
- **Jobs:** Build → Deploy → Health Check
- **Features:**
  - Automatic backups before deployment
  - Health checks after deployment
  - Environment-specific configuration (staging/production)
  - Deployment metadata tracking
  - Old backup cleanup (keeps last 5)

### 2. Documentation Files

**Directory:** `docs/`

- **README.md** - Overview and navigation
- **EC2-SETUP.md** - One-time EC2 setup instructions (MUST DO BEFORE FIRST DEPLOYMENT)
- **DEPLOYMENT.md** - Complete deployment guide with troubleshooting
- **DEPLOYMENT-QUICKSTART.md** - Quick reference for regular deployments

## 🎯 Next Steps (Required Before First Deployment)

### Step 1: EC2 Setup (~20-30 minutes)

SSH to EC2 and run the setup from `docs/EC2-SETUP.md`:

```bash
ssh -i trve-key.pem ec2-user@63.182.249.47

# Create directories
sudo mkdir -p /var/www/trve-frontend
sudo mkdir -p /var/www/backups/trve-frontend
sudo chown -R ec2-user:nginx /var/www/trve-frontend
sudo chown -R ec2-user:nginx /var/www/backups
sudo chmod -R 755 /var/www/trve-frontend
sudo chmod -R 755 /var/www/backups

# Configure Nginx (see EC2-SETUP.md for full config)
# Install rsync
# Create rollback script
```

**IMPORTANT:** Follow ALL steps in `docs/EC2-SETUP.md` before proceeding.

### Step 2: Configure GitHub Secrets (~5 minutes)

Go to: `https://github.com/masaj84/AssetRegistry-Web/settings/secrets/actions`

**Complete guide:** See `docs/GITHUB-SECRETS.md`

Add these secrets:

#### Frontend Deployment Secrets (Required)

| Secret Name | Value |
|------------|-------|
| `EC2_SSH_KEY` | Full contents of `trve-key.pem` file |
| `EC2_HOST` | `63.182.249.47` |
| `EC2_USER` | `ec2-user` |
| `VITE_API_URL_PRODUCTION` | `https://trve.io/api` |
| `VITE_API_URL_STAGING` | `http://63.182.249.47:5000/api` |

#### Backend Deployment Secrets (Optional - for future backend workflow)

| Secret Name | Value |
|------------|-------|
| `DB_HOST` | `<RDS_ENDPOINT>` (e.g., `trvedb.xxx.rds.amazonaws.com`) |
| `DB_PASSWORD` | RDS password for `trveadmin` user |

**For EC2_SSH_KEY:**
```bash
# Copy the ENTIRE contents including headers
cd D:\AI\_AWS\TRVE
cat trve-key.pem
# Paste into GitHub Secrets
```

### Step 3: Commit and Push Workflow (~2 minutes)

```bash
cd D:\AI\Cargoo_v1\AssetRegistry-Web

# Add all files
git add .github/ docs/ DEPLOYMENT-SETUP-SUMMARY.md

# Commit
git commit -m "feat: Add GitHub Actions CI/CD workflow for frontend deployment

- Add workflow_dispatch trigger with branch and environment selection
- Implement Build, Deploy, and Health Check jobs
- Add automatic backups before deployment
- Add health checks after deployment
- Add comprehensive deployment documentation
- Add EC2 setup instructions
- Add rollback script and procedures"

# Push to current branch (landing-teaser)
git push origin landing-teaser
```

### Step 4: First Test Deployment (~5 minutes)

After completing Steps 1-3:

1. Go to: `https://github.com/masaj84/AssetRegistry-Web/actions`
2. Select **"Deploy TRVE Frontend to EC2"**
3. Click **"Run workflow"**
4. Configure:
   - **Branch:** `landing-teaser` (or `main` after merging)
   - **Environment:** `staging`
5. Click **"Run workflow"**
6. Monitor the logs
7. Test: `http://63.182.249.47`

## 📋 Deployment Workflow Summary

```
┌──────────────────────────────────────┐
│  User: Run Workflow (Manual)        │
│  ├─ Select Branch (e.g., main)      │
│  └─ Select Environment (staging)    │
└──────────────────────────────────────┘
                ↓
┌──────────────────────────────────────┐
│  Job 1: Build (~1-2 min)             │
│  ├─ Checkout selected branch         │
│  ├─ Install Node.js 20.x             │
│  ├─ npm ci (install deps)            │
│  ├─ npm run lint (validate code)     │
│  ├─ Create .env file (with API URL)  │
│  ├─ npm run build (TypeScript + Vite)│
│  ├─ Create deployment-info.json      │
│  └─ Upload dist/ as artifact         │
└──────────────────────────────────────┘
                ↓
┌──────────────────────────────────────┐
│  Job 2: Deploy (~1-2 min)            │
│  ├─ Download build artifact          │
│  ├─ Setup SSH connection             │
│  ├─ Create backup of current version │
│  ├─ Deploy via rsync (--delete)      │
│  ├─ Set permissions (nginx:nginx)    │
│  ├─ Reload Nginx                     │
│  ├─ Cleanup old backups (keep 5)     │
│  └─ Display deployment info          │
└──────────────────────────────────────┘
                ↓
┌──────────────────────────────────────┐
│  Job 3: Health Check (~15 sec)       │
│  ├─ Wait 10 seconds                  │
│  ├─ Check HTTP response (200/301)    │
│  └─ Notify on failure with rollback  │
└──────────────────────────────────────┘
```

## 🔧 Key Features

### 1. Manual Trigger Only
- No automatic deployments on push/merge
- User explicitly chooses when to deploy
- User selects which branch to deploy
- User selects target environment

### 2. Environment Selection
- **Staging:** Testing environment (http://63.182.249.47)
- **Production:** Live site (https://trve.io)
- Different API URLs per environment

### 3. Automatic Backups
- Backup created before each deployment
- Format: `backup-YYYYMMDD-HHMMSS-{environment}`
- Last 5 backups kept per environment
- Easy rollback procedure

### 4. Health Checks
- Validates deployment success
- Checks HTTP response codes
- Provides rollback instructions on failure

### 5. Deployment Metadata
- Tracks: branch, commit, deployer, timestamp
- Stored in: `/var/www/trve-frontend/deployment-info.json`
- Accessible via SSH or API

## 🛡️ Security Features

- ✅ SSH private key encrypted in GitHub Secrets
- ✅ No secrets in code or logs
- ✅ Nginx runs as unprivileged user
- ✅ EC2 Security Group restricts access
- ✅ Automatic backups for rollback
- ✅ Health checks prevent bad deployments
- ✅ HTTPS for production (via Cloudflare)

## 🚀 Quick Deployment Reference

### Deploy to Staging (for testing)
```bash
gh workflow run "Deploy TRVE Frontend to EC2" \
  -f branch=main \
  -f environment=staging
```

### Deploy to Production (after staging test)
```bash
gh workflow run "Deploy TRVE Frontend to EC2" \
  -f branch=main \
  -f environment=production
```

### Rollback (if needed)
```bash
ssh -i trve-key.pem ec2-user@63.182.249.47
sudo /usr/local/bin/rollback-frontend.sh
sudo /usr/local/bin/rollback-frontend.sh backup-20260208-143022-staging
```

## 📊 Deployment Timeline

**One-time setup:** ~30-45 minutes
- EC2 setup: 20-30 min
- GitHub secrets: 5 min
- First test deployment: 5-10 min

**Regular deployments:** ~3-5 minutes
- Build: 1-2 min
- Deploy: 1-2 min
- Health check: 15 sec

## 📚 Documentation Structure

```
docs/
├── README.md                      # Overview and navigation
├── EC2-SETUP.md                   # One-time EC2 setup (DO THIS FIRST)
├── DEPLOYMENT.md                  # Complete deployment guide
└── DEPLOYMENT-QUICKSTART.md       # Quick reference

.github/
└── workflows/
    └── deploy-frontend.yml        # GitHub Actions workflow

DEPLOYMENT-SETUP-SUMMARY.md        # This file (overview)
```

## ✅ Pre-Deployment Checklist

Before first deployment:
- [ ] EC2 directories created (`/var/www/trve-frontend`, `/var/www/backups`)
- [ ] Nginx configuration added (`/etc/nginx/conf.d/trve-frontend.conf`)
- [ ] Nginx tested and reloaded (`sudo nginx -t && sudo systemctl reload nginx`)
- [ ] rsync installed on EC2 (`sudo yum install -y rsync`)
- [ ] Rollback script created (`/usr/local/bin/rollback-frontend.sh`)
- [ ] All 5 GitHub Secrets added (SSH_PRIVATE_KEY, EC2_HOST, etc.)
- [ ] Workflow file committed and pushed to GitHub
- [ ] EC2 Security Group allows SSH (port 22) and HTTP (port 80)
- [ ] Backend API running on EC2 (port 5000)

## 🆘 Troubleshooting Quick Links

**Issue** → **Solution Location**
- Health check fails → `docs/DEPLOYMENT.md` → Troubleshooting
- Permission denied → `docs/DEPLOYMENT.md` → Troubleshooting
- Nginx 403 → `docs/DEPLOYMENT.md` → Troubleshooting
- SSH timeout → `docs/DEPLOYMENT.md` → Troubleshooting
- Need rollback → `docs/DEPLOYMENT-QUICKSTART.md` → Rollback

## 🎓 Learning Resources

For detailed information, read:
1. **First time:** `docs/EC2-SETUP.md` (EC2 configuration)
2. **Understanding:** `docs/DEPLOYMENT.md` (complete guide)
3. **Regular use:** `docs/DEPLOYMENT-QUICKSTART.md` (quick reference)
4. **Workflow details:** `.github/workflows/deploy-frontend.yml` (source code)

## 📞 Support

**Questions about:**
- **Setup:** Read `docs/EC2-SETUP.md`
- **Deployment:** Read `docs/DEPLOYMENT.md`
- **Quick reference:** Read `docs/DEPLOYMENT-QUICKSTART.md`
- **Troubleshooting:** Read `docs/DEPLOYMENT.md` → Troubleshooting section

**Still stuck?**
1. Check GitHub Actions workflow logs
2. SSH to EC2: `ssh -i trve-key.pem ec2-user@63.182.249.47`
3. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
4. Test manually: `curl http://63.182.249.47`

## 🎉 What's Next?

After completing the setup and first deployment:

1. **Test thoroughly on staging**
   - Deploy feature branches to staging
   - Test all functionality
   - Verify API integration

2. **Deploy to production**
   - After staging validation
   - Use main branch
   - Monitor logs carefully

3. **Establish workflow**
   - Always staging first
   - Code review before production
   - Document deployments (git tags)

4. **Monitor and maintain**
   - Review logs weekly
   - Test rollback monthly
   - Rotate SSH keys quarterly

## 📝 Notes

- **Current branch:** `landing-teaser` - workflow will be available after merge to `main` or push
- **Manual trigger only:** Workflow will NOT run automatically on push/merge
- **Branch flexibility:** Can deploy any branch (main, develop, feature/xyz) to any environment
- **Backup safety:** Automatic backup before every deployment ensures safe rollback
- **Health validation:** Deployment fails if site not accessible after deploy

---

**Created:** 2026-02-08
**For:** TRVE Frontend (AssetRegistry-Web)
**Target:** EC2 instance 63.182.249.47
**Repository:** https://github.com/masaj84/AssetRegistry-Web
