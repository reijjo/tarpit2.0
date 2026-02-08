# CI/CD Setup Guide

Complete guide for setting up GitHub Actions for automated testing in a monorepo project.

## 📋 Prerequisites

- GitHub repository
- Bun runtime
- Frontend: Next.js + Vitest + Playwright
- Backend: Express + Bun test

## 🚀 Initial Setup

### 1. Create GitHub Actions Workflow File

Create the directory structure:

```bash
mkdir -p .github/workflows
touch .github/workflows/test.yml
```

### 2. Configure Workflow File

Add the following to `.github/workflows/test.yml`:

```yaml
name: Tests

on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main, dev]

jobs:
  # Fast tests run in parallel first
  frontend-unit:
    name: Frontend Unit Tests
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./client

    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Cache dependencies
        uses: actions/cache@v4
        with:
          path: |
            client/node_modules
            ~/.bun/install/cache
          key: ${{ runner.os }}-bun-${{ hashFiles('client/bun.lockb') }}
          restore-keys: |
            ${{ runner.os }}-bun-

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Run unit tests with coverage
        run: bun test:cover

      - name: Upload coverage reports
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: frontend-coverage
          path: client/coverage/

  backend:
    name: Backend Tests
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./server

    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Cache dependencies
        uses: actions/cache@v4
        with:
          path: |
            server/node_modules
            ~/.bun/install/cache
          key: ${{ runner.os }}-bun-${{ hashFiles('server/bun.lockb') }}
          restore-keys: |
            ${{ runner.os }}-bun-

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Run tests with coverage
        run: bun test --coverage

      - name: Upload coverage reports
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: backend-coverage
          path: server/coverage/

  # E2E runs last and only if unit tests pass
  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: [frontend-unit, backend]
    defaults:
      run:
        working-directory: ./client

    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Cache dependencies
        uses: actions/cache@v4
        with:
          path: |
            client/node_modules
            ~/.bun/install/cache
          key: ${{ runner.os }}-bun-${{ hashFiles('client/bun.lockb') }}

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Cache Playwright browsers
        uses: actions/cache@v4
        id: playwright-cache
        with:
          path: ~/.cache/ms-playwright
          key: ${{ runner.os }}-playwright-${{ hashFiles('client/bun.lockb') }}

      - name: Install Playwright browsers
        if: steps.playwright-cache.outputs.cache-hit != 'true'
        run: bunx playwright install --with-deps chromium

      - name: Install system dependencies (if cache hit)
        if: steps.playwright-cache.outputs.cache-hit == 'true'
        run: bunx playwright install-deps chromium

      - name: Run E2E tests
        run: bun test:e2e

      - name: Upload Playwright report
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: client/playwright-report/
          retention-days: 7
```

## 🔒 Branch Protection Setup

### Step 1: Navigate to Repository Settings

1. Go to your GitHub repository
2. Click **Settings** tab
3. Click **Branches** in the left sidebar

### Step 2: Add Branch Protection Rule

1. Click **Add branch protection rule**
2. Configure as follows:

**Branch name pattern:**

```
main
```

**Protection rules:**

- ✅ Require a pull request before merging
- ✅ Require approvals: 1 (optional)
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- Add required checks:
  - Frontend Unit Tests
  - Backend Tests
  - E2E Tests
- ✅ Do not allow bypassing the above settings
- ✅ Include administrators (optional but recommended)

3. Click **Create** or **Save changes**

## 📦 Project Requirements

### Frontend (client/package.json)

Required scripts:

```json
{
  "scripts": {
    "dev": "bun --bun next dev",
    "build": "bun --bun next build",
    "start": "bun --bun next start",
    "test": "vitest",
    "test:cover": "vitest run --coverage",
    "test:e2e": "playwright test"
  }
}
```

Required dependencies:

```json
{
  "devDependencies": {
    "vitest": "^4.0.18",
    "@vitest/coverage-v8": "^4.0.18",
    "@playwright/test": "^1.58.2",
    "@testing-library/react": "^16.3.2",
    "@testing-library/jest-dom": "^6.9.1"
  }
}
```

### Backend (server/package.json)

Required scripts:

```json
{
  "scripts": {
    "dev": "bun --watch src/index.ts",
    "test": "bun test src/**/*.spec.ts",
    "test:cover": "bun test --coverage src/**/*.spec.ts"
  }
}
```

## 🔄 Development Workflow

### Create Feature Branch

```bash
# Ensure you're on main and up to date
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name
```

### Make Changes and Test Locally

```bash
# Run tests locally before pushing
cd client
bun test        # Unit tests
bun test:e2e    # E2E tests

cd ../server
bun test        # Backend tests
```

### Push and Create Pull Request

```bash
# Commit your changes
git add .
git commit -m "Add your feature description"

# Push to GitHub
git push origin feature/your-feature-name
```

**On GitHub:**

1. Navigate to your repository
2. Click **Pull requests** tab
3. Click **New pull request**
4. Select: `base: main` ← `compare: feature/your-feature-name`
5. Click **Create pull request**
6. Add description
7. Wait for all tests to pass ✅
8. Request review (if required)
9. Click **Merge pull request** once approved and tests pass

## ⚡ Performance Optimizations

### Caching Strategy

The workflow implements three levels of caching:

1. **Dependency caching** - Caches node_modules and Bun install cache
2. **Playwright browser caching** - Caches browser binaries (~200MB)
3. **Lockfile-based keys** - Cache invalidates when dependencies change

### Parallel Execution

- Frontend unit tests and backend tests run simultaneously
- E2E tests run only after unit tests pass (fail-fast)

### Expected Timing

| Job           | First Run   | With Cache    |
| ------------- | ----------- | ------------- |
| Frontend Unit | ~30s        | ~15s          |
| Backend       | ~20s        | ~10s          |
| E2E           | ~3-4 min    | ~1-2 min      |
| **Total**     | **4-5 min** | **1.5-2 min** |

## 🐛 Troubleshooting

### Tests fail locally but pass in CI (or vice versa)

```bash
# Ensure dependencies match
bun install --frozen-lockfile

# Clear caches
rm -rf node_modules
rm bun.lockb
bun install
```

### Playwright browser installation fails

```bash
# Install browsers locally
bunx playwright install --with-deps chromium

# Check versions match
bunx playwright --version
```

### Cache not working

- Check if `bun.lockb` is committed to git
- Verify cache keys in workflow match lockfile paths
- Clear GitHub Actions cache: Settings → Actions → Caches → Delete

## 📊 Viewing Test Results

### In GitHub

1. Go to **Actions** tab
2. Click on the workflow run
3. View individual job logs
4. Download artifacts (coverage reports, Playwright reports)

### Coverage Reports

Download coverage artifacts:

1. Go to failed/completed workflow run
2. Scroll to **Artifacts** section
3. Download `frontend-coverage` or `backend-coverage`

### Playwright Reports

Only uploaded on E2E test failures:

1. Download `playwright-report` artifact
2. Extract and open `index.html` in browser

## 🔐 Environment Variables (Future)

When you need secrets in CI:

### Add Secrets to GitHub

1. Settings → Secrets and variables → Actions
2. Click **New repository secret**
3. Add secrets:
   - `DATABASE_URL`
   - `API_KEY`
   - etc.

### Use in Workflow

```yaml
- name: Run tests
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
    API_KEY: ${{ secrets.API_KEY }}
  run: bun test
```

## 📝 Notes

- Always test locally before pushing
- Keep test suite fast (under 5 minutes total)
- Monitor cache hit rates in Actions logs
- Update Playwright browsers regularly
- Review failed test artifacts before debugging

## 🔗 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Bun Test Runner](https://bun.sh/docs/cli/test)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
