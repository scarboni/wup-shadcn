---
name: build-validation
description: |
  **WholesaleUp Build & Validation Reference**: How to validate code changes, run type-checks, and handle build timeouts in the WholesaleUp Next.js project. Reference this skill whenever running builds, checking for compilation errors, verifying code after edits, or when a build/lint command times out or fails unexpectedly.
  MANDATORY TRIGGERS: build, compile, type-check, tsc, lint, next build, timeout, validation, verify changes, compilation error, build failed, process terminated
---

# Build & Validation — WholesaleUp

This project is a Next.js 15 / React 19 app with TypeScript. Builds can be resource-intensive due to 30+ routes, heavy component tree, and Tailwind processing.

## The Timeout Problem

In resource-constrained environments (sandboxes, CI free tiers, low-memory VMs), `next build` and `next lint` regularly exceed 2-minute timeouts. This is not a project defect — the project builds fine on a standard development machine. The constraint is the environment, not the code.

## Validation Strategy (fast → slow)

Use the fastest tool that catches the class of error you care about. Work down this list and stop when you've confirmed what you need:

### 1. `npx tsc --noEmit` — Type checking only (~15-30s)
The go-to validation command. Catches type errors, missing imports, incorrect props, and interface mismatches without bundling anything. This is sufficient for most code changes.

```bash
npx tsc --noEmit
```

If it passes with no output, the code is type-safe.

### 2. `npx next lint` — Linting (~30-60s, may timeout)
Catches ESLint issues (unused vars, accessibility, React rules). Sometimes times out in constrained environments. If it does, lint specific files instead:

```bash
npx next lint --file src/components/phases/deal-cards.jsx
```

### 3. `npm run build` / `npx next build` — Full production build (~2-5 min)
The comprehensive check: type-checking, linting, bundling, static page generation, and tree-shaking. Only run this on the user's local machine or in CI with adequate resources. If it times out, don't retry — switch to `tsc --noEmit` and let the user run the full build locally.

### 4. Manual review
When automated tools aren't available or practical, read the changed files and trace imports/exports manually. This catches logical issues that type-checking misses (wrong business logic, missing data transformations, incorrect conditional branches).

## What To Do When a Build Times Out

1. Don't retry the same command — it will timeout again
2. Run `npx tsc --noEmit` instead for a quick type-check
3. Tell the user their code is type-safe and recommend they run `npm run build` locally
4. If the user specifically needs a full build verification, explain that the environment has a timeout constraint and suggest they run it in their terminal

## Common Validation Scenarios

**After editing components**: `npx tsc --noEmit` is enough. It catches broken imports, wrong prop types, and missing exports.

**After changing `src/lib/categories.js` or other shared data files**: Run `tsc --noEmit` — since many components import from shared files, type-checking will surface any mismatches across the tree.

**After modifying `layout.tsx` or `globals.css`**: These don't have meaningful type-checks. Review manually and confirm the inline scripts and CSS rules are syntactically correct.

**After adding new routes or pages**: `tsc --noEmit` checks the page component types. For full static generation verification, the user needs `npm run build` locally.

**After modifying `next.config.js` or `tailwind.config.js`**: Config changes can't be validated by `tsc`. The user should restart their dev server (`npm run dev`) and do a local build.

## Dev Server

The user runs the dev server on their own machine:

```bash
npm run dev
```

This starts Next.js on `http://localhost:3000`. The dev server does incremental compilation and is much faster than a full build for iterating.
