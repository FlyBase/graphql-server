#!/bin/sh
# Apply the local dependency patches in this directory. Safe to re-run:
# a patch that is already applied is skipped. A patch that neither applies
# nor is already applied (for example, after a dependency upgrade) fails the
# install, so a build can never silently drop a fix.
set -e
cd "$(dirname "$0")/.."
for p in patches/*.patch; do
  if patch -p1 -R -s -f --dry-run < "$p" > /dev/null 2>&1; then
    echo "patches: already applied: $p"
    continue
  fi
  # Dry run first, so a patch that does not fit leaves the files untouched.
  patch -p1 -s -f --dry-run < "$p" > /dev/null
  patch -p1 -s -f --no-backup-if-mismatch < "$p"
  echo "patches: applied: $p"
done
