# Denys Nevskyi portfolio

Polish portfolio covering **AI and automation**, **IT administration**, and **cybersecurity learning and labs**. The static website is published on the user's existing AWS server behind Caddy.

The repository contains public presentation material, not application source code from private projects, secrets, server credentials or original recordings.

## Run

Requires Node.js 22 or newer. There are no npm dependencies.

```bash
npm run build
npm run check
npm run dev
```

Open the address printed by the preview server. For deployment, copy only the generated `dist/` directory.

## Contents

| Path | Purpose |
| --- | --- |
| `content/profile.json` | Identity, contact details, introduction, perspectives and project order |
| `content/projects.json` | Shared project descriptions and evidence |
| `content/cv/` | Curated short descriptions for each CV |
| `src/` | Styles and accessible interactions |
| `public/images/` | Approved project screenshots |
| `public/cv/` | Current reviewed PDF for download |
| `templates/cv/` | CV generation notes |
| `scripts/` | Build, validation, preview and deployment |
| `deploy/` | Caddy configuration example |
| `docs/` | Content, screenshots, deployment and handoff instructions |

## Direct links

The same page supports `/#ai`, `/#admin`, and `/#security`. Each project has a shared source entry and may appear in more than one perspective. Initial content does not imply equal expertise across all three directions.

## Updating

1. Edit the relevant content entry and update its `reviewed` date.
2. Add approved images using [the screenshot guide](docs/SCREENSHOTS.md).
3. Build and check. Preview the affected perspectives and the PDF.
4. Review and commit changes; publish a specific accepted commit.

Current CV download is a reviewed standalone PDF. Website builds do not silently rewrite it. See [CV updates](docs/CV.md) for the staged plan for generated variants.

## Deployment

Live: **https://portfolio.appli-lab.pl/** — verified on 2026-11-12.
See [deployment instructions](docs/DEPLOYMENT.md) and [current handoff](docs/HANDOFF.md).

The supplied GitHub Actions workflow builds and validates changes. It does not deploy to AWS or require credentials.

## Content rights

Project text, images and CV belong to their respective authors. No open-source license has been selected for this repository. Do not republish third-party recordings or private project materials without appropriate permission.
