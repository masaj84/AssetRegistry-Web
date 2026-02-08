# Deployment Quick Start

Quick reference for deploying TRVE frontend to EC2.

## 🚀 Deploy Now (3 Steps)

### 1. Go to GitHub Actions
```
https://github.com/masaj84/AssetRegistry-Web/actions
```

### 2. Select Workflow
- Click **"Deploy TRVE Frontend to EC2"**
- Click **"Run workflow"** button

### 3. Configure & Deploy
- **Branch:** `main` (or any branch)
- **Environment:** `staging` or `production`
- Click **"Run workflow"**

**Done!** Deployment takes ~3-5 minutes.

---

## 🧪 Test After Deployment

### Staging
```
http://63.182.249.47
```

### Production
```
https://trve.io
```

---

## 🔄 Rollback (If Needed)

```bash
# 1. SSH to EC2
ssh -i trve-key.pem ec2-user@63.182.249.47

# 2. List backups
sudo /usr/local/bin/rollback-frontend.sh

# 3. Rollback to specific backup
sudo /usr/local/bin/rollback-frontend.sh backup-20260208-143022-staging
```

---

## ✅ Recommended Workflow

**For new features:**
```
1. Create feature branch: feature/new-dashboard
2. Deploy to staging: branch=feature/new-dashboard, env=staging
3. Test on staging
4. Merge to main
5. Deploy to production: branch=main, env=production
```

**For hotfixes:**
```
1. Deploy to staging first: branch=main, env=staging
2. Verify fix works
3. Deploy to production: branch=main, env=production
```

---

## 📋 GitHub CLI Commands

```bash
# Deploy main to staging
gh workflow run "Deploy TRVE Frontend to EC2" -f branch=main -f environment=staging

# Deploy main to production
gh workflow run "Deploy TRVE Frontend to EC2" -f branch=main -f environment=production

# View recent runs
gh run list --workflow="Deploy TRVE Frontend to EC2"

# View logs
gh run view --log
```

---

## 🔍 Troubleshooting Quick Fixes

### Site shows 403 Forbidden
```bash
ssh -i trve-key.pem ec2-user@63.182.249.47
sudo chown -R nginx:nginx /var/www/trve-frontend
sudo systemctl reload nginx
```

### Assets not loading (404)
```bash
ssh -i trve-key.pem ec2-user@63.182.249.47
sudo find /var/www/trve-frontend -type f -exec chmod 644 {} \;
sudo find /var/www/trve-frontend -type d -exec chmod 755 {} \;
```

### Check Nginx logs
```bash
ssh -i trve-key.pem ec2-user@63.182.249.47
sudo tail -f /var/log/nginx/error.log
```

---

## 📚 Full Documentation

- **Setup:** `docs/EC2-SETUP.md` + `docs/EC2-SETUP-CHECKLIST.md`
- **Secrets:** `docs/GITHUB-SECRETS.md` (7 required secrets)
- **Deployment:** `docs/DEPLOYMENT.md`
- **Workflow:** `.github/workflows/deploy-frontend.yml`

---

## 🆘 Emergency Contacts

**Health Check Failed?**
1. Check workflow logs
2. Test manually: `curl http://63.182.249.47`
3. Rollback if needed

**Need Help?**
- Review logs in GitHub Actions
- Check Nginx logs on EC2
- Use rollback script
