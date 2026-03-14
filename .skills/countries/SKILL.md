---
name: countries
description: |
  **WholesaleUp Countries Reference**: Single source of truth for country data, ISO codes, FlagImg components, priority markets, and country group labels. Reference this skill whenever working with country dropdowns, flag rendering, ISO code lookups, phone codes, shipping country displays, country filters, or any UI that involves country selection or display. Covers COUNTRIES array structure, PHONE_CODES, two FlagImg implementations (shared vs deal-v2), priority market ordering, country group labels, and known technical debt. MANDATORY TRIGGERS: country, countries, flag, FlagImg, ISO code, country code, phone code, country dropdown, country select, country filter, shipping countries, priority markets, country groups, flagcdn
---

# Countries Reference — WholesaleUp

## Canonical Source

The single source of truth for country data is:

```
src/components/shared/form-fields.jsx
```

This file exports three country-related constants:

| Export | Purpose | Structure |
|--------|---------|-----------|
| `COUNTRIES` | Dropdown/select lists, country lookups | `{ value: "Name", label: "Name", iso: "xx" }` |
| `PHONE_CODES` | Phone number country selectors | `{ country: "Name", code: "+XX", iso: "xx" }` |
| `FlagImg` | Flag image component | `FlagImg({ iso, size })` → `<img>` from flagcdn.com |

All 195+ UN-recognised countries are included. `COUNTRIES` is ordered with priority markets first (UK, US, DE, FR, IT, ES, NL, BE, CA, AU, PL, SE, NO, DK, IE, PT, GR, AT, CH), then all others alphabetically.

---

## ISO 3166-1 Alpha-2 Codes

All country codes in WholesaleUp use **lowercase ISO 3166-1 alpha-2** (2-letter) codes. Examples:

| Country | ISO | Country | ISO |
|---------|-----|---------|-----|
| United Kingdom | `gb` | France | `fr` |
| United States | `us` | Italy | `it` |
| Germany | `de` | Spain | `es` |
| Netherlands | `nl` | Belgium | `be` |
| Poland | `pl` | Portugal | `pt` |
| Sweden | `se` | Austria | `at` |
| Ireland | `ie` | Switzerland | `ch` |
| Australia | `au` | Canada | `ca` |
| Japan | `jp` | South Korea | `kr` |
| China | `cn` | India | `in` |
| Brazil | `br` | Mexico | `mx` |
| Turkey | `tr` | Russia | `ru` |
| Belarus | `by` | Ukraine | `ua` |
| South Africa | `za` | New Zealand | `nz` |
| Singapore | `sg` | Hong Kong | `hk` |
| UAE | `ae` | Saudi Arabia | `sa` |
| Thailand | `th` | Malaysia | `my` |
| Indonesia | `id` | Philippines | `ph` |
| Vietnam | `vn` | Czech Republic | `cz` |
| Hungary | `hu` | Romania | `ro` |
| Bulgaria | `bg` | Croatia | `hr` |
| Greece | `gr` | Luxembourg | `lu` |
| Slovakia | `sk` | Slovenia | `si` |
| Estonia | `ee` | Latvia | `lv` |
| Lithuania | `lt` | Malta | `mt` |
| Cyprus | `cy` | Finland | `fi` |
| Norway | `no` | Denmark | `dk` |
| Iceland | `is` | Israel | `il` |

**Note:** The UK uses `gb` (not `uk`). This is the ISO standard. The codebase handles `uk` → `gb` mapping in the FlagImg component in `deal-v2/utils.jsx`.

---

## FlagImg Component

Two implementations exist — use the appropriate one based on context:

### 1. Shared (forms, profiles, dashboards)
```js
import { FlagImg } from "@/components/shared/form-fields";
// Props: iso (string), size (number, default 20)
<FlagImg iso="gb" size={16} />
```

### 2. Deal v2 pages (deal page, pricing panel, tabs)
```js
import { FlagImg } from "./utils";
// Props: code (string), size (number, default 20)
<FlagImg code="gb" size={16} />
```

Both render `<img src="https://flagcdn.com/w40/{iso}.png">` with height = size × 0.7.

---

## Priority Markets

These 19 countries appear first in all dropdowns and are WholesaleUp's primary markets:

1. United Kingdom (gb)
2. United States (us)
3. Germany (de)
4. France (fr)
5. Italy (it)
6. Spain (es)
7. Netherlands (nl)
8. Belgium (be)
9. Canada (ca)
10. Australia (au)
11. Poland (pl)
12. Sweden (se)
13. Norway (no)
14. Denmark (dk)
15. Ireland (ie)
16. Portugal (pt)
17. Greece (gr)
18. Austria (at)
19. Switzerland (ch)

---

## Country Groups

These group labels appear in shipping/delivery contexts and are **not** individual countries:

| Group label | Meaning |
|-------------|---------|
| All EU countries | 27 EU member states |
| All EEA countries | EU + Norway, Iceland, Liechtenstein |
| Worldwide | No geographic restriction |
| Europe | Entire European continent |

When rendering shipping countries, separate group labels from concrete countries. Groups get a Globe icon; concrete countries get their flag.

---

## Conventions

### Data model fields
- `countryCode` — always lowercase ISO alpha-2 (e.g. `"gb"`)
- `country` — always full English name (e.g. `"United Kingdom"`)
- Both fields should be stored together when possible

### Demo data
- `shipsFrom` — full name, paired with `shipsFromCode`
- `manufacturingCountry` — full name, paired with `manufacturingCountryCode`
- `shippingCountries` — array of full names and/or group labels
- `countryRestrictions` — array of **uppercase** ISO codes (e.g. `["RU", "BY"]`)
  - Note: this is the one exception where uppercase codes are used
  - Always resolve to full names before displaying to users

### Lookups
When you need to convert between names and codes:
```js
// Name → ISO code (for flags)
import { COUNTRIES } from "@/components/shared/form-fields";
const iso = COUNTRIES.find(c => c.value === name)?.iso;

// ISO code → Name (for display)
const name = COUNTRIES.find(c => c.iso === code.toLowerCase())?.value;
```

Do NOT create inline lookup maps. Use the canonical `COUNTRIES` array.

---

## Known Technical Debt

1. **Multiple FlagImg implementations** — 8+ local copies exist across `phases/` files (deal-cards.jsx, filters.jsx, homepage.jsx, single-deal.jsx, suppliers.jsx, supplier-profile.jsx). Each has its own partial FLAG_CODES map. These should all import from the shared source.

2. **Inline COUNTRY_CODES maps** — `product-tabs.jsx` has a 50+ entry name→code map and a separate CODE_NAMES map for restrictions. Both should use the canonical COUNTRIES array instead.

3. **Inconsistent FlagImg props** — shared version uses `iso` prop, deal-v2 version uses `code` prop. Should be unified.

4. **countryRestrictions uppercase convention** — only place in the codebase using uppercase ISO codes. Consider migrating to lowercase for consistency.
