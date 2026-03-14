---
name: account-types
description: |
  **WholesaleUp Account Types & Membership Tiers**: Reference this skill whenever working on feature gating, access control, pricing page, CTA buttons, permission checks, contact visibility, messaging rules, newsletter logic, deal listing limits, or any UI that changes based on user role/tier. Covers all 7 account types (Guest, Free, Standard, Premium, Premium+, Supplier, Supplier Pro), what each tier can and cannot do, and the gating rules that determine which UI components to show. MANDATORY TRIGGERS: account type, membership, tier, plan, gating, permission, access control, pricing, upgrade, free vs premium, supplier tier, contact visibility, messaging rules, enquiry access, newsletter, deal listing limit, feature gate, role, subscription
---

# WholesaleUp Account Types

This is the single source of truth for what each account type can do. Reference this whenever building or modifying gated UI, access-controlled features, or anything that behaves differently based on user tier.

## Account Types Overview

There are 7 account types split into two groups:

**Buyer accounts:** Guest → Free → Standard → Premium → Premium+
**Supplier accounts:** Supplier → Supplier Pro

Supplier accounts can also act as buyers (they can browse deals, message other suppliers, and add to enquiry lists).

## Tier Privileges

### Guest (not registered)

- Can browse deals and supplier profiles (public content)
- Cannot send enquiries to anyone
- Cannot add to enquiry list
- Cannot view supplier contact details
- Cannot access deal attachments
- Cannot receive newsletters
- Sees anonymous supplier names (e.g. "Supplier #4821") instead of real company names
- Cannot see supplier company logos or branding (placeholder shown)
- CTA on deal cards shows: `Lock` icon + "Join Now!" → opens register modal
- CTA on supplier cards shows: `Phone` icon + "Call Now" (opens register modal) and `MessageSquare` icon + "Send Enquiry" (opens register modal)
- Must register to do anything beyond browsing, contacting WholesaleUp (support), and live chat (future feature)

### Free (registered, no subscription)

- Can send enquiries to **Supplier Pro** accounts
- Can enquire about **Supplier Pro** deals, including add to enquiry list
- Can view **Supplier Pro** contact details
- Can receive **weekly** deals newsletter
- Cannot send enquiries to or enquire about regular **Supplier** deals
- Cannot view regular **Supplier** contact details
- Cannot access deal attachments
- Cannot access supplier reviews
- Cannot submit sourcing support requests
- Sees real supplier names and company logos for **Supplier Pro** accounts
- Sees anonymous names and placeholder branding for regular **Supplier** accounts
- CTA shows: `Lock` icon + "Send Enquiry" → links to `/pricing` (when viewing a Supplier deal they can't access); `ClipboardList` icon + "Add to Enquiry List" (when viewing a Supplier Pro deal they can access)
- Supplier card CTA: `Lock` icon + "Send Enquiry" → `/pricing` (for Supplier); `MessageSquare` icon + "Send Enquiry" (for Supplier Pro)

### Standard

- Can send enquiries to **Supplier Pro** accounts
- Can enquire about deals from **Supplier** and **Supplier Pro**, including add to enquiry list
- Can view **Supplier Pro** contact details
- Can access **deal attachments** (documents, certificates, media)
- Can receive **weekly** deals newsletter
- Cannot send enquiries to regular **Supplier** accounts directly (only enquire about their deals)
- Cannot view regular **Supplier** contact details
- Cannot access supplier reviews
- Cannot submit sourcing support requests
- Sees real supplier names for all suppliers
- Sees company logos/branding for **Supplier Pro** only; placeholder for regular **Supplier**
- CTA shows: `ClipboardList` icon + "Add to Enquiry List" (for all deals)
- On /suppliers page, Standard behaves like Free — cannot see Supplier contact details, sees blurred text for non-Supplier Pro

### Premium

- Can send enquiries to **Supplier** and **Supplier Pro** accounts
- Can enquire about deals from **Supplier** and **Supplier Pro**, including add to enquiry list
- Can view **Supplier** and **Supplier Pro** contact details
- Can click up to **500 Supplier website URLs per month**
- Can receive **weekly** deals newsletter
- Sees real names, logos, and full branding for all suppliers
- Cannot access supplier reviews
- Cannot submit sourcing support requests

### Premium+

- Everything Premium has, plus:
- Can access **supplier reviews**
- Can receive deals newsletter **daily** instead of weekly
- Can submit **unlimited custom sourcing support requests**

### Supplier

- Can send enquiries to **Supplier Pro** accounts
- Can enquire about **Supplier Pro** deals, including add to enquiry list
- Can view **Supplier Pro** contact details
- Can receive **weekly** deals newsletter
- Can list up to **100 deals per month**
- Cannot send enquiries to regular **Supplier** accounts
- Cannot view regular **Supplier** contact details
- Cannot access supplier reviews

### Supplier Pro

- Can send enquiries to **Supplier** and **Supplier Pro** accounts
- Can enquire about deals from **Supplier** and **Supplier Pro**, including add to enquiry list
- Can view **Supplier** and **Supplier Pro** contact details
- Can click up to **500 Supplier website URLs per month**
- Can access **supplier reviews**
- Can receive deals newsletter **daily** instead of weekly
- Can list **unlimited deals per month**

## Feature Gating Matrix

Use this quick-reference when deciding what to show/hide in the UI.

### Messaging & Enquiry Access

| Feature | Guest | Free | Standard | Premium | Premium+ | Supplier | Supplier Pro |
|---|---|---|---|---|---|---|---|
| Send Enquiry to Supplier Pro | No | Yes | Yes | Yes | Yes | Yes | Yes |
| Send Enquiry to Supplier | No | No | No | Yes | Yes | No | Yes |
| Enquire Supplier Pro deals | No | Yes | Yes | Yes | Yes | Yes | Yes |
| Enquire Supplier deals | No | No | Yes | Yes | Yes | No | Yes |
| Add to Enquiry list | No | Yes | Yes | Yes | Yes | Yes | Yes |

### Contact & Content Access

| Feature | Guest | Free | Standard | Premium | Premium+ | Supplier | Supplier Pro |
|---|---|---|---|---|---|---|---|
| View Supplier Pro contacts | No | Yes | Yes | Yes | Yes | Yes | Yes |
| View Supplier contacts | No | No | No | Yes | Yes | No | Yes |
| Supplier website URLs | No | No | No | 500/mo | 500/mo | No | 500/mo |
| Supplier reviews | No | No | No | No | Yes | No | Yes |
| Deal attachments | No | No | Yes | Yes | Yes | Yes | Yes |

### Branding & Identity Visibility

| Feature | Guest | Free | Standard | Premium | Premium+ | Supplier | Supplier Pro |
|---|---|---|---|---|---|---|---|
| See real supplier names | No | Supplier Pro only | All | All | All | Supplier Pro only | All |
| See company logos | No | Supplier Pro only | Supplier Pro only | All | All | Supplier Pro only | All |
| See full branding | No | Supplier Pro only | Supplier Pro only | All | All | Supplier Pro only | All |

When a user cannot see real supplier names, an anonymous identifier is shown (e.g. "Supplier #4821"). When a user cannot see company logos, a generic placeholder icon is rendered instead.

### Newsletter & Support

| Feature | Guest | Free | Standard | Premium | Premium+ | Supplier | Supplier Pro |
|---|---|---|---|---|---|---|---|
| Deals newsletter | No | Weekly | Weekly | Weekly | Daily | Weekly | Daily |
| Sourcing support requests | No | No | No | No | Unlimited | No | No |

### Deal Listing (Supplier only)

| Feature | Supplier | Supplier Pro |
|---|---|---|
| Deal listings per month | 100 | Unlimited |

## CTA Button Logic

### Deal Page CTA (Enquiry List)

The main deal page CTA follows this logic:

```
if (not logged in) → Lock icon + "Join Now!" → opens register modal
if (logged in AND can enquire about this deal) → ClipboardList icon + "Add to Enquiry List"
if (logged in AND cannot enquire about this deal) → Lock icon + "Send Enquiry" → /pricing
```

Whether a user "can enquire about this deal" depends on the deal's supplier type and the user's tier (see Messaging & Enquiry Access matrix above).

### Deal Card & Supplier Card CTA (Send Enquiry)

Deal cards and supplier cards use a "Send Enquiry" button with three-tier gating:

```
if (canContact) → MessageSquare icon + "Send Enquiry" (blue bg) → opens contact modal
if (isLoggedIn AND !canContact) → Lock icon + "Send Enquiry" (orange bg) → /pricing
if (!isLoggedIn) → Lock icon + "Join Now!" (orange bg) → opens register modal
```

### Call Now Button (Supplier Cards only)

Supplier cards also display a "Call Now" button with matching three-tier gating:

```
if (canContact) → Phone icon + "Call Now" (orange outline) → triggers call action
if (isLoggedIn AND !canContact) → Lock icon + "Call Now" (orange outline) → /pricing
if (!isLoggedIn) → Phone icon + "Call Now" (orange outline) → opens register modal
```

## Attachments Gating

Deal attachments (supplier documents, certificates, media files) are gated by tier:

```
if (not logged in) → Blurred file preview + lock overlay card → "Log In / Register" → /register
if (logged in AND Free) → Blurred file preview + lock overlay card → "View Plans" → /pricing
if (logged in AND Standard+) → Full file list with grouping, descriptions, download buttons
```

The locked state shows the actual attachment list blurred behind a semi-transparent overlay with a floating card containing a lock icon, description, and CTA. This creates a "see what you're missing" effect. If the deal has no attachments, placeholder files are shown blurred instead.

Supplier accounts (Supplier, Supplier Pro) have the same access as Standard+ for viewing other suppliers' attachments.

## Website URL Click Limits

Premium, Premium+, and Supplier Pro accounts can click up to 500 supplier website URLs per month. The click limit applies to outbound links routed through `/go?url=...&type=website`. When the limit is reached, the link should show a lock overlay directing to `/pricing` (or a "limit reached" message for Supplier Pro).

All other tiers see blurred/scrambled website URLs and cannot click through.

## Interactive Features

### Hide / Favourite (Deal & Supplier Cards)

All logged-in users can:
- **Hide** a deal or supplier card (eye-off icon) — removes it from their current view
- **Favourite** a deal or supplier card (heart icon) — saves it to their favourites list

These actions are available on deal cards (`/deals`) and supplier cards (`/suppliers`). Guest users do not see these controls.

### Report Invalid

All logged-in users can report invalid supplier contact details by clicking an "(invalid?)" link next to each contact field (phone, email, address, website) on supplier cards. This sends a report to WholesaleUp for review. Guest users do not see these links.

## Implementation Notes

### Key Variables in Codebase

- `isLoggedIn` — whether the user has an active session
- `isPremium` — whether the user is Premium, Premium+, or Supplier Pro
- `isPremiumPlus` — whether the user is Premium+ (for daily newsletter, reviews, sourcing support)
- `canViewSupplier` — whether the user can see supplier contact details for this specific supplier (factors in both user tier and supplier type)
- `canContact` — on supplier cards: `isPremium || (isLoggedIn && supplier.isSupplierPro)` — determines button state and detail visibility
- `demoRole` — current demo role for testing gating (guest, free, standard, premium, premium-plus, supplier, supplier-premium)

### Standard vs Free on /suppliers

On the `/suppliers` page, Standard users have the same visibility as Free users — they cannot see regular Supplier contact details and see blurred text for those fields. This is because Standard can only *enquire about* Supplier deals (via deal pages), not directly contact Suppliers. The `canContact` check on supplier cards uses `isPremium` (not `canViewSupplier`) to enforce this.

### Enquiry List (replaces Cart)

The platform does not process direct transactions. The "Add to Enquiry List" action adds a deal to the user's enquiry list. From the enquiry list, the user can send a grouped enquiry to a supplier, which starts a conversation in `/dashboard/messages` centred around those specific deals. The header icon for this is `ClipboardList` (not a shopping cart).

### BlurredText Component

The `BlurredText` component receives an `isPremium` boolean prop. When `false`, it renders scrambled/blurred placeholder text instead of real data. Used for supplier contact details (phone, email, address, website) that should be hidden from lower-tier users. The `isPremium` prop should always reflect the actual gating logic (typically `canContact`) — never hardcoded to `false`.
