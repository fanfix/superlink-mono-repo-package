# Fix Dependency Issues

## What Was Fixed

1. ✅ Updated `--frozen-lockfile` to `--immutable` in all Dockerfiles (Yarn 4 requirement)
2. ✅ Updated `@mui/material` from `^7.3.2` to `^7.3.7` in all apps to match `@mui/icons-material` requirements
3. ✅ Updated `@mui/icons-material` and `@mui/material` in design-system package

## Next Step: Update Lockfile

The lockfile needs to be updated to reflect these dependency changes. You have two options:

### Option 1: Update Lockfile Locally (Recommended)

Run this locally to update the lockfile:

```bash
# Install dependencies (this will update yarn.lock)
yarn install

# Commit the updated lockfile
git add yarn.lock
git commit -m "Update lockfile for MUI dependencies"
git push
```

### Option 2: Temporary Docker Workaround

If you can't update the lockfile right now, you can temporarily allow lockfile updates in Docker builds by changing:

```dockerfile
RUN yarn install --immutable
```

to:

```dockerfile
RUN yarn install
```

**⚠️ Warning**: This is not recommended for production as it makes builds non-reproducible. Only use this as a temporary workaround.

## What Changed

### Dockerfiles
- Changed `--frozen-lockfile` → `--immutable` (Yarn 4 requirement)

### Package.json Files
- `apps/admin/package.json`: `@mui/material ^7.3.2` → `^7.3.7`
- `apps/agency/package.json`: `@mui/material ^7.3.2` → `^7.3.7`
- `apps/client/package.json`: `@mui/material ^7.3.2` → `^7.3.7`
- `packages/design-system/package.json`: Both MUI packages updated to `^7.3.7`

## After Updating Lockfile

Once you've updated and committed the lockfile:
1. Push to GitHub
2. Cloud Build will trigger
3. Build should succeed with `--immutable` flag

