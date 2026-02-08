# TRVE Frontend Documentation

Welcome to the TRVE Frontend deployment documentation.

## 📖 Documentation Files

### Quick Start
- **[DEPLOYMENT-QUICKSTART.md](DEPLOYMENT-QUICKSTART.md)** - Fast reference for deploying (start here!)

### Setup Guides
- **[EC2-SETUP.md](EC2-SETUP.md)** - One-time EC2 instance setup instructions
- **[EC2-SETUP-CHECKLIST.md](EC2-SETUP-CHECKLIST.md)** - Step-by-step setup checklist
- **[GITHUB-SECRETS.md](GITHUB-SECRETS.md)** - Complete GitHub Secrets configuration guide

### Deployment Guides
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide with troubleshooting

### Workflow
- **[../.github/workflows/deploy-frontend.yml](../.github/workflows/deploy-frontend.yml)** - GitHub Actions workflow definition

## 🎯 Getting Started

### First Time Setup
1. Read **EC2-SETUP.md** - Set up EC2 instance and GitHub Secrets
2. Read **DEPLOYMENT.md** - Understand the deployment process
3. Use **DEPLOYMENT-QUICKSTART.md** - Deploy your first version

### Regular Deployments
Use **DEPLOYMENT-QUICKSTART.md** for quick reference on deploying updates.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Actions Workflow                   │
│                                                              │
│  1. Build Job                                                │
│     ├─ Checkout branch (selected by user)                   │
│     ├─ Install dependencies (npm ci)                        │
│     ├─ Lint code (npm run lint)                             │
│     ├─ Create env file (.env.production or .env.staging)    │
│     ├─ Build (npm run build → dist/)                        │
│     ├─ Create deployment-info.json                          │
│     └─ Upload artifact                                       │
│                                                              │
│  2. Deploy Job                                               │
│     ├─ Download artifact                                     │
│     ├─ Setup SSH                                             │
│     ├─ Create backup (before deploying)                     │
│     ├─ rsync files to EC2                                   │
│     ├─ Set permissions (nginx:nginx)                        │
│     ├─ Reload Nginx                                          │
│     └─ Cleanup old backups                                   │
│                                                              │
│  3. Health Check Job                                         │
│     ├─ Wait 10 seconds                                       │
│     ├─ Check HTTP response (200/301/302)                    │
│     └─ Notify on failure                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      EC2 Instance                            │
│               (63.182.249.47 - Amazon Linux 2023)           │
│                                                              │
│  Nginx                                                       │
│  ├─ Port 80 (HTTP)                                           │
│  ├─ Serves: /var/www/trve-frontend                          │
│  ├─ Proxy: /api/* → http://localhost:5000/api/*            │
│  └─ Config: /etc/nginx/conf.d/trve-frontend.conf           │
│                                                              │
│  Backups                                                     │
│  └─ /var/www/backups/trve-frontend/                        │
│      ├─ backup-20260208-143022-staging                      │
│      ├─ backup-20260208-121530-staging                      │
│      └─ backup-20260207-184500-production                   │
│                                                              │
│  Backend API                                                 │
│  └─ Port 5000 (ASP.NET Core)                                │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Security

- SSH private key stored in GitHub Secrets (encrypted)
- EC2 Security Group restricts access
- Nginx runs as unprivileged user (nginx:nginx)
- Automatic backups before deployments
- Health checks validate deployments
- HTTPS for production (via Cloudflare)

## 🌐 Environments

### Staging
- **URL:** http://63.182.249.47
- **API:** http://63.182.249.47:5000/api
- **Purpose:** Testing before production

### Production
- **URL:** https://trve.io
- **API:** https://trve.io/api
- **Purpose:** Live production site

## 🛠️ Tools & Technologies

- **Frontend:** React 19.2 + TypeScript + Vite 7.2.4
- **CI/CD:** GitHub Actions
- **Server:** Amazon Linux 2023
- **Web Server:** Nginx
- **Deployment:** rsync over SSH
- **Backend:** ASP.NET Core 8 (port 5000)

## 📞 Support

### Common Issues
See **DEPLOYMENT.md** → Troubleshooting section for solutions to:
- Health check failures
- SSH connection timeouts
- Permission denied errors
- Nginx 403 Forbidden
- CORS issues
- Assets not loading

### Rollback
See **DEPLOYMENT-QUICKSTART.md** → Rollback section for quick recovery.

### Need Help?
1. Check workflow logs in GitHub Actions
2. SSH to EC2 and check Nginx logs
3. Review documentation files
4. Test manually with curl commands

## 📝 Deployment Best Practices

1. **Always deploy to staging first**
2. **Test thoroughly on staging**
3. **Monitor workflow logs**
4. **Keep backups** (automated)
5. **Document major deployments** (git tags)
6. **Review code before production**
7. **Have rollback plan ready**

## 🔄 Deployment Frequency

- **Staging:** As often as needed for testing
- **Production:** After thorough staging validation
- **Hotfixes:** Deploy to staging first, then production

## 📊 Deployment Metrics

- **Build time:** ~1-2 minutes
- **Deploy time:** ~1-2 minutes
- **Health check:** ~15 seconds
- **Total time:** ~3-5 minutes
- **Backup retention:** 5 latest per environment
- **Artifact retention:** 30 days

## 🗺️ Workflow Diagram

```
User triggers workflow (manual)
    ↓
Select branch + environment
    ↓
[Build Job] - Checkout, install, lint, build
    ↓
Upload artifact
    ↓
[Deploy Job] - Backup, rsync, permissions, reload Nginx
    ↓
[Health Check Job] - Verify site is accessible
    ↓
Success ✅ or Failure ❌ (with rollback instructions)
```

## 📅 Maintenance

### Weekly
- Review deployment logs
- Check disk space on EC2
- Verify backups are being created

### Monthly
- Review and cleanup old backups
- Test rollback procedure
- Review Nginx logs for issues

### Quarterly
- Rotate SSH keys
- Review security group rules
- Update Node.js version (if needed)
- Review and update documentation

## 🎓 Learning Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

## ✅ Pre-Deployment Checklist

Before deploying to production:
- [ ] Code reviewed and approved
- [ ] Tests passing locally
- [ ] Deployed and tested on staging
- [ ] API endpoints verified
- [ ] Environment variables correct
- [ ] No console errors in browser
- [ ] All features working as expected
- [ ] Backend API is running and accessible
- [ ] Rollback plan ready
- [ ] Team notified of deployment

## 🚨 Emergency Procedures

### If Production is Down
1. Check GitHub Actions workflow logs
2. SSH to EC2 and check Nginx status: `sudo systemctl status nginx`
3. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
4. If needed, rollback: `sudo /usr/local/bin/rollback-frontend.sh`
5. Verify rollback: Test site in browser
6. Notify team

### If Deployment Fails
1. Review workflow logs for specific error
2. Fix issue locally
3. Test locally: `npm run build`
4. Commit fix
5. Re-run workflow

### If Health Check Fails
1. Check if site is actually working (might be false negative)
2. Review health check logs in workflow
3. Test manually: `curl http://63.182.249.47` or `curl https://trve.io`
4. If site is down, rollback immediately
