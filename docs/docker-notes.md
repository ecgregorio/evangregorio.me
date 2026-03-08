## Dockerized Deployment

This project uses host-level Nginx for HTTPS and routing, with Docker Compose for the API and database.

### Services

The stack includes:

* **Root frontend** (`evangregorio.me`) served by Nginx from `/var/www/evangregorio.me`
* **FastAPI API** served by Gunicorn + Uvicorn workers in Docker
* **PostgreSQL** in Docker with persistent volume
* **Nginx (host)** reverse proxy + TLS termination (Certbot certificates)

Architecture:

```text
Internet
   |
Nginx (host)
   |-- evangregorio.me       -> /var/www/evangregorio.me
   |-- api.evangregorio.me   -> 127.0.0.1:8000 (FastAPI container)
FastAPI container
   |
PostgreSQL container
```

### Local/Server Docker Commands

Build and start services:

```bash
docker compose up -d --build
```

Check status:

```bash
docker compose ps
```

View API logs:

```bash
docker compose logs -f api
```

Stop services:

```bash
docker compose down
```

### CI/CD Deploy Flow (GitHub Actions)

`/.github/workflows/deploy.yml` now deploys both backend and frontend.

Deploy sequence on EC2:

1. Fetch latest `main` and reset repo in place.
2. Run `docker compose up -d --build` for API/DB.
3. Sync `evangregorio.me/` from repo to `/var/www/evangregorio.me` using `rsync --delete`.
4. Validate Nginx config with `nginx -t`.
5. Reload Nginx.

### Required GitHub Secrets

Add these in repository settings before running the workflow:

* `EC2_HOST` - public IP or DNS of the EC2 host
* `EC2_USER` - SSH user (for example: `ubuntu`)
* `EC2_SSH_KEY` - private SSH key used by Actions
* `EC2_REPO_DIR` - absolute path to this repo on EC2 (example: `/home/ubuntu/fastapi_project`)
* `EC2_FRONTEND_DEST` - absolute path for Nginx root site files (example: `/var/www/evangregorio.me`)

If `EC2_REPO_DIR` or `EC2_FRONTEND_DEST` are omitted, workflow defaults are used.

### EC2 Prerequisites

The deploy SSH user must be able to:

* run `docker compose`
* write to `/var/www/evangregorio.me` (via `sudo` in workflow)
* run `sudo nginx -t`
* run `sudo systemctl reload nginx`

Ensure `rsync` is installed on EC2:

```bash
sudo apt-get update
sudo apt-get install -y rsync
```

### Why `/var/www/evangregorio.me` Exists

Nginx serves static files directly from that directory. It is expected for host-level static hosting. The important part is that CI now syncs repo changes into that directory automatically.

### Migration Note

Legacy `systemctl restart fastapi` flow is deprecated for this repo. API lifecycle is managed through Docker Compose.

## Multi-Environment Compose Strategy

To avoid production/staging conflicts on the same EC2 host:

1. `docker-compose.yml` is the production baseline.
2. `docker-compose.staging.yml` overrides only staging differences.
3. Staging deploy command:
   `docker compose -f docker-compose.yml -f docker-compose.staging.yml up -d --build`
4. Production deploy command:
   `docker compose up -d --build`

### Why this is used

- Prevents accidental production port changes.
- Keeps one source of truth with minimal override.
- Avoids container naming collisions and environment drift.