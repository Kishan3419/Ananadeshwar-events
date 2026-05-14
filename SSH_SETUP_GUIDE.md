# SSH Setup Guide for GitHub

## Step 1: Check if SSH Key Already Exists

```bash
ls -la ~/.ssh/
```

If you see `id_rsa` and `id_rsa.pub`, you already have keys. Skip to **Step 3**.

---

## Step 2: Generate SSH Key (If Needed)

```bash
ssh-keygen -t rsa -b 4096 -C "kishan777kumar@gmail.com"
```

**Press Enter** for all prompts (use defaults):
- File location: just press Enter
- Passphrase: just press Enter twice

**Output:**
```
Your public key has been saved in /home/ubuntu/.ssh/id_rsa.pub
Your private key has been saved in /home/ubuntu/.ssh/id_rsa
```

---

## Step 3: Display Your Public Key

```bash
cat ~/.ssh/id_rsa.pub
```

**Copy the entire output** (starts with `ssh-rsa` and ends with your email)

---

## Step 4: Add SSH Key to GitHub

1. Go to: https://github.com/settings/keys
2. Click **New SSH key**
3. **Title:** Enter something like `My Linux Machine`
4. **Key type:** Select `Authentication Key`
5. **Key:** Paste your public key (from Step 3)
6. Click **Add SSH key**

---

## Step 5: Test SSH Connection to GitHub

```bash
ssh -T git@github.com
```

**Expected Output:**
```
Hi Kishan3419! You've successfully authenticated, but GitHub does not provide shell access.
```

✅ **If you see this, SSH is working!**

---

## Step 6: Update Your Git Remote (Important!)

Currently your repo uses HTTPS. Switch to SSH:

```bash
cd /home/ubuntu/Projects/cloud/Clints/Ananadeshwar-events-main

# Check current remote
git remote -v

# Change from HTTPS to SSH
git remote set-url origin git@github.com:Kishan3419/Ananadeshwar-events.git

# Verify it changed
git remote -v
```

**Should show:**
```
origin  git@github.com:Kishan3419/Ananadeshwar-events.git (fetch)
origin  git@github.com:Kishan3419/Ananadeshwar-events.git (push)
```

---

## Step 7: Test Git Push

```bash
cd /home/ubuntu/Projects/cloud/Clints/Ananadeshwar-events-main
git log -1
git push origin main
```

✅ **If push succeeds without asking for password, SSH is working perfectly!**

---

## Troubleshooting

### Error: "Permission denied (publickey)"
```bash
# Verify SSH key permissions
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub

# Check SSH agent
ssh-add ~/.ssh/id_rsa

# Test again
ssh -T git@github.com
```

### Error: "Could not open a connection to your authentication agent"
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
ssh -T git@github.com
```

### Error: "Host key verification failed"
```bash
ssh-keyscan -H github.com >> ~/.ssh/known_hosts
ssh -T git@github.com
```

---

## Now You Can:

✅ Push code without entering password
✅ Use GitHub Actions to deploy automatically
✅ Use SSH keys for VPS deployment too

---

## Optional: Setup SSH for Oracle VPS

Same concept! Generate SSH key for VPS:

```bash
# Generate separate key for VPS (optional)
ssh-keygen -t rsa -b 4096 -C "oracle-vps" -f ~/.ssh/oracle_vps_key

# Display it
cat ~/.ssh/oracle_vps_key.pub

# On VPS, add it to authorized_keys
ssh ubuntu@your-vps-ip
cat >> ~/.ssh/authorized_keys << EOF
paste-your-public-key-here
EOF
```

Then add to GitHub Secrets:
- `ORACLE_VPS_SSH_KEY`: Output of `cat ~/.ssh/oracle_vps_key`

---

## Summary

| Step | Command | Result |
|------|---------|--------|
| 1 | `ls -la ~/.ssh/` | Check if keys exist |
| 2 | `ssh-keygen ...` | Generate new keys |
| 3 | `cat ~/.ssh/id_rsa.pub` | Get public key |
| 4 | GitHub Settings → SSH | Add public key to GitHub |
| 5 | `ssh -T git@github.com` | Test connection |
| 6 | `git remote set-url ...` | Update git remote to SSH |
| 7 | `git push origin main` | Test push without password |

---

**Need help with any step? Let me know!**
