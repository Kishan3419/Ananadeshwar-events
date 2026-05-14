# Deployment to Oracle VPS

This guide explains how to set up automatic CI/CD deployment to your Oracle VPS.

## Prerequisites

- Oracle VPS with Docker and Docker Compose installed
- GitHub account
- SSH access to your VPS

## Setup Steps

### 1. Install Docker & Docker Compose on Oracle VPS

```bash
# SSH into your VPS
ssh -i your-key.pem ubuntu@your-vps-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Configure GitHub Secrets

Add these secrets to your GitHub repository:
- **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret Name | Value | Example |
|---|---|---|
| `ORACLE_VPS_HOST` | Your VPS IP address | `203.0.113.45` |
| `ORACLE_VPS_USER` | SSH username | `ubuntu` or `opc` |
| `ORACLE_VPS_SSH_KEY` | Private SSH key content | (full private key) |
| `ORACLE_VPS_PORT` | SSH port (optional) | `22` (default) |

**To get your SSH private key:**
```bash
cat ~/.ssh/id_rsa
```
Copy the entire output and paste it as the secret value.

### 3. Manual Deployment (First Time)

```bash
# SSH into VPS
ssh -i your-key.pem ubuntu@your-vps-ip

# Clone repository
mkdir -p ~/Ananadeshwar-events
cd ~/Ananadeshwar-events
git clone https://github.com/Kishan3419/Ananadeshwar-events.git .

# Start with Docker Compose
docker-compose up -d --build
```

### 4. Verify Deployment

```bash
# Check if container is running
docker ps

# View logs
docker-compose logs -f

# Access the app
curl http://localhost:8000
# OR open in browser: http://your-vps-ip:8000
```

## Automated Deployment Workflow

Once secrets are configured:

1. **Make changes** to your code locally
2. **Push to main branch**: `git push origin main`
3. **GitHub Actions runs automatically**:
   - Runs tests (HTML/Dockerfile validation)
   - SSH into your VPS
   - Pulls latest code
   - Rebuilds Docker containers
   - Restarts the application

## Monitoring Deployments

- Go to **Actions** tab in your GitHub repo
- View deployment logs in real-time
- Check status of each deployment

## Troubleshooting

### SSH Connection Failed
```bash
# Verify SSH access manually
ssh -i your-key.pem -p 22 ubuntu@your-vps-ip "docker ps"
```

### Docker Permissions
```bash
# On VPS, add user to docker group
sudo usermod -aG docker $USER
```

### Port Already in Use
```bash
# On VPS, kill process on port 8000
sudo lsof -ti:8000 | xargs sudo kill -9

# Or use different port in docker-compose.yml
# Change "8000:8000" to "8080:8000"
```

### View Deployment Logs on VPS
```bash
docker-compose logs -f
```

## Rollback to Previous Version

```bash
# On VPS
cd ~/Ananadeshwar-events
git log --oneline | head -5
git checkout <commit-hash>
docker-compose up -d --build
```

## Security Best Practices

1. ✅ Use SSH keys (not passwords)
2. ✅ Restrict VPS firewall (allow only needed ports)
3. ✅ Rotate SSH keys periodically
4. ✅ Use secrets for sensitive data (never commit)
5. ✅ Enable 2FA on GitHub

## Environment Variables

If you need to pass environment variables:

Edit `docker-compose.yml`:
```yaml
environment:
  - PYTHONUNBUFFERED=1
  - PORT=8000
```

Or create `.env` file on VPS:
```bash
PORT=8000
DEBUG=false
```

## Next Steps

1. Configure GitHub secrets (see step 2)
2. Test manual deployment first (step 3)
3. Push a test commit to trigger CI/CD
4. Monitor the Actions tab
5. Verify app is running on your VPS

---

**Need help?** Check GitHub Actions logs in your repository's Actions tab.
