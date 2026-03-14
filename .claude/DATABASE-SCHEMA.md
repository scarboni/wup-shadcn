# WholesaleUp — Database Schema & Data Layer

> **Last updated:** 2026-03-07
> **ORM:** Prisma 7.4.2
> **Database:** PostgreSQL
> **Schema file:** `/prisma/schema.prisma`
> **Generated client:** `/src/generated/prisma/`

## Models Overview

### Auth Models (NextAuth v5 adapter)

| Model | Purpose | Key Fields |
|-------|---------|------------|
| **User** | Core user record | email (unique), username (unique), password (bcrypt), tier, tierExpiresAt |
| **Account** | OAuth provider links | provider, providerAccountId → userId |
| **Session** | JWT sessions | sessionToken, revoked flag |
| **VerificationToken** | Email verify + password reset | identifier, token, type ("email" \| "password-reset") |
| **LoginHistory** | Login audit trail | userId, ip, userAgent, success |

### Business Models

| Model | Purpose | Key Fields |
|-------|---------|------------|
| **Category** | Product categories | name, slug, icon (Lucide name), sortOrder |
| **Supplier** | Wholesaler/liquidator profiles | name, slug, country, verified, rating, reviewCount, minOrder, leadTime |
| **SupplierCategory** | Many-to-many join | supplierId + categoryId (composite PK) |
| **Deal** | Product/deal listings | title, slug, price/priceValue, discount, moq, featured, premium, supplierId, categoryId |
| **SavedDeal** | User's saved/favorited deals | userId + dealId (composite PK) |
| **Review** | Supplier reviews | rating (1-5), content, supplierId, approved flag |
| **Testimonial** | Platform testimonials | name, role, company, content, rating, featured |
| **PricingPlan** | Subscription tiers | name, displayName, price/priceValue, features[], highlighted |
| **ContactSubmission** | Contact form entries | queryType, fullName, email, message, status |
| **PlatformStat** | Cached aggregate stats | key-value pairs ("suppliers", "deals", "members") |

## Tier System

Values stored in User.tier field:

| Tier | DB Value | Dashboard Label | Pricing |
|------|----------|----------------|---------|
| Free | "free" | FREE | £0 |
| Standard | "starter" | STANDARD | TBD |
| Premium | "pro" | PREMIUM | TBD |
| Premium+ | "enterprise" | PREMIUM+ | TBD |
| Supplier Pro | — | SUPPLIER PRO | TBD |

**Note:** The front-end uses uppercase labels (FREE, STANDARD, PREMIUM, PREMIUM+, SUPPLIER PRO) in TIER_CONFIG. The database stores lowercase ("free", "starter", "pro", "enterprise"). The mapping happens in auth callbacks.

## Indexes

Optimized for common query patterns:
- User: email, username
- Deal: slug, supplierId, categoryId, featured, active, createdAt
- Supplier: slug, country, verified
- Category: slug
- Review: supplierId, approved
- ContactSubmission: status, createdAt
- LoginHistory: userId, createdAt

## Schema Evolution Tracking

### Current state (as of 2026-03-07):
- Schema defined but front-end mostly uses hardcoded demo data
- API routes exist but many return mock data
- Registration + login flow is connected to real database
- Profile, deals, suppliers, categories pages use mock data in phase components

### Planned migrations:
- [ ] BuyerProfile model (trade references, business details, category preferences)
- [ ] SupplierProfile model (extended supplier info for supplier dashboard)
- [ ] Order model (when deals/ordering goes live)
- [ ] Message model (in-app messaging between buyers/suppliers)
- [ ] Notification model (email/push notification preferences and history)
- [ ] AffiliateEarning model (affiliate program tracking)
- [ ] BillingHistory model (subscription payment records)

## Database Commands

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Create migration
npx prisma migrate dev --name <migration_name>

# Push schema without migration (dev only)
npx prisma db push

# Seed database
npx prisma db seed

# Open Prisma Studio (GUI)
npx prisma studio
```
