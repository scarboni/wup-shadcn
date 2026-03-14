# WholesaleUp Full-Stack Coordinator

## Purpose
This skill ensures Claude maintains context across sessions when working on the WholesaleUp wholesale marketplace platform. Read this FIRST at the start of every session.

## Session Startup Checklist

Before doing ANY work, read these files in order:

1. **`.claude/PROJECT-ARCHITECTURE.md`** — Tech stack, project structure, breakpoint strategy, auth flow
2. **`.claude/SESSION-LOG.md`** — What was done in previous sessions, what's pending
3. **`.claude/PAGE-REGISTRY.md`** — Every page's status (DEMO/PARTIAL/PROD), components used
4. **`.claude/DATABASE-SCHEMA.md`** — Prisma models, tier system, planned migrations
5. **`.claude/INFRASTRUCTURE.md`** — External services, AWS, email, deployment status

## Session Shutdown Checklist

Before ending any session, UPDATE these files:

1. **Add a new entry to `SESSION-LOG.md`** with: focus area, changes made, files modified, known issues, next steps
2. **Update `PAGE-REGISTRY.md`** if any page status changed (DEMO → PARTIAL → PROD)
3. **Update `DATABASE-SCHEMA.md`** if any schema changes were made
4. **Update `INFRASTRUCTURE.md`** if any services were configured or decisions were made

## Key Architecture Rules

### Layout
- `app-layout.jsx` is the REAL production layout wrapper. NOT `shell.jsx`.
- Shell.jsx is a demo copy at /shell route only.

### Responsive Strategy
- xl (1280px): Dark blue nav appears, hamburger hides
- md (768px): AccountSidebar appears (force-collapsed until xl)
- Below md: MobileDashboardNav dropdown + hamburger menu for navigation
- 2xl (1536px): Tips panels appear

### Component Pattern
- Phase components in `/src/components/phases/` contain all UI
- Thin page.tsx files in `/src/app/` just import and render phases
- Shared exports from `dashboard.jsx` (AccountSidebar, MobileDashboardNav, UpgradeBanner, etc.)
- `usePageUser()` hook for getting current user (real session or demo)

### Database
- Prisma schema at `/prisma/schema.prisma`
- Tier mapping: DB "free"/"starter"/"pro"/"enterprise" → UI FREE/STANDARD/PREMIUM/PREMIUM+
- Most pages currently use hardcoded demo data, NOT the database

### Existing Skills
- **form-standards** — WCAG 2.2 accessibility, ARIA, keyboard nav for all form components
- **production-standards** — API routes, auth gating, loading states, error boundaries
- **seo** — Meta tags, structured data, URL structure, Core Web Vitals

## Cross-Cutting Concerns

When working on any feature, consider:
- [ ] Does it need to work at all breakpoints? (Check breakpoint strategy above)
- [ ] Does it need a demo mode AND a production mode?
- [ ] Does it touch the database? Update DATABASE-SCHEMA.md
- [ ] Does it add a new API route? Update PAGE-REGISTRY.md
- [ ] Does it affect auth/gating? Check tier system
- [ ] Does it need form inputs? Read form-standards skill
- [ ] Is it going to production? Read production-standards skill
- [ ] Does it affect SEO? Read seo skill
