# Unified Deployment Guide

This guide explains how to deploy all three apps (admin, agency, client) as a single Cloud Run service.

## Architecture

The unified deployment uses a router server that:
- Routes `/admin/*` requests to the Admin app
- Routes `/agency/*` requests to the Agency app  
- Routes `/*` (everything else) to the Client app

All three apps run internally on different ports (3001, 3002, 3003) and the router proxies requests to them.

## Access URLs

Once deployed, you can access:
- **Admin**: `https://your-cloud-run-url.run.app/admin`
- **Agency**: `https://your-cloud-run-url.run.app/agency`
- **Client**: `https://your-cloud-run-url.run.app/` (root)

## Deployment

### Using Cloud Build

Deploy using the unified Cloud Build configuration:

```bash
gcloud builds submit --config=cloudbuild-unified.yaml
```

### Manual Deployment

1. Build the Docker image:
```bash
docker build -f Dockerfile.unified -t gcr.io/YOUR_PROJECT_ID/unified:latest .
```

2. Push to Google Container Registry:
```bash
docker push gcr.io/YOUR_PROJECT_ID/unified:latest
```

3. Deploy to Cloud Run:
```bash
gcloud run deploy superlink-mono-repo-package \
  --image gcr.io/YOUR_PROJECT_ID/unified:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 1Gi \
  --cpu 2 \
  --max-instances 10
```

## Files

- `Dockerfile.unified` - Builds all three apps and includes the router
- `router.js` - HTTP proxy/router that routes requests to the appropriate app
- `cloudbuild-unified.yaml` - Cloud Build configuration for unified deployment

## Notes

- **Routing:** The router forwards the **full path** (including `/admin` or `/agency`) to each app. Admin and Agency are built with `basePath` set to `/admin` and `/agency` respectively, so they expect the prefix and serve the full app at those routes.
- **Root:** `/` and all other paths go to the Client app. `/agency` and `/agency/*` run the **whole agency app**; `/admin` and `/admin/*` run the whole admin app.
- Each app runs on a separate internal port to avoid conflicts.
- All apps share the same node_modules from the monorepo (compatible dependencies).
- Static assets are served correctly because each app is built with the correct `NEXT_PUBLIC_BASE_PATH` in `Dockerfile.unified`.

