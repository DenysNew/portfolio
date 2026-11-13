#!/usr/bin/env bash
set -euo pipefail

# Run from a verified checkout on the workstation with existing SSH access.
# Remote base must already exist and be writable by the deployment account.
host="${1:-}"
if [[ -z "$host" || ! "$host" =~ ^[a-zA-Z0-9_.@-]+$ || "$host" == -* ]]; then
  printf '%s\n' 'Usage: bash scripts/deploy.sh <existing-ssh-host-alias>' >&2
  exit 2
fi
cd "$(dirname "$0")/.."
if [[ -n "$(git status --porcelain)" ]]; then
  printf '%s\n' 'Commit reviewed changes before deploying.' >&2
  exit 1
fi
npm run build
npm run check
release="$(date -u +%Y%m%dT%H%M%SZ)-$(git rev-parse --short=12 HEAD)"
base='/var/www/portfolio'
ssh -o BatchMode=yes "$host" "test -d '$base/releases' && test -w '$base/releases' && { test ! -e '$base/current' || test -L '$base/current'; }"
tar -C dist -cf - . | ssh -o BatchMode=yes "$host" "set -eu; mkdir '$base/releases/$release'; tar -xf - -C '$base/releases/$release'; test -s '$base/releases/$release/index.html'; chmod -R u=rwX,go=rX '$base/releases/$release'; ln -s 'releases/$release' '$base/current.next'; mv -Tf '$base/current.next' '$base/current'"
printf 'Published release: %s\n' "$release"
printf '%s\n' 'Verify the HTTPS page, all perspectives and the CV download. Keep the previous release for rollback.'
