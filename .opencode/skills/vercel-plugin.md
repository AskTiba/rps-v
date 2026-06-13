---
name: vercel-plugin
description: Vercel platform knowledge for the RPS game project — deployment, CLI, and static site hosting. Use when deploying to Vercel, configuring vercel.json, or managing environment variables.
---

# Vercel Plugin — Static Site Edition

This skill distills the Vercel ecosystem knowledge relevant to deploying and managing a static HTML/CSS/JS site on Vercel. It's adapted from the official [vercel/vercel-plugin](https://github.com/vercel/vercel-plugin).

## Core Platform Concept

```
VERCEL PLATFORM
├── Deployment Engine (CI/CD, Preview URLs, Production)
│   → Git Provider (GitHub, GitLab, Bitbucket)
│   → Build System (detects framework or deploys as-is)
│   ↔ Vercel CLI
│   ↔ Vercel REST API
│
├── Edge Network (Global CDN, ~300ms propagation)
│   ⊃ Static file serving (HTML, CSS, JS, assets)
│   ⊃ Automatic HTTPS
│
├── Domains & DNS
│   ↔ Vercel CLI (vercel domains, vercel dns, vercel certs)
│
└── Environment Variables
    ↔ Vercel CLI (vercel env)
```

## Deploying Static Sites

Since this project is pure HTML/CSS/JS with no build step, Vercel detects it as a static framework and deploys the files as-is. Zero config needed — but a `vercel.json` gives you explicit control.

### vercel.json for Static Sites

```json
{
  "framework": null,
  "cleanUrls": true,
  "trailingSlash": false
}
```

| Option | Purpose |
|--------|---------|
| `"framework": null` | Tells Vercel no framework — deploy files as-is |
| `"cleanUrls": true` | Removes `.html` extensions from URLs (`/about` → `/about.html`) |
| `"trailingSlash": false` | No trailing slashes in generated URLs |
| `"redirects"` | Array of redirect rules |
| `"rewrites"` | Array of rewrite rules (e.g., SPA fallback to `index.html`) |
| `"headers"` | Custom HTTP headers per path pattern |

### SPA Fallback Pattern

For single-page apps that use client-side routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Not needed for this project (RPS game is a single page), but useful to know.

### 404 Page

Vercel automatically serves `404.html` if it exists in the output directory. Create one at the project root.

## Vercel CLI — Essential Commands

```bash
# Install
npm i -g vercel

# Login
vercel login

# Deploy (interactive — first time)
vercel

# Deploy to production directly
vercel --prod

# Link to existing project
vercel link

# Pull environment variables
vercel env pull .env.local

# View logs
vercel logs <deployment-url>

# List deployments
vercel ls

# Inspect deployment details
vercel inspect <deployment-url>

# Promote a preview to production
vercel promote <deployment-url-or-id>

# Rollback to previous deployment
vercel rollback
```

## Deployment Methods

| Method | When to Use |
|--------|------------|
| `vercel` from project root | Quick deploy, first-time setup |
| `vercel --prod` | Deploy to production immediately |
| Git push (GitHub integration) | Auto-deploys on every push |
| [Vercel Drop](https://vercel.com/drop) | Drag-and-drop folder into browser — no CLI needed |

## CI/CD with GitHub Actions

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install Vercel CLI
        run: npm install -g vercel
      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      - name: Deploy
        run: vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### Required CI Secrets

- `VERCEL_TOKEN` — Personal or team token from [vercel.com/account/tokens](https://vercel.com/account/tokens)
- `VERCEL_ORG_ID` — From `.vercel/project.json` after linking
- `VERCEL_PROJECT_ID` — From `.vercel/project.json` after linking

Set these as secrets in your GitHub repository settings, not in the workflow file.

## Environment Variables

```bash
# Pull env vars from Vercel to local .env.local
vercel env pull .env.local

# Add an env var
echo "value" | vercel env add MY_VAR production

# List env vars
vercel env ls

# Remove an env var
vercel env rm MY_VAR production
```

## Common Build Errors for Static Sites

| Error | Cause | Fix |
|-------|-------|-----|
| `404 Not Found` after deploy | Missing file or wrong path | Check `vercel.json` output directory |
| Assets not loading | Relative paths issue | Use root-relative paths (`/assets/image.png`) |
| SPA routes return 404 | No fallback rule | Add `rewrites` to `vercel.json` |

## Official Documentation

- [Vercel CLI](https://vercel.com/docs/cli)
- [Deployments](https://vercel.com/docs/deployments)
- [Vercel for GitHub](https://vercel.com/docs/git/vercel-for-github)
- [Environment Variables](https://vercel.com/docs/environment-variables)
- [Project Configuration (vercel.json)](https://vercel.com/docs/projects/project-configuration)
