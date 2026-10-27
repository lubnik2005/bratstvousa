# Bratstvo USA

Monorepo for the Bratstvo USA public website, Nova administration panel, and Camp Paradise services.

## Projects

| Directory | Purpose |
| --- | --- |
| `app/` | SvelteKit public website |
| `admin/` | Laravel Nova administration panel |
| `camp-paradise/` | Camp Paradise application services |
| `camp-paradise-web/` | Camp Paradise public site |
| `nginx/` | Local proxy configuration |

## Getting started

Each project has its own dependencies and commands. Start with its README and the applicable `AGENTS.md` file:

```bash
(cd app && npm install && npm run dev)
docker compose up -d admin
```

The Nova production deployment runs on the `nautilus` personal server behind a Cloudflare Tunnel and Cloudflare Access. See `admin/README.md` for deployment, updates, and recovery procedures.
