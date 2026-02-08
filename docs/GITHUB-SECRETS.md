# GitHub Secrets Configuration

Complete guide for configuring GitHub Secrets for TRVE deployment (Frontend + Backend).

## Location

Add secrets at: `https://github.com/masaj84/AssetRegistry-Web/settings/secrets/actions`

## Required Secrets

### Frontend Deployment Secrets

| Secret Name | Value | Usage | Required For |
|------------|-------|-------|--------------|
| `EC2_SSH_KEY` | Contents of `trve-key.pem` | SSH authentication to EC2 | Frontend & Backend deployment |
| `EC2_HOST` | `63.182.249.47` | EC2 instance IP address | Frontend & Backend deployment |
| `EC2_USER` | `ec2-user` | SSH username | Frontend & Backend deployment |
| `VITE_API_URL_PRODUCTION` | `https://trve.io/api` | Production API endpoint for React app | Frontend build (production) |
| `VITE_API_URL_STAGING` | `http://63.182.249.47:5000/api` | Staging API endpoint for React app | Frontend build (staging) |

### Backend Deployment Secrets

| Secret Name | Value | Usage | Required For |
|------------|-------|-------|--------------|
| `DB_HOST` | `<RDS_ENDPOINT>` | PostgreSQL RDS endpoint | Backend deployment |
| `DB_PASSWORD` | `<RDS_PASSWORD>` | Password for `trveadmin` user | Backend deployment |

## Adding Secrets to GitHub

### Step 1: Navigate to Repository Secrets

1. Go to: `https://github.com/masaj84/AssetRegistry-Web`
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret** button

### Step 2: Add Each Secret

#### 1. EC2_SSH_KEY (SSH Private Key)

```bash
# On your local machine
cd D:\AI\_AWS\TRVE
cat trve-key.pem
```

**Copy the entire output including headers:**
```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
... (multiple lines) ...
-----END RSA PRIVATE KEY-----
```

**In GitHub:**
- Name: `EC2_SSH_KEY`
- Secret: Paste the entire key content
- Click **Add secret**

#### 2. EC2_HOST (Server IP Address)

**In GitHub:**
- Name: `EC2_HOST`
- Secret: `63.182.249.47`
- Click **Add secret**

#### 3. EC2_USER (SSH Username)

**In GitHub:**
- Name: `EC2_USER`
- Secret: `ec2-user`
- Click **Add secret**

#### 4. VITE_API_URL_PRODUCTION (Production API)

**In GitHub:**
- Name: `VITE_API_URL_PRODUCTION`
- Secret: `https://trve.io/api`
- Click **Add secret**

**Note:** This will be used when building frontend for production environment.

#### 5. VITE_API_URL_STAGING (Staging API)

**In GitHub:**
- Name: `VITE_API_URL_STAGING`
- Secret: `http://63.182.249.47:5000/api`
- Click **Add secret**

**Note:** This will be used when building frontend for staging environment.

#### 6. DB_HOST (PostgreSQL RDS Endpoint)

**Get RDS endpoint from AWS Console:**
```
RDS → Databases → trvedb → Connectivity & security → Endpoint
```

**In GitHub:**
- Name: `DB_HOST`
- Secret: `<your-rds-endpoint>.rds.amazonaws.com`
- Example: `trvedb.c1234567890.us-east-1.rds.amazonaws.com`
- Click **Add secret**

**Note:** Used for backend API deployment to configure database connection.

#### 7. DB_PASSWORD (Database Password)

**In GitHub:**
- Name: `DB_PASSWORD`
- Secret: `<your-rds-password>`
- Click **Add secret**

**Important:** This is the password for the `trveadmin` PostgreSQL user.

### Step 3: Verify Secrets

After adding all secrets, verify the list shows:
- ✅ EC2_SSH_KEY
- ✅ EC2_HOST
- ✅ EC2_USER
- ✅ VITE_API_URL_PRODUCTION
- ✅ VITE_API_URL_STAGING
- ✅ DB_HOST
- ✅ DB_PASSWORD

**Total: 7 secrets**

## EC2 Environment Variables

These variables need to be configured on the EC2 instance for the .NET backend API.

### For Backend API (.NET)

SSH to EC2 and configure environment variables:

```bash
ssh -i trve-key.pem ec2-user@63.182.249.47
```

#### Option 1: systemd Service File (Recommended)

If running backend as systemd service:

```bash
# Edit service file
sudo nano /etc/systemd/system/trve-backend.service
```

Add environment variables in `[Service]` section:

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

**Reload and restart:**
```bash
sudo systemctl daemon-reload
sudo systemctl restart trve-backend
sudo systemctl status trve-backend
```

#### Option 2: appsettings.Production.json

Create production configuration file:

```bash
sudo nano /var/www/trve-backend/appsettings.Production.json
```

Add configuration:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=<RDS_ENDPOINT>;Port=5432;Database=trvedb;Username=trveadmin;Password=<DB_PASSWORD>"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

Set environment variable:

```bash
export ASPNETCORE_ENVIRONMENT=Production
```

#### Option 3: Environment File

Create `.env` file for backend:

```bash
sudo nano /var/www/trve-backend/.env
```

Add variables:

```bash
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=Host=<RDS_ENDPOINT>;Port=5432;Database=trvedb;Username=trveadmin;Password=<DB_PASSWORD>
```

**Load environment file** (add to systemd service or startup script):

```bash
set -a
source /var/www/trve-backend/.env
set +a
```

### Environment Variables Explained

#### ASPNETCORE_ENVIRONMENT

- **Value:** `Production`
- **Purpose:** Sets ASP.NET Core environment mode
- **Effects:**
  - Disables detailed error pages
  - Enables production optimizations
  - Loads `appsettings.Production.json`

#### ConnectionStrings__DefaultConnection

- **Format:** `Host=<RDS_ENDPOINT>;Port=5432;Database=trvedb;Username=trveadmin;Password=<DB_PASSWORD>`
- **Purpose:** PostgreSQL connection string for Entity Framework Core
- **Components:**
  - **Host:** RDS endpoint (from `DB_HOST` secret)
  - **Port:** `5432` (PostgreSQL default)
  - **Database:** `trvedb`
  - **Username:** `trveadmin`
  - **Password:** From `DB_PASSWORD` secret

**Example:**
```
Host=trvedb.c1234567890.us-east-1.rds.amazonaws.com;Port=5432;Database=trvedb;Username=trveadmin;Password=MySecurePassword123
```

### Verify Backend Configuration

After configuring environment variables:

```bash
# Check if backend is running
sudo systemctl status trve-backend

# Test database connectivity
curl http://localhost:5000/api/health

# Check logs
sudo journalctl -u trve-backend -n 50 --no-pager

# Check if environment is Production
curl http://localhost:5000/api/version  # Should NOT show detailed errors
```

## Security Best Practices

### GitHub Secrets

- ✅ **Never commit secrets to repository**
- ✅ **Use GitHub Secrets for all sensitive data**
- ✅ **Secrets are encrypted at rest**
- ✅ **Secrets are masked in workflow logs**
- ✅ **Rotate secrets regularly** (every 90 days)
- ✅ **Limit secret access** to repository maintainers only

### EC2 Environment Variables

- ✅ **Never expose database password in logs**
- ✅ **Use restrictive file permissions** for `.env` files (600)
- ✅ **Store credentials in systemd service** (encrypted by systemd)
- ✅ **Use RDS security groups** to limit database access
- ✅ **Enable SSL for database connections** (add `SslMode=Require`)

### RDS Database

- ✅ **Use strong passwords** (min 16 characters, mixed case, numbers, symbols)
- ✅ **Enable automated backups**
- ✅ **Use security groups** to restrict access (only EC2 instance)
- ✅ **Enable encryption at rest**
- ✅ **Enable CloudWatch monitoring**
- ✅ **Regular security audits**

## Troubleshooting

### Secret Not Available in Workflow

**Symptom:** Workflow fails with "secret not found" or empty value

**Solution:**
1. Verify secret name matches exactly (case-sensitive)
2. Check secret is added to repository (not organization)
3. Re-add secret if recently deleted
4. Check repository permissions

### EC2 Cannot Connect to Database

**Symptom:** Backend API logs show "could not connect to server"

**Solution:**
```bash
# Test RDS connectivity from EC2
telnet <RDS_ENDPOINT> 5432

# Check RDS security group allows EC2
# RDS Security Group → Inbound Rules → PostgreSQL (5432) from EC2 Security Group

# Verify connection string format
echo $ConnectionStrings__DefaultConnection
```

### Backend Shows Development Error Pages

**Symptom:** Detailed stack traces visible in browser

**Solution:**
```bash
# Check environment variable
echo $ASPNETCORE_ENVIRONMENT  # Should be "Production"

# Set explicitly
export ASPNETCORE_ENVIRONMENT=Production

# Restart backend
sudo systemctl restart trve-backend
```

### Permission Denied for .env File

**Symptom:** Backend cannot read `.env` file

**Solution:**
```bash
# Set correct permissions
sudo chown ec2-user:ec2-user /var/www/trve-backend/.env
sudo chmod 600 /var/www/trve-backend/.env

# Verify
ls -la /var/www/trve-backend/.env
```

## Secret Rotation Schedule

### Every 90 Days

- [ ] Rotate `EC2_SSH_KEY`
  1. Generate new key pair in AWS
  2. Update EC2 instance
  3. Update GitHub Secret
  4. Test deployment
  5. Delete old key

- [ ] Rotate `DB_PASSWORD`
  1. Change RDS master password
  2. Update GitHub Secret
  3. Update EC2 environment variables
  4. Restart backend API
  5. Test database connectivity

### After Security Incident

- [ ] Immediately rotate all secrets
- [ ] Review access logs
- [ ] Audit repository access
- [ ] Update security policies

## Secrets Usage Matrix

| Secret | Used By | Environment | Purpose |
|--------|---------|-------------|---------|
| EC2_SSH_KEY | Frontend workflow | staging, production | SSH to EC2 for deployment |
| EC2_HOST | Frontend workflow | staging, production | Target server address |
| EC2_USER | Frontend workflow | staging, production | SSH username |
| VITE_API_URL_PRODUCTION | Frontend build | production | React app API endpoint |
| VITE_API_URL_STAGING | Frontend build | staging | React app API endpoint |
| DB_HOST | Backend workflow* | production | Database endpoint |
| DB_PASSWORD | Backend workflow* | production | Database authentication |

\* Backend workflow not yet implemented (future enhancement)

## Next Steps

After configuring all secrets:

1. ✅ Verify all 7 secrets are added to GitHub
2. ✅ Configure EC2 environment variables for backend
3. ✅ Test backend database connectivity
4. ✅ Run frontend deployment workflow
5. ✅ Verify frontend can connect to backend API

## Support

**Issues with secrets?**
- Check GitHub docs: https://docs.github.com/en/actions/security-guides/encrypted-secrets
- Verify secret names match workflow file exactly
- Test SSH connectivity manually before running workflow

**Issues with backend?**
- Check backend logs: `sudo journalctl -u trve-backend -f`
- Test database connection: `psql -h <RDS_ENDPOINT> -U trveadmin -d trvedb`
- Verify environment variables: `systemctl show trve-backend | grep Environment`
