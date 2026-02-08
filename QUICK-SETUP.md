# Quick Setup Guide - TRVE Frontend CI/CD

Najszybsza ścieżka do uruchomienia deploymentu.

## ⚡ 3 Kroki do Działającego Deploymentu

### Krok 1: EC2 Setup (20-30 min)

**SSH do EC2:**
```bash
ssh -i trve-key.pem ec2-user@63.182.249.47
```

**Uruchom wszystko jednocześnie:**
```bash
# 1. Katalogi
sudo mkdir -p /var/www/trve-frontend /var/www/backups/trve-frontend
sudo chown -R ec2-user:nginx /var/www/trve-frontend /var/www/backups
sudo chmod -R 755 /var/www/trve-frontend /var/www/backups

# 2. Nginx config
sudo tee /etc/nginx/conf.d/trve-frontend.conf << 'EOF'
server {
    listen 80;
    server_name trve.io www.trve.io;
    root /var/www/trve-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, must-revalidate";
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /health {
        access_log off;
        return 200 "OK";
        add_header Content-Type text/plain;
    }
}
EOF

# 3. Test i reload Nginx
sudo nginx -t && sudo systemctl reload nginx

# 4. Install rsync
sudo yum install -y rsync

# 5. Rollback script
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

sudo chmod +x /usr/local/bin/rollback-frontend.sh

# 6. Test
echo "<h1>EC2 Setup Complete</h1>" | sudo tee /var/www/trve-frontend/index.html
sudo chown nginx:nginx /var/www/trve-frontend/index.html
curl http://localhost/
```

**Jeśli ostatnie curl pokazało HTML - EC2 gotowe! ✅**

---

### Krok 2: GitHub Secrets (5 min)

**Idź do:** https://github.com/masaj84/AssetRegistry-Web/settings/secrets/actions

**Dodaj 7 secretów:**

#### 1. EC2_SSH_KEY
```bash
# Na lokalnej maszynie
cd D:\AI\_AWS\TRVE
cat trve-key.pem
# Skopiuj CAŁOŚĆ (z BEGIN/END) → GitHub Secret
```

#### 2-5. Podstawowe
| Nazwa | Wartość |
|-------|---------|
| `EC2_HOST` | `63.182.249.47` |
| `EC2_USER` | `ec2-user` |
| `VITE_API_URL_PRODUCTION` | `https://trve.io/api` |
| `VITE_API_URL_STAGING` | `http://63.182.249.47:5000/api` |

#### 6-7. Backend (opcjonalne, na przyszłość)
| Nazwa | Wartość |
|-------|---------|
| `DB_HOST` | `<twój-rds-endpoint>.rds.amazonaws.com` |
| `DB_PASSWORD` | `<hasło-do-RDS>` |

**Sprawdź:** Czy wszystkie 7 secretów są na liście? ✅

---

### Krok 3: Push Workflow (2 min)

```bash
cd D:\AI\Cargoo_v1\AssetRegistry-Web

# Add all
git add .github/ docs/ *.md

# Commit
git commit -m "feat: Add GitHub Actions CI/CD workflow

- Manual trigger with branch/environment selection
- Automatic backups and health checks
- Complete documentation and setup guides
- Support for 7 GitHub Secrets (frontend + backend)"

# Push
git push origin landing-teaser
```

---

## 🚀 Pierwszy Deployment

### Web UI (Łatwiejsze)

1. Otwórz: https://github.com/masaj84/AssetRegistry-Web/actions
2. Kliknij: **"Deploy TRVE Frontend to EC2"**
3. Kliknij: **"Run workflow"**
4. Wybierz:
   - Branch: `landing-teaser` (lub `main`)
   - Environment: `staging`
5. Kliknij: **"Run workflow"** (zielony przycisk)
6. Obserwuj logi (3-5 min)
7. Test: http://63.182.249.47

### CLI (Szybsze)

```bash
gh workflow run "Deploy TRVE Frontend to EC2" \
  -f branch=landing-teaser \
  -f environment=staging
```

---

## ✅ Weryfikacja

### 1. Sprawdź stronę
```
http://63.182.249.47  (staging)
https://trve.io        (production)
```

### 2. Sprawdź deployment info
```bash
ssh -i trve-key.pem ec2-user@63.182.249.47
cat /var/www/trve-frontend/deployment-info.json
```

Powinieneś zobaczyć JSON z informacjami o deploymencie.

### 3. Test API proxy
```bash
curl http://63.182.249.47/api/health  # Powinno działać
```

---

## 🔧 Backend Configuration (Opcjonalne)

**Jeśli masz .NET backend na EC2:**

```bash
ssh -i trve-key.pem ec2-user@63.182.249.47

# Edit systemd service
sudo nano /etc/systemd/system/trve-backend.service
```

**Dodaj w sekcji [Service]:**
```ini
Environment="ASPNETCORE_ENVIRONMENT=Production"
Environment="ConnectionStrings__DefaultConnection=Host=<RDS_ENDPOINT>;Port=5432;Database=trvedb;Username=trveadmin;Password=<DB_PASSWORD>"
```

**Restart:**
```bash
sudo systemctl daemon-reload
sudo systemctl restart trve-backend
sudo systemctl status trve-backend

# Test
curl http://localhost:5000/api/health
```

---

## 🔄 Rollback (Jeśli Coś Pójdzie Nie Tak)

```bash
ssh -i trve-key.pem ec2-user@63.182.249.47

# Lista backupów
sudo /usr/local/bin/rollback-frontend.sh

# Rollback do konkretnego
sudo /usr/local/bin/rollback-frontend.sh backup-20260208-143022-staging
```

---

## 📚 Więcej Informacji

- **Szybki start:** `docs/DEPLOYMENT-QUICKSTART.md`
- **Pełna instrukcja:** `docs/DEPLOYMENT.md`
- **Setup EC2:** `docs/EC2-SETUP-CHECKLIST.md`
- **Sekrety:** `docs/GITHUB-SECRETS.md`

---

## 🆘 Troubleshooting Szybkie Poprawki

### Nginx 403
```bash
sudo chown -R nginx:nginx /var/www/trve-frontend
sudo systemctl reload nginx
```

### Nie działa SSH w workflow
- Sprawdź czy `EC2_SSH_KEY` ma całą zawartość klucza (z BEGIN/END)
- Sprawdź Security Group EC2 (port 22 otwarty)

### Health check fails
```bash
# Test ręcznie
curl -I http://63.182.249.47

# Sprawdź Nginx
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### Backend nie działa
```bash
# Sprawdź status
sudo systemctl status trve-backend

# Sprawdź logi
sudo journalctl -u trve-backend -n 50 --no-pager

# Test połączenia z bazą
curl http://localhost:5000/api/health
```

---

## 🎯 To Wszystko!

Po wykonaniu tych 3 kroków masz działający CI/CD dla frontendu z:
- ✅ Manualnym triggerem
- ✅ Wyborem brancha i środowiska
- ✅ Automatycznymi backupami
- ✅ Health checkami
- ✅ Rollbackiem w razie problemów

**Czas:** ~30-45 min setup + 3-5 min per deployment

**Gotowy?** Uruchom pierwszy deployment! 🚀
