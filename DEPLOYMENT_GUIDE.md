# 🚀 Wealth Management — FREE Google Cloud Deployment Guide
## Stack: Cloud Run · Neon.tech (FREE PostgreSQL) · Upstash (FREE Redis)
## 💰 Total Cost: $0/month

---

## 📁 What's in This Folder

```
wealth-management/
├── backend/
│   ├── app/              ← FastAPI source code
│   ├── Dockerfile        ← Backend container
│   ├── Dockerfile.celery ← Celery worker container
│   ├── requirements.txt
│   └── .env.example      ← All env variables you need to fill in
├── frontend/
│   ├── src/              ← React source code
│   ├── Dockerfile        ← Frontend container
│   └── .env.example
├── cloudbuild.yaml
└── DEPLOYMENT_GUIDE.md   ← YOU ARE HERE
```

---

## ✅ BEFORE YOU START — Install These Tools

| Tool | Download Link | Check if installed |
|------|--------------|-------------------|
| Google Cloud CLI | https://cloud.google.com/sdk/docs/install | `gcloud --version` |
| Docker Desktop | https://www.docker.com/products/docker-desktop | `docker --version` |
| Node.js 20+ | https://nodejs.org | `node --version` |
| Python 3.12 | https://www.python.org/downloads | `python3 --version` |

---

## PHASE 1 — Set Up Free Database & Redis (5 minutes)

### Step 1A — Create Free PostgreSQL on Neon.tech

1. Go to **https://neon.tech** → click **Sign Up** (free, no credit card)
2. Click **New Project** → name it `wealth-management`
3. Choose region: **AWS ap-southeast-1 (Singapore)** — closest to India
4. Click **Create Project**
5. On the dashboard, find **Connection String** → click **Copy**
   - It looks like: `postgresql://neondb_owner:abc123@ep-xyz.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`
6. **Save this string** — you'll need it soon

---

### Step 1B — Create Free Redis on Upstash

1. Go to **https://upstash.com** → click **Sign Up** (free, no credit card)
2. Click **Create Database**
3. Name: `wealth-redis`, Region: **ap-south-1 (Mumbai)**
4. Click **Create**
5. On the database page, find **Redis URL** → click **Copy**
   - It looks like: `rediss://default:abc123@your-instance.upstash.io:6379`
6. **Save this string** — you'll need it soon

---

## PHASE 2 — Set Up Google Cloud (10 minutes)

### Step 2 — Create Google Cloud Project

```bash
# 1. Login
gcloud auth login

# 2. Create a new project (pick any unique project ID)
gcloud projects create wealth-app-yourname --name="Wealth Management"
# Example: wealth-app-sri123

# 3. Set as active project
gcloud config set project wealth-app-yourname

# 4. Link billing account (required for Cloud Run — but you stay in free tier)
# Go to: https://console.cloud.google.com/billing
# Link a billing account to your project (won't be charged within free tier)

# 5. Enable only the APIs you need
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  containerregistry.googleapis.com

echo "✅ Google Cloud ready"
```

> ⚠️ **Note on billing:** Cloud Run has a generous free tier (2M requests/month).
> You need a billing account linked but you will NOT be charged unless you exceed the free tier.

---

## PHASE 3 — Store Your Secrets

### Step 3 — Save Secrets in Google Secret Manager

```bash
# Replace each value with YOUR actual values from Phase 1

# Your Neon.tech connection string
echo -n "postgresql://neondb_owner:YOURPASSWORD@ep-XXXX.ap-southeast-1.aws.neon.tech/neondb?sslmode=require" \
  | gcloud secrets create DATABASE_URL --data-file=- --project=wealth-app-yourname

# Your Upstash Redis URL
echo -n "rediss://default:YOURPASSWORD@YOUR-INSTANCE.upstash.io:6379" \
  | gcloud secrets create REDIS_URL --data-file=- --project=wealth-app-yourname

# Generate a strong secret key and store it
python3 -c "import secrets; print(secrets.token_hex(32), end='')" \
  | gcloud secrets create SECRET_KEY --data-file=- --project=wealth-app-yourname

# Your Alpha Vantage API key (free at https://www.alphavantage.co/support/#api-key)
echo -n "YOUR_ALPHA_VANTAGE_KEY" \
  | gcloud secrets create ALPHA_VANTAGE_API_KEY --data-file=- --project=wealth-app-yourname

echo "✅ All secrets stored securely"
```

### Step 3B — Give Cloud Run permission to read secrets

```bash
# Get your project number
PROJECT_NUMBER=$(gcloud projects describe wealth-app-yourname --format="value(projectNumber)")

# Grant Secret Manager access to Cloud Run
gcloud projects add-iam-policy-binding wealth-app-yourname \
  --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

echo "✅ Permissions set"
```

---

## PHASE 4 — Deploy Backend (5 minutes)

### Step 4 — Build & Deploy Backend to Cloud Run

```bash
# Navigate into backend folder
cd backend/

# Build the Docker image and upload to Google Container Registry
gcloud builds submit \
  --tag gcr.io/wealth-app-yourname/wealth-backend \
  --project wealth-app-yourname \
  .

# Deploy to Cloud Run
gcloud run deploy wealth-backend \
  --image gcr.io/wealth-app-yourname/wealth-backend \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --set-secrets="DATABASE_URL=DATABASE_URL:latest,REDIS_URL=REDIS_URL:latest,SECRET_KEY=SECRET_KEY:latest,ALPHA_VANTAGE_API_KEY=ALPHA_VANTAGE_API_KEY:latest" \
  --project wealth-app-yourname

echo ""
echo "✅ Backend deployed! Copy the URL above ↑"
```

After this command finishes, you'll see a line like:
```
Service URL: https://wealth-backend-abc123-el.a.run.app
```
**Copy and save this URL — you need it for the frontend.**

### ✅ Verify backend is working:
Open this in your browser:
```
https://wealth-backend-abc123-el.a.run.app/health
```
You should see: `{"status":"ok"}`

Also check API docs:
```
https://wealth-backend-abc123-el.a.run.app/docs
```

---

## PHASE 5 — Deploy Frontend (5 minutes)

### Step 5 — Build & Deploy Frontend to Cloud Run

```bash
# Go back to project root, then into frontend/
cd ../frontend/

# Build and upload the frontend image
# ⚠️ IMPORTANT: Replace the URL below with YOUR actual backend URL from Step 4
gcloud builds submit \
  --tag gcr.io/wealth-app-yourname/wealth-frontend \
  --project wealth-app-yourname \
  --build-arg VITE_API_BASE_URL=https://wealth-backend-abc123-el.a.run.app \
  .

# Deploy frontend to Cloud Run
gcloud run deploy wealth-frontend \
  --image gcr.io/wealth-app-yourname/wealth-frontend \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 256Mi \
  --project wealth-app-yourname

echo ""
echo "✅ Frontend deployed! Copy the URL above ↑"
```

After this finishes you'll see:
```
Service URL: https://wealth-frontend-abc123-el.a.run.app
```
**Copy this URL — this is your app's public URL!**

---

## PHASE 6 — Final Configuration (2 minutes)

### Step 6 — Update Backend CORS with Frontend URL

```bash
# ⚠️ Replace with YOUR actual frontend URL from Step 5
gcloud run services update wealth-backend \
  --region asia-south1 \
  --update-env-vars FRONTEND_URL=https://wealth-frontend-abc123-el.a.run.app \
  --project wealth-app-yourname

echo "✅ CORS updated — backend now accepts requests from your frontend"
```

---

## PHASE 7 — Deploy Celery Worker (optional — for scheduled price updates)

### Step 7 — Deploy Celery Worker

```bash
cd backend/

# Build celery worker image
gcloud builds submit \
  --tag gcr.io/wealth-app-yourname/wealth-celery \
  --project wealth-app-yourname \
  -f Dockerfile.celery \
  .

# Deploy as a Cloud Run service (always-on worker)
gcloud run deploy wealth-celery \
  --image gcr.io/wealth-app-yourname/wealth-celery \
  --region asia-south1 \
  --platform managed \
  --no-allow-unauthenticated \
  --memory 512Mi \
  --min-instances 1 \
  --set-secrets="DATABASE_URL=DATABASE_URL:latest,REDIS_URL=REDIS_URL:latest,ALPHA_VANTAGE_API_KEY=ALPHA_VANTAGE_API_KEY:latest" \
  --project wealth-app-yourname

echo "✅ Celery worker deployed"
```

> 💡 Note: The Celery worker with `--min-instances 1` will have a small cost (~$5/month).
> Skip this step if you don't need automatic daily price updates.

---

## 🔁 How to Redeploy After Code Changes

```bash
# Redeploy backend after changes
cd backend/
gcloud builds submit --tag gcr.io/wealth-app-yourname/wealth-backend --project wealth-app-yourname .
gcloud run deploy wealth-backend --image gcr.io/wealth-app-yourname/wealth-backend --region asia-south1 --project wealth-app-yourname

# Redeploy frontend after changes (use your actual backend URL)
cd frontend/
gcloud builds submit --tag gcr.io/wealth-app-yourname/wealth-frontend --project wealth-app-yourname --build-arg VITE_API_BASE_URL=https://wealth-backend-abc123-el.a.run.app .
gcloud run deploy wealth-frontend --image gcr.io/wealth-app-yourname/wealth-frontend --region asia-south1 --project wealth-app-yourname
```

---

## 🐛 Troubleshooting Common Errors

### ❌ "relation does not exist" (database error)
Tables haven't been created yet. Fix: the app auto-creates tables on startup.
Restart your Cloud Run service:
```bash
gcloud run services update wealth-backend --region asia-south1 --project wealth-app-yourname
```

### ❌ CORS error in browser
Your frontend URL is not in the backend's allowed origins. Fix:
```bash
gcloud run services update wealth-backend \
  --region asia-south1 \
  --update-env-vars FRONTEND_URL=https://YOUR-ACTUAL-FRONTEND-URL.a.run.app \
  --project wealth-app-yourname
```

### ❌ "Cannot connect to database"
Check your DATABASE_URL secret is correct:
```bash
gcloud secrets versions access latest --secret=DATABASE_URL --project=wealth-app-yourname
```

### ❌ "Redis connection refused"
Check your REDIS_URL secret. Upstash uses `rediss://` (with double s for SSL):
```bash
gcloud secrets versions access latest --secret=REDIS_URL --project=wealth-app-yourname
```

### ❌ Cloud Build fails
Check build logs:
```bash
gcloud builds list --project wealth-app-yourname
gcloud builds log BUILD_ID --project wealth-app-yourname
```

### ❌ "Permission denied" on secrets
Re-run the IAM step from Step 3B above.

---

## 🔍 Useful Commands

```bash
# View live backend logs
gcloud run services logs tail wealth-backend --region asia-south1 --project wealth-app-yourname

# View live frontend logs
gcloud run services logs tail wealth-frontend --region asia-south1 --project wealth-app-yourname

# List all your Cloud Run services
gcloud run services list --region asia-south1 --project wealth-app-yourname

# See all your secrets
gcloud secrets list --project wealth-app-yourname

# Update a secret value
echo -n "NEW_VALUE" | gcloud secrets versions add SECRET_NAME --data-file=- --project wealth-app-yourname
```

---

## 💰 Cost Summary

| Service | Free Tier | Your Cost |
|---------|-----------|-----------|
| Cloud Run (Backend) | 2M requests/month | **$0** |
| Cloud Run (Frontend) | 2M requests/month | **$0** |
| Neon PostgreSQL | 0.5 GB storage, unlimited requests | **$0** |
| Upstash Redis | 10,000 commands/day | **$0** |
| Google Container Registry | 0.5 GB free | **$0** |
| **Total** | | **$0/month** ✅ |

---

## ✅ Deployment Checklist

- [ ] Neon.tech account created, project created, connection string saved
- [ ] Upstash account created, Redis database created, Redis URL saved
- [ ] Google Cloud project created and billing linked
- [ ] APIs enabled (run, cloudbuild, containerregistry)
- [ ] All 4 secrets stored in Secret Manager
- [ ] Cloud Run granted Secret Manager access (Step 3B)
- [ ] Backend deployed → `/health` returns `{"status":"ok"}`
- [ ] Frontend deployed with correct `VITE_API_BASE_URL`
- [ ] Backend CORS updated with frontend URL (Step 6)
- [ ] App opens in browser and login works 🎉

