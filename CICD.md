# CI/CD Pipeline for RJ Events

## Overview
This project uses **GitHub Actions** for continuous integration and automatic deployment to **Oracle VPS**. The pipeline automatically runs on every push to the main branch.

## Deployment Architecture

```
Your Code → GitHub Push → GitHub Actions → Test & Validate → SSH Deploy to Oracle VPS
```

## Pipeline Stages

### 1. **Validate & Lint Code** ✓
- Validates HTML syntax
- Validates Dockerfile
- Runs on all pushes and pull requests
- Ensures code quality before deploying

### 2. **Deploy to Oracle VPS** 🚀
- SSH into your Oracle VPS
- Git pull latest code
- Docker Compose builds and restarts containers
- Live within seconds
- Only deploys on `main` branch pushes

## Quick Start Setup (5 minutes)

### Step 1: Add GitHub Secrets

**Go to:** Your GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these 4 secrets:

| Secret Name | Value | Example |
|---|---|---|
| `ORACLE_VPS_HOST` | Your VPS IP address | `203.0.113.45` |
| `ORACLE_VPS_USER` | SSH username | `ubuntu` or `opc` |
| `ORACLE_VPS_SSH_KEY` | Private SSH key | (copy entire output of `cat ~/.ssh/id_rsa`) |
| `ORACLE_VPS_PORT` | SSH port (optional) | `22` (default) |

**To get your SSH private key:**
```bash
cat ~/.ssh/id_rsa
```
Copy the entire output (including BEGIN and END lines) and paste as secret value.

### Step 2: Prepare Oracle VPS

SSH into your VPS and run:

```bash
ssh -i your-key.pem ubuntu@your-vps-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version && docker-compose --version
```

### Step 3: Manual Test Deployment

```bash
# On your VPS
mkdir -p ~/Ananadeshwar-events && cd ~/Ananadeshwar-events
git clone https://github.com/Kishan3419/Ananadeshwar-events.git .
docker-compose up -d --build

# Check if running
docker ps
docker-compose logs
```

Access the app: `http://your-vps-ip:8000`

### Step 4: Trigger Automated Deployment

```bash
# From your local machine
git add .
git commit -m "Add CI/CD pipeline"
git push origin main
```

**Watch deployment in real-time:**
1. Go to your GitHub repo → **Actions** tab
2. Click on the workflow run
3. View live logs of SSH deployment

## Workflow Files

- **Main Pipeline:** `.github/workflows/deploy-to-oracle-vps.yml`
- **Deployment Guide:** `DEPLOYMENT.md`

## What Happens on Each Push

1. ✅ Code syntax is validated
2. ✅ Docker file is checked
3. ✅ SSH connection established to VPS
4. ✅ Latest code is pulled via Git
5. ✅ Docker containers are rebuilt
6. ✅ Application restarts (zero downtime)
7. ✅ Live on your domain/IP

## Viewing Deployment Status

**In GitHub:**
- Actions tab shows all deployment runs
- Click any run to see real-time logs
- Green ✅ = Success, Red ❌ = Failed

**On VPS:**
```bash
# View running containers
docker ps

# View logs
docker-compose logs -f

# View specific logs
docker logs anandeshwar-events
```

## Troubleshooting

**Deployment Failed?**
1. Check Actions tab for error logs
2. Verify all 4 secrets are set correctly
3. Test SSH manually:
   ```bash
   ssh -i your-key.pem -p 22 ubuntu@your-vps-ip "docker ps"
   ```

**SSH Connection Timeout?**
1. Verify VPS IP is correct
2. Check firewall allows SSH (port 22)
3. Verify key file permissions: `chmod 600 ~/.ssh/id_rsa`

**Docker Container Won't Start?**
```bash
# On VPS - check logs
docker-compose logs anandeshwar-events

# Restart containers
docker-compose down
docker-compose up -d --build

# Check port not in use
sudo lsof -i :8000
```

**Changes Not Reflecting?**
1. Hard refresh browser (Ctrl+Shift+R)
2. Check deployment completed in Actions tab
3. View VPS logs: `docker-compose logs -f`

## Environment Variables

To add environment variables, edit `.env` on VPS:

```bash
ssh -i key.pem ubuntu@your-vps-ip
cd ~/Ananadeshwar-events
cat > .env << EOF
PORT=8000
DEBUG=false
EOF
```

Or add to `docker-compose.yml` environment section.

## Rollback to Previous Version

```bash
# On VPS
cd ~/Ananadeshwar-events
git log --oneline | head -10
git checkout <commit-hash>
docker-compose up -d --build
```

## Security Best Practices

✅ Use SSH keys (never passwords)  
✅ Restrict firewall to needed ports  
✅ Rotate SSH keys monthly  
✅ Never commit secrets  
✅ Enable 2FA on GitHub  
✅ Review Actions logs regularly  

## Need Help?

See `DEPLOYMENT.md` for detailed setup guide.

Check GitHub Actions logs for deployment errors.

Test SSH connection manually before setting up CI/CD.
```

## Trigger the Pipeline

The pipeline runs automatically on:
- ✅ Push to `main` branch
- ✅ Push to `develop` branch  
- ✅ Pull requests to `main`

View runs: **Actions** tab on GitHub

## Local Testing

Before pushing, you can test locally:

```bash
# Run locally with Python
python -m http.server 8000

# Or with Docker
docker-compose up --build
```

## Next Steps

1. ✅ Push this workflow file to GitHub
2. ✅ Go to repo Settings → Pages
3. ✅ Select `gh-pages` branch as source
4. ✅ View your live site at GitHub Pages URL

## Monitoring

- Check **Actions** tab for workflow status
- All jobs have logging for debugging
- Failed jobs will send notifications (if enabled)

---

**Last Updated:** May 14, 2026
