---
name: form-standards
description: "**WholesaleUp Form & Accessibility Standards**: Reference this skill whenever building, editing, or reviewing any form, input field, dropdown, modal, or interactive UI component in the WholesaleUp project. Covers accessibility (ARIA, WCAG 2.2), keyboard navigation, validation UX, security, trust signals, mobile UX, internationalization, and component patterns. MANDATORY TRIGGERS: form, input, field, select, dropdown, modal, checkbox, radio, toggle, validation, error, accessibility, ARIA, keyboard navigation, screen reader, a11y, WCAG"
---

# WholesaleUp Form Standards

Reference document for all form-related development in the WholesaleUp project (Next.js 15 + React 19). Consult this before creating or modifying any form, input, dropdown, modal, or interactive control.

Last updated: 2026-03-07

---

## 1. Accessibility (ARIA & WCAG 2.2)

Every interactive form element must meet these baseline requirements. Screen reader users depend on these attributes to understand form structure, state, and errors.

### 1.1 Input Fields

Every `<input>`, `<textarea>`, and `<select>` must have:

| Attribute | When | Example |
|-----------|------|---------|
| `id` | Always | `id="email"` |
| `<label htmlFor={id}>` | Always — floating labels still need `htmlFor` | `<label htmlFor="email">` |
| `required` + `aria-required` | On required fields (use both for max compatibility) | `required aria-required={true}` |
| `aria-invalid` | When field has error | `aria-invalid={!!error}` |
| `aria-describedby` | When error message or hint shown | `aria-describedby="email-error"` |
| `inputMode` | On mobile-optimized fields | `inputMode="email"`, `inputMode="tel"`, `inputMode="numeric"` |

**Use both `required` and `aria-required`:** The native `required` attribute provides semantic meaning and browser support; `aria-required` ensures older screen readers also recognize the field. Both work with `noValidate` on the form — `noValidate` only disables the browser validation UI, not the semantic attribute.

Error messages must have a matching `id`:
```jsx
<input id="email" required aria-required={true}
  aria-describedby={error ? "email-error" : undefined} aria-invalid={!!error} />
{error && <p id="email-error" role="alert">{error}</p>}
```

**Mobile input modes:** Use `inputMode` to trigger the correct mobile keyboard:

| Field | inputMode | type |
|-------|-----------|------|
| Email | `email` | `email` |
| Phone | `tel` | `tel` |
| Numeric (quantity, price) | `numeric` | `text` |
| URL | `url` | `url` |
| Search | `search` | `search` |

### 1.2 Custom Dropdowns (FloatingSelect pattern)

Custom dropdowns that replace native `<select>` require full ARIA combobox or listbox semantics:

**Trigger button:**
```jsx
<button
  role="combobox"
  aria-haspopup="listbox"
  aria-expanded={open}
  aria-controls="listbox-id"
  aria-activedescendant={open ? `opt-${highlightIdx}` : undefined}
  aria-autocomplete={isFilterable ? "list" : undefined}
  aria-required={required || undefined}
  aria-invalid={!!error || undefined}
  aria-describedby={error ? errorId : undefined}
/>
```

If the dropdown filters options based on typed input, add `aria-autocomplete="list"`. If it also shows inline suggestions, use `aria-autocomplete="both"`.

**Dropdown panel:**
```jsx
<div role="listbox" id="listbox-id" aria-label="Field label">
  <div role="option" id="opt-0" aria-selected={value === opt.value}>...</div>
</div>
```

**Typeahead:** For dropdowns with 10+ options, implement typeahead — pressing a letter key jumps to the first matching option. This significantly improves accessibility for mobility-impaired users and voice control users.

### 1.3 Tabs

Tab bars use the WAI-ARIA tabs pattern:

```jsx
<div role="tablist" aria-label="Account">
  <button role="tab" aria-selected={active} aria-controls="panel-id" id="tab-id">
    Tab Label
  </button>
</div>
<div role="tabpanel" id="panel-id" aria-labelledby="tab-id">
  ...content...
</div>
```

### 1.4 Toggles / Switches

```jsx
<button role="switch" aria-checked={checked} id={id} onClick={onChange}>
```

### 1.5 Password Toggle

- Use a `<button>` (natively focusable — no explicit `tabIndex` needed)
- `aria-label={show ? "Hide password" : "Show password"}`
- `aria-pressed={show}`
- `focus-visible:ring` for visible keyboard focus

### 1.6 Live Regions & Status Messages (WCAG 4.1.3)

Dynamic content that changes without user interaction must be announced. Choose the right role based on urgency:

| Content | Attribute | Urgency |
|---------|-----------|---------|
| Availability check results (username/email) | `role="status"` (implicit `aria-live="polite"`) | Low — waits for pause |
| Error summary panels | `role="alert"` (implicit `aria-live="assertive"`) | High — interrupts |
| Lockout / rate-limit banners | `role="alert"` | High |
| Breach check results | `role="alert"` on breach warning | High |
| Form success messages | `role="status"` or announced via focus move | Low |
| "Checking..." loading text | `aria-live="polite"` with `aria-atomic="true"` | Low |

**Timing:** Delay error announcements by ~500ms after user stops typing to avoid overwhelming screen reader users with rapid announcements on every keystroke.

**Never use `role="alert"` for non-critical status updates.** Excessive assertive messages create a poor experience for screen reader users; `role="status"` (polite) allows them to finish their current task.

### 1.7 Modals

```jsx
<div role="dialog" aria-modal="true" aria-label="Login">
```

- **Focus trap:** Query all focusable elements; on Tab at last, wrap to first; on Shift+Tab at first, wrap to last
- Escape key closes modal
- Close button: `aria-label="Close modal"`
- **Return focus** to trigger element on close (e.g., the "Login" button that opened the modal)
- Elements outside modal should have `inert` attribute or `aria-hidden="true"` while modal is open
- If modal has sticky footer, apply `scroll-padding-bottom` to prevent focus obscuring (WCAG 2.4.11)

### 1.8 Filter Sections (Collapsible)

```jsx
<button aria-expanded={open} aria-controls="section-content-id">
  Section Title
</button>
<div id="section-content-id">...content...</div>
```

### 1.9 Radio Groups (e.g., Rating Filters)

Use native `<input type="radio">` with associated labels, or `<div role="radio">` — never `<label role="radio">` (overrides label semantics):

```jsx
<div role="radiogroup" aria-label="Minimum rating">
  <div role="radio" aria-checked={selected === value} tabIndex={selected === value ? 0 : -1}>
    ...
  </div>
</div>
```

Or with native elements (preferred):
```jsx
<fieldset>
  <legend>Minimum rating</legend>
  <input type="radio" id="rating-5" name="rating" value="5" />
  <label htmlFor="rating-5">5 Stars</label>
</fieldset>
```

### 1.10 Icon-Only Buttons

Every button with only an icon (no visible text) needs `aria-label`:

```jsx
<button aria-label="Close filters"><X size={16} /></button>
<button aria-label="Remove Electronics filter"><X size={12} /></button>
<button aria-label="Clear search"><X size={14} /></button>
```

### 1.11 Form Inputs Without Visible Labels

When using `placeholder` instead of a visible label:
```jsx
<input aria-label="Email address for newsletter" placeholder="Your email address" required />
```

**Placeholder pitfalls — never rely on placeholder as the sole label:**
- Placeholder text disappears when user types, creating memory burden
- Browser default placeholder color (`#999`) fails WCAG AA contrast — use `text-slate-500` minimum
- Users with cognitive disabilities (ADHD, autism) struggle when placeholders vanish
- Always provide a persistent label via `<label>`, `aria-label`, or `aria-labelledby`

### 1.12 Color-Not-Alone Indicators (WCAG 1.4.1)

Never use color as the sole indicator of state. Always combine color with text, icons, or border changes:

| State | Color | Additional non-color indicator |
|-------|-------|-------------------------------|
| Error | Red border | `<XCircle>` icon + error text message |
| Valid | Green border | `<CheckCircle2>` icon |
| Required | Red asterisk | Asterisk character `*` (visible text) |
| Focus | Orange border | Outline ring (visible shape change) |

### 1.13 Voice Control Compatibility

All form elements are voice-control compatible when they are keyboard-accessible with clear labels. Ensure visible labels match `aria-label` or `aria-labelledby` text — voice users say the visible label to activate controls.

### 1.14 WCAG 2.2 New Criteria

**3.3.7 Redundant Entry (Level A):** Don't ask users to re-enter information they already provided in the same session. Pre-populate fields from previous steps. Exception: re-entering passwords for security confirmation is acceptable.

**3.3.8 Accessible Authentication (Level AA):** Never block password manager autofill or paste into password fields. Never use `autocomplete="off"` on authentication fields. Provide alternative authentication methods (social login, email OTP, WebAuthn/passkeys) alongside passwords.

**2.4.11 Focus Not Obscured (Level AA):** When forms sit below sticky headers, use `scroll-padding-top` on the scroll container to prevent focused fields from being hidden:
```css
.form-container { scroll-padding-top: 120px; } /* header height + buffer */
```

**2.5.7 Dragging Movements (Level AA):** If any form uses drag-and-drop (file upload reordering, etc.), provide a single-pointer alternative (up/down buttons, text input).

**2.5.8 Target Size (Level AA):** Minimum 24×24 CSS pixels for interactive elements. Our 44×44px standard exceeds this — maintain it.

---

## 2. Keyboard Navigation

### 2.1 Tab Order

- Follow visual reading order (top-to-bottom, left-to-right)
- Don't use `tabIndex` values > 0
- Don't add `tabIndex={0}` to natively focusable elements (`<button>`, `<input>`, `<a>`)
- Only use `tabIndex={-1}` when intentionally removing from tab order
- Enforce with `eslint-plugin-jsx-a11y` linter rules

### 2.2 Custom Dropdown Keyboard Support

| Key | Action |
|-----|--------|
| Enter / Space | Open dropdown (when closed), select highlighted option (when open) |
| ArrowDown | Move highlight to next option |
| ArrowUp | Move highlight to previous option |
| Escape | Close dropdown without selecting |
| Home | Jump to first option |
| End | Jump to last option |
| Tab | Close dropdown, move focus to next element |
| Letter keys | Typeahead — jump to first matching option (for dropdowns with 10+ options) |

### 2.3 Modal Keyboard

| Key | Action |
|-----|--------|
| Escape | Close modal |
| Tab / Shift+Tab | Cycle within modal (focus trap) |

### 2.4 Reduced Motion

Respect `prefers-reduced-motion: reduce`. All animations and transitions must degrade gracefully:

**globals.css:**
```css
@media (prefers-reduced-motion: reduce) {
  .animate-slideUp, .animate-spin {
    animation: none !important;
  }
  *, *::before, *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

**JavaScript auto-rotation** (testimonials, carousels): Check `window.matchMedia("(prefers-reduced-motion: reduce)")` before starting `setInterval`. Listen for changes and pause when enabled.

**JavaScript detection:**
```js
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const prefersReducedMotion = motionQuery.matches;
motionQuery.addEventListener("change", (e) => { /* pause/resume animations */ });
```

### 2.5 Touch Target Sizes

All interactive elements must have a minimum 44×44 CSS pixels touch target area (exceeds WCAG 2.5.8 minimum of 24×24):

| Element | Implementation |
|---------|---------------|
| Password eye toggle | `min-w-[44px] min-h-[44px] flex items-center justify-center` |
| Toggle switch | `w-11 h-6` track + `min-h-[44px]` on parent label |
| Toast dismiss button | `min-w-[44px] min-h-[44px]` |
| Social login buttons | `min-h-[44px] py-3` |
| Dropdown options | `py-3` (38px+) — acceptable for mouse; consider `py-3.5` for mobile |

Use negative margins (e.g., `-mr-2`) to maintain visual alignment when expanding the hit area. Avoid slider inputs on mobile — use segmented buttons, number inputs, or dropdowns instead.

### 2.6 Focus Appearance (WCAG 2.4.13)

Focus indicators must be clearly visible:
- Minimum 2px solid ring with 3:1 contrast ratio against adjacent colors
- Tailwind's `focus-visible:ring-2 focus-visible:ring-orange-400` meets this standard
- Verify ring is visible on both white and colored field backgrounds
- Never suppress focus outlines (`outline: none`) without providing a visible alternative

---

## 3. Visual Quality

### 3.1 Color Contrast (WCAG AA)

All text must meet WCAG AA minimum contrast ratio of 4.5:1 against its background (3:1 for large text ≥18px bold or ≥24px regular).

**Standard text colors on white:**

| Purpose | Color | Ratio vs white |
|---------|-------|----------------|
| Default label (unfloated) | `text-slate-500` | ~5.6:1 ✓ |
| Error label / error text | `text-red-600` | ~4.6:1 ✓ |
| Valid label | `text-emerald-600` | ~4.5:1 ✓ |
| Focus label | `text-orange-500` | ~3.6:1 (large text OK) |
| Hint/micro-copy text | `text-slate-500` | ~5.6:1 ✓ |
| Divider text | `text-slate-500` | ~5.6:1 ✓ |
| Toggle label text | `text-slate-600` | ~7.0:1 ✓ |
| Input text | `text-slate-800` | ~12.6:1 ✓ |

**Never use `text-slate-400`** for text that must be readable — it fails contrast at ~4.0:1.

**Verify contrast on colored backgrounds:** The ratios above are for white (`bg-white`). When fields use colored backgrounds (e.g., `bg-emerald-50/40` for valid, `bg-red-50/40` for error), re-verify contrast with WebAIM Contrast Checker. Text on colored field backgrounds may have lower contrast than on pure white.

**Automated testing:** Use `axe-core` or WAVE in CI/CD to enforce contrast compliance. Manual spot-checking is insufficient for large forms.

### 3.2 Browser Autofill Styling

Override Chrome/Safari autofill backgrounds in **globals.css** to prevent clashing with field state colors:
```css
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px white inset !important;
  -webkit-text-fill-color: #1e293b !important; /* text-slate-800 */
  transition: background-color 5000s ease-in-out 0s;
}
```

Modern browsers (Chrome 102+, Safari 16+) also support the `:autofill` pseudo-class. Consider layering progressive enhancement for newer browsers while keeping the `-webkit-` fallback.

### 3.3 Field State Transition Micro-Interactions

All field state changes (focus, blur, validation) should use smooth transitions:
- Label float: `transition-all duration-200`
- Border color change: `transition-colors duration-150`
- Error icon appearance: `transition-opacity duration-150`
- Status icon (valid/error): fade in, don't pop

Respect `prefers-reduced-motion` — suppress all transition durations when enabled (see Section 2.4).

---

## 4. Validation UX

### 4.1 Error Prevention First

**Prevent errors before they happen** — this is more effective than recovering from them:

| Strategy | Example |
|----------|---------|
| Use constrained input types | `type="email"`, `type="tel"`, `type="date"` |
| Set min/max/step on numeric fields | `<input type="number" min="1" max="9999" step="1" />` |
| Provide format hints near the field | "e.g., DD/MM/YYYY" via `aria-describedby` |
| Use dropdowns instead of free text | Country, state, category selectors |
| Pre-populate known data | Auto-fill from session, profile, or previous steps |

### 4.2 Validation Timing

- **onBlur**: Validate individual field when user leaves it (only if field is non-empty)
- **onChange**: Clear existing error as user types (don't show new errors while typing — this causes cognitive load and higher error rates per usability research)
- **onSubmit**: Validate all fields, show error summary, focus first errored field

**Key research finding:** Real-time validation (showing errors while typing) increases error rates and slows completion. Users switch between "completion mode" and "revision mode" — interrupting completion mode with instant errors is harmful. Validate on blur and submit only.

**Delayed onBlur pattern:** Use a 120ms `setTimeout` on blur to prevent race conditions with click events (e.g., clicking a dropdown option triggers blur before click):
```jsx
onBlur={(e) => {
  setFocused(false);
  if (onBlur) { const ev = e; setTimeout(() => onBlur(ev), 120); }
}}
```

**Focus first errored field on submit:**
```jsx
if (Object.values(errs).some(Boolean)) {
  document.getElementById(Object.keys(errs).find((k) => errs[k]))?.focus();
  return;
}
```

### 4.3 Error Display

- Inline error below field: `<p class="text-xs text-red-600 mt-1 ml-1">`
- Error summary panel at top of form on submit (clickable rows that focus the errored field)
- Error summary uses `role="alert"` so screen readers announce it
- Error panel header shows count: "Please fix 3 errors below"
- **Never use toast notifications as sole error display** — toasts disappear before users read them and appear far from the field. Always show errors inline.

**Error message tone:** Use clear, helpful language. Avoid "Invalid input" — instead use "Please enter a valid email address (e.g., user@example.com)". Show specific correction suggestions per WCAG 3.3.3 (Error Suggestion), except for password fields where suggestions could leak security requirements.

**Error severity levels:**

| Level | Display | Use |
|-------|---------|-----|
| Field-level | Inline `<p>` below field | Validation errors |
| Form-level | Error summary panel with scroll-to links | Submit failures |
| Critical | `role="alert"` banner | Security alerts, rate limiting, breach detection |

### 4.4 Field States (Visual)

| State | Border | Background | Label Color |
|-------|--------|------------|-------------|
| Default | `border-slate-200` | `bg-white` | `text-slate-500` |
| Focused | `border-orange-400 outline outline-2 outline-orange-100` | `bg-white` | `text-orange-500` |
| Filled (valid) | `border-emerald-400 outline outline-1 outline-emerald-100` | `bg-emerald-50/40` | `text-emerald-600` |
| Error | `border-red-300 outline outline-1 outline-red-100` | `bg-red-50/40` | `text-red-600` |

**Field container styling:** All input containers use an inset shadow for depth:
```
shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)]
```

**Submit button styling:** Primary buttons use a subtle outer shadow:
```
shadow-[0px_2px_4px_rgba(0,0,0,0.1)]
```

### 4.5 Status Icons (Right Side of Input)

| State | Icon | Screen reader |
|-------|------|---------------|
| Error | `<XCircle>` red | Announced via `aria-describedby` error text |
| Valid | `<CheckCircle2>` green | Announced via `aria-live="polite"` status |
| Checking | `<Loader2>` orange, spinning | "Checking..." via `aria-live="polite"` |

Never rely on icons alone — always pair with text for screen readers.

### 4.6 Email Validation Regex

```js
/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,12}$/
```

### 4.7 Password Rules

All four must pass to submit:
1. Length >= 8 characters
2. At least one uppercase letter (A-Z)
3. At least one number (0-9)
4. At least one special character (!@#$...)

**NIST SP 800-63B note:** Modern guidance favors longer passphrases over complexity requirements. Consider accepting 12+ character passwords without special character requirements as an alternative. Never enforce password expiration policies.

### 4.8 Password Strength Indicator

Rule pills display inline with `flex-nowrap` and `shrink-0` to prevent wrapping on narrow screens:
```jsx
<div className="flex flex-nowrap items-center gap-1.5">
  {rules.map((r) => (
    <span className={`shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-px rounded ...`}>
```
Strength levels: Weak (red, score 0–1), Fair (amber, score 2–3), Strong (emerald, score 4–5). Bonus +1 if password length >= 12.

### 4.9 Form Element Pattern

All `<form>` elements must use `noValidate` to disable browser-native validation (we handle validation in JS):
```jsx
<form onSubmit={handleSubmit} noValidate>
```

### 4.10 autoComplete Attribute Values

| Field Type | autoComplete Value |
|------------|-------------------|
| Email | `email` |
| Username | `username` |
| New password (registration) | `new-password` |
| Current password (login) | `current-password` |
| Full name | `name` |
| Phone | `tel` |
| Address | `street-address` |
| City | `address-level2` |
| Country | `country-name` |
| Other fields | `off` |

**Never use `autocomplete="off"` on authentication fields** — this blocks password managers and violates WCAG 3.3.8 Accessible Authentication.

---

## 5. Security

### 5.1 CSRF

- NextAuth `signIn()` / `signOut()` → automatic CSRF
- Next.js Server Actions → automatic CSRF
- Custom API routes → use `getCsrfToken()` from next-auth/react

### 5.2 Rate Limiting (Client-Side)

Use the `useRateLimit` hook with escalating lockout:

```js
useRateLimit({
  maxAttempts: 5,      // attempts before lockout
  baseLockout: 30,     // seconds (first lockout)
  escalation: 2,       // multiplier per round
  maxLockout: 300,     // cap in seconds
  warnAfter: 3         // show warning after N failed attempts
})
```

Lockout banners use `role="alert"`.

**Production note:** Client-side rate limiting is UX-only. Server-side rate limiting is mandatory for production. Use `@upstash/ratelimit` with Redis, or `express-rate-limit` for API routes. Typical threshold: 5-10 attempts per 15-minute window with exponential backoff.

### 5.3 reCAPTCHA v3

- All forms use invisible reCAPTCHA v3 (no user interaction)
- Badge hidden via CSS; required legal text shown via `<RecaptchaNotice>`
- Token obtained via `executeRecaptcha("action_name")` before submit
- Wrap in try/catch — fail gracefully (proceed without token if reCAPTCHA unavailable)

### 5.4 Password Breach Checking

- HIBP Pwned Passwords API with k-anonymity (SHA-1 prefix only)
- 800ms debounce on typing
- `Add-Padding: true` header
- Fails open (API error doesn't block registration)
- Block submit if breach detected; show red alert with `role="alert"`

**Real-time server check pattern** (generalizable to email/username availability): Debounce to 800ms+, show "Checking..." status with `<Loader2>` icon and `aria-live="polite"`, show result as green checkmark or red error. Never block submission on in-progress checks — validate definitively on blur/submit.

### 5.5 Remember Me

- "Remember Me" controls session duration via NextAuth JWT callback `maxAge`
- Unchecked = 30-day session; checked = 90-day session
- Implementation: pass `remember` boolean through `signIn()` options; handle in JWT callback
- Comment: `// 🔧 PRODUCTION: "Remember Me" controls session maxAge via NextAuth JWT callback.`

### 5.6 Email Enumeration Prevention

- Forgot password always shows success regardless of whether account exists
- Comment: `/* SECURITY: always show success — never reveal account existence */`

### 5.7 Input Sanitization

- React's default JSX escaping handles XSS
- Never use `dangerouslySetInnerHTML` or `innerHTML`
- Verify no raw HTML injection paths exist

### 5.8 CSP Headers (next.config.js)

Required directives:
- `default-src 'self'`
- `script-src` with reCAPTCHA domains
- `connect-src` with HIBP API
- `frame-src` for reCAPTCHA iframe
- `object-src 'none'`
- `base-uri 'self'`
- `frame-ancestors 'none'`

---

## 6. Trust Signals

### 6.1 Security Badge

Near submit buttons, show via `<RecaptchaNotice>`:
```
🛡 256-bit SSL encrypted · Your data is secure
Protected by reCAPTCHA — Privacy · Terms
```

### 6.2 Email Privacy Hint

On registration forms only (not login):
```
🛡 We'll never share your email with third parties
```

### 6.3 Social Proof

Above the register submit button:
```
👥 Join 900,000+ businesses already on WholesaleUp
```

### 6.4 Email Provider Shortcut

On success screens (verification, password reset), detect email domain and show:
```
[External Link icon] Open Gmail
```

Supported: Gmail, Outlook, Yahoo, iCloud, ProtonMail, Zoho, AOL.

### 6.5 Expiry Urgency

Password reset and verification emails: amber badge with Clock icon:
```
🕐 Link expires in 24 hours
```

Show specific remaining time where possible (e.g., "Expires in 23 hours 45 minutes") rather than vague timeframes. For very short expiries (<1 hour), use red background instead of amber.

---

## 7. Component Patterns

### 7.1 Floating Label Fields

Labels float above the input on focus or when filled. The `<label>` always has `htmlFor={id}`. Animation: `transition-all duration-200`.

**Floating behavior:**
- Default position: vertically centered (`top-1/2 -translate-y-1/2 text-sm`)
- Floated position: above input (`-top-2.5 text-xs font-semibold px-1 bg-white rounded`)
- Label floats on focus OR when field has a value (`const floated = focused || hasValue`)

**Required field asterisk:**
```jsx
{label}{required && <span className="text-red-400 ml-0.5">*</span>}
```

**Placeholder behavior:** Only visible when input is focused:
```jsx
placeholder={focused ? placeholder : ""}
```

**Accessibility note:** Floating labels must always have explicit `<label htmlFor>` association. The visual animation does not replace label semantics. For users with magnification or low vision, the floated label may move out of view — ensure `aria-describedby` links to a persistent hint when additional context is needed.

### 7.2 Resend Email Pattern

Consistent across verification and password reset success screens:
- "Didn't receive it? Check your spam folder or"
- Bordered pill button: "Resend verification email" / "Resend reset email"
- 60-second cooldown with countdown
- Uses `useVerificationEmail` hook

### 7.3 Masked Email Display

Show on success screens: `s••••@gmail.com` (first 3 chars + dots + domain).

### 7.4 Toggle Component

Visual switch (not checkbox). Uses `role="switch"` + `aria-checked`. Orange when on, slate when off, red border on error state (e.g., unchecked terms).

### 7.5 Error Summary Component

Red panel with header ("Please fix N errors below") and clickable rows. Each row shows field label + error message. Clicking focuses the errored field.

### 7.6 Social Login Buttons

Grid of 3: Google, Apple, Facebook. Each with brand icon, label text. `disabled` during form submission. Use "Continue with Google" per current Google branding guidelines. Consider adding passkey/WebAuthn as an additional option.

### 7.7 Unverified Email Banner

Login form shows an amber banner when user's email is unverified:
- Icon: `<Mail>` in amber circle
- "Email not verified" heading + explanation text
- "Resend verification email" pill button with cooldown
- Uses `useVerificationEmail` hook (same as registration success)

### 7.8 Last Login Display

Track and display last login info via `useLastLogin` hook:
- Stores timestamp + device info in localStorage
- On successful login, dispatch `show-last-login` CustomEvent
- Shell displays: "Last login: [date] from [device]"

### 7.9 Form Draft Persistence

Long forms (e.g., contact) save state to localStorage via `useFormDraft` hook to prevent data loss:

```jsx
const isFormEmpty = useCallback((f) => Object.values(f).every((v) => !v || !v.trim()), []);
const { clearDraft } = useFormDraft("contact-form", formState, setFormState, { isEmpty: isFormEmpty });
```

Features:
- Auto-saves to `localStorage` with 500ms debounce on every change
- Restores saved draft on mount
- Shows browser `beforeunload` warning if form has data
- `clearDraft()` must be called on successful submission
- Skips save/warn when `isEmpty()` returns true
- Storage key format: `wup-draft-{formId}`
- **Data retention:** Drafts should expire after 30 days maximum. Clear drafts on successful submission and on user logout. Consider GDPR implications — localStorage form data is personal data.

### 7.10 Loading & Submission States

- Submit buttons show `<Loader2>` spinner + "Sending..." / "Signing in..." text
- All form inputs + submit button `disabled` during submission
- `disabled:opacity-70 disabled:cursor-not-allowed` on submit buttons
- Social login buttons also disabled during submission

### 7.11 Success States

After successful form submission:
- Show clear success message with checkmark animation
- Use `role="status"` for screen reader announcement
- Either redirect after 1-2 seconds with clear indication, or show inline success with next-step guidance
- Timing: 0.2-0.5 seconds for visual feedback animations
- Clear form draft (call `clearDraft()`)

### 7.12 Enter Key Prevention in Search Dropdowns

Searchable dropdown inputs (MultiSelect, CountrySelect, CategorySelector, PhoneInput country code) must prevent Enter from triggering form submission. The Enter key should be consumed by the dropdown, not bubble up to the `<form>`:

```jsx
// All search inputs inside dropdowns:
onKeyDown={(e) => {
  if (e.key === "Enter") { e.preventDefault(); return; }
  // ... other key handling (Backspace to remove pills, etc.)
}}
```

This applies to every `<input>` element inside a dropdown overlay that sits within a `<form>`. Without this, typing gibberish and pressing Enter submits the form with validation errors.

### 7.13 Business Hours Grid

The `BusinessHoursGrid` component has these patterns:

**Status dropdown states with hover:**
```jsx
className={`... ${
  isOpen ? "border-orange-300 bg-orange-50 text-orange-700 font-medium hover:bg-orange-100"
  : isClosed ? "border-slate-300 bg-slate-100 text-slate-500 hover:border-slate-400"
  : "border-slate-200 bg-white text-slate-400 hover:border-orange-300 hover:text-slate-500"
} focus:border-orange-400`}
```

**"From" time filtering:** The "From" select filters options to only show times before the selected closing time. Shows red border when open >= close:
```jsx
className={`... ${slot.open && slot.close && slot.open >= slot.close ? "border-red-300 text-red-600" : "border-slate-200 text-slate-700"}`}
```

**Copy button logic (last edited day):** "Copy to weekdays" / "Copy to weekends" copies from the most recently edited day, tracked via `lastEditedRef`:
```jsx
const lastEditedRef = useRef(null);
const updateDay = (day, patch) => { lastEditedRef.current = day; onChange(...); };
const getCopySource = () => {
  const last = lastEditedRef.current;
  if (last && hours[last]?.status === "open") return last;
  return DAYS.find((d) => hours[d]?.status === "open") || null;
};
```

Button tooltips dynamically show the source day name: `"Copy {sourceDayName}'s hours to all weekdays"`.

**Holidays textarea — focus-only placeholder:**
```jsx
className="... placeholder-transparent focus:placeholder-slate-300"
placeholder="e.g. Closed 24 Dec–1 Jan, UK bank holidays, Easter Monday"
```

### 7.14 Font Size Consistency in Dropdowns

All dropdown components use `text-[15px]` (not `text-sm`) for both the selected value display and dropdown option text. This ensures the "Select..." placeholder and option text appear the same size. Applies to: FloatingSelect, CountrySelect, MultiSelect options, CategorySelector items.

### 7.15 Textarea Focus Placeholders

For textareas with floating labels, show placeholder text only when focused using Tailwind's `placeholder-transparent focus:placeholder-slate-300`:
```jsx
<textarea
  className="... placeholder-transparent focus:placeholder-slate-300"
  placeholder="e.g. 10% off orders over £5k, seasonal promos in Q4"
/>
```

This prevents the placeholder from competing with the floating label in the unfocused state.

### 7.16 Sidebar Persistence

The dashboard sidebar collapsed state persists across page reloads via `usePanelCollapse` hook:
```jsx
const [sidebarCollapsed, toggleSidebar] = usePanelCollapse("wup-sidebar-collapsed");
```

This hook uses `useLayoutEffect` to read from localStorage before first paint, preventing flash.

### 7.17 Progressive Disclosure

Show only essential fields initially. Reveal additional fields based on user selections or context:
- Use conditional rendering with smooth reveal animations (`max-height` transition or `animate-slideDown`)
- Respect `prefers-reduced-motion` for reveal animations
- Common pattern: "Optional — show advanced fields" toggle link below required fields
- For multi-step forms, see Section 8 below

---

## 8. Tab-Based Profile Forms & Progress

The dashboard uses tab-based profile forms (account-profile, buyer-profile, supplier-profile) with weighted progress tracking. All three follow a consistent architecture.

### 8.1 TAB_FIELDS Configuration

Every tab-based form defines a `TAB_FIELDS` config object that is the **single source of truth** for field classification. This config drives validation, progress computation, tab status indicators, and `findTabForField()` error navigation.

```jsx
const SUPPLIER_TAB_FIELDS = {
  "business-profile": { required: ["supplierType", "buyerTypesServed", "companyDescription", "supplyModels"], optional: ["customersServed"] },
  "products-supply": { required: ["productsOffered", "productCategories", "countriesServed"], optional: ["brandsDistributed", "productQualityTier", "certifications", "sampleAvailability", "catalogueSize", "excludedCountries"] },
  "orders-payments": { required: ["minimumOrderAmount", "paymentMethods", "deliveryMethods", "returnPolicy"], optional: ["preferredCurrency", "paymentTerms", "leadTime", "discountTiers", "discountNotes"] },
  "reach-operations": { required: ["companyWebsite"], optional: ["businessHours", "companyLogo", "socialFacebook", "socialInstagram", "socialLinkedin"] },
};
```

**Critical rule:** When moving a field between tabs or changing required/optional status, update **ALL** of these in lockstep:
1. `TAB_FIELDS` config (field placement + required/optional)
2. `REQUIRED_FIELDS` map (for error messages — only required fields)
3. Progress bar function (requiredArrayFields, requiredStringFields, optionalArrayFields, optionalStringFields, plus any special-cased fields)
4. `getTabProgress` function (reads from TAB_FIELDS — usually auto-correct)
5. Validation function (`validate()`)
6. JSX (move the component to the correct tab, add/remove `required` and `error` props)

### 8.2 Weighted Progress Tracking

All forms use a dual-weight system: required fields count 3× more than optional fields.

```jsx
const REQUIRED_WEIGHT = 3;
const OPTIONAL_WEIGHT = 1;
```

**Two progress mechanisms exist and must stay in sync:**

1. **Progress bar** (`ProfileProgressBar`, `BuyerProfileProgressBar`, `SupplierProfileProgressBar`) — shows overall form completion percentage as a horizontal bar. Uses hardcoded field arrays.

2. **Tab circle badges** (`getTabProgress` → `tabProgress` → `TabProgressBadge`) — shows per-tab completion as circular progress indicators inside tab buttons. Reads directly from `TAB_FIELDS[tabId]`.

**The progress bar and tab circles must track identical fields with identical weights.** If they diverge, users see inconsistent progress (e.g., 85% in the bar but a complete circle on every tab).

### 8.3 Progress Bar Field Arrays

The progress bar uses separate arrays for different field types because filling logic varies:

```jsx
// Simple arrays — filled when length > 0
const requiredArrayFields = ["supplierType", "productCategories", ...];
const optionalArrayFields = ["customersServed", "brandsDistributed", ...];

// Simple strings — filled when trimmed length > 0
const requiredStringFields = ["companyDescription", "productsOffered", ...];
const optionalStringFields = ["preferredCurrency", "paymentTerms", ...];

// Special-cased fields — custom fill logic, added individually
total += OPTIONAL_WEIGHT;
if (Array.isArray(form.discountTiers) && form.discountTiers.some((t) => t.minOrder && t.discount)) earned += OPTIONAL_WEIGHT;
total += OPTIONAL_WEIGHT; if (isBusinessHoursFilled()) earned += OPTIONAL_WEIGHT;
total += OPTIONAL_WEIGHT; if (isCompanyLogoFilled()) earned += OPTIONAL_WEIGHT;
```

**When adding a new field:** Determine its type (array, string, or special) and add it to the correct array in the progress bar function. Verify it's also in `TAB_FIELDS`. If it's a special type (structured object, nested array, image upload), add it as a standalone check with the appropriate weight.

### 8.4 Tab Status Indicators

Each tab shows a status badge: "empty", "partial", or "complete".

```jsx
const getTabStatus = (tabId) => {
  const config = TAB_FIELDS[tabId];
  const reqFilled = config.required.every(isFilled);
  const anyFilled = config.required.some(isFilled) || config.optional.some(isFilled);
  if (reqFilled) return "complete";
  if (anyFilled) return "partial";
  return "empty";
};
```

### 8.5 Per-Tab Progress Circles

Tab buttons show a circular progress badge (0–100% fill). This reads from `TAB_FIELDS` directly:

```jsx
const getTabProgress = useCallback((tabId) => {
  const config = TAB_FIELDS[tabId];
  let earned = 0, total = 0;
  const isFilled = (f) => {
    const val = form[f];
    if (f === "discountTiers") return Array.isArray(val) && val.some((t) => t.minOrder && t.discount);
    if (f === "businessHours") return Object.values(val).some((day) => day && day.status === "open");
    if (Array.isArray(val)) return val.length > 0;
    return val && String(val).trim().length > 0;
  };
  for (const f of config.required) { total += REQUIRED_WEIGHT; if (isFilled(f)) earned += REQUIRED_WEIGHT; }
  for (const f of config.optional) { total += OPTIONAL_WEIGHT; if (isFilled(f)) earned += OPTIONAL_WEIGHT; }
  return total > 0 ? earned / total : 0;
}, [form]);
```

### 8.6 Current Field Inventory (as of 2026-03-07)

**Account Profile (3 tabs):**

| Tab | Required | Optional |
|-----|----------|----------|
| Personal & Business | salutation, firstName, lastName, companyName | regNumber, taxId, roleInCompany, yearEstablished, companySize |
| Address | addressLine1, city, postcode, country | addressLine2 |
| Contact Options | mobileNumber, businessEmail, languages | landlineNumber, personalEmail, teamsHandle, linkedinUrl, whatsappNumber |

**Buyer Profile (4 tabs):**

| Tab | Required | Optional |
|-----|----------|----------|
| Buyer Profile | buyerType, describeBusiness, preferredSupplierTypes, sourcingModels | — |
| Sourcing Preferences | productsLookingFor, productCategories, countriesSourceFrom | brandsInterestedIn, productQualityTier, certificationRequirements, excludedCountries |
| Purchasing & Delivery | preferredPaymentMethods, preferredDeliveryOptions | annualSalesVolume, annualPurchasingVolume, highestMinimumOrder, moqComfortLevel, preferredCurrency |
| Online Presence & Market Focus | — | shopWebsiteUrl, focusMarkets, communicationPreferences |

**Supplier Profile (4 tabs):**

| Tab | Required | Optional |
|-----|----------|----------|
| Supplier Profile | supplierType, buyerTypesServed, companyDescription, supplyModels | customersServed |
| Products & Supply | productsOffered, productCategories, countriesServed | brandsDistributed, productQualityTier, certifications, sampleAvailability, catalogueSize, excludedCountries |
| Orders & Payments | minimumOrderAmount, paymentMethods, deliveryMethods, returnPolicy | preferredCurrency, paymentTerms, leadTime, discountTiers, discountNotes |
| Reach & Operations | companyWebsite | businessHours, companyLogo, socialFacebook, socialInstagram, socialLinkedin |

### 8.7 Scroll-to-Top After Save

After saving, the form scrolls to show the heading above the green success banner, accounting for the sticky header:

```jsx
<form ref={formRef} onSubmit={handleSubmit} noValidate style={{ scrollMarginTop: "120px" }}>
```

```jsx
// In handleSubmit, after successful save:
setActiveTab(TABS[0].id);
setTimeout(() => {
  if (formRef.current) formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
}, 50);
```

The `scrollMarginTop: 120px` CSS property offsets `scrollIntoView` to account for the sticky header. Use `setTimeout(50)` to allow React to render before scrolling.

### 8.8 Currency Header Inheritance

Currency dropdowns in forms inherit from the header currency selector unless the user has explicitly overridden them:

```jsx
const headerCurrency = useHeaderCurrency();
const userOverriddenCurrencies = useRef({ minimumOrderCurrency: false, preferredCurrency: false });

// Sync with header currency (only for non-overridden fields)
useEffect(() => {
  if (headerCurrency) {
    setForm((prev) => {
      const next = { ...prev };
      if (!userOverriddenCurrencies.current.minimumOrderCurrency) next.minimumOrderCurrency = headerCurrency;
      if (!userOverriddenCurrencies.current.preferredCurrency) next.preferredCurrency = headerCurrency;
      return next;
    });
  }
}, [headerCurrency]);
```

**Draft sync fix:** After `useFormDraft` restores saved currencies, the `userOverriddenCurrencies` ref stays `false`, so the header sync overwrites them. Fix with `draftSyncedRef`:

```jsx
const draftSyncedRef = useRef(false);
useEffect(() => {
  if (draftSyncedRef.current) return;
  draftSyncedRef.current = true;
  if (form.minimumOrderCurrency && form.minimumOrderCurrency !== headerCurrency) userOverriddenCurrencies.current.minimumOrderCurrency = true;
  if (form.preferredCurrency && form.preferredCurrency !== headerCurrency) userOverriddenCurrencies.current.preferredCurrency = true;
}, []);
```

### 8.9 Data Retention Across Tabs

Pre-populate fields with data from previous tabs (WCAG 3.3.7 Redundant Entry). The `useFormDraft` hook persists all tab data to localStorage with 500ms debounce. Currency fields inherit from the header selector unless user-overridden (see 8.8).

### 8.10 When to Use Multi-Step (General Guidance)

Convert to multi-step/tab-based when a form has more than 5 fields on mobile or more than 8 on desktop. Tab-based forms increase completion rates and reduce cognitive load.

---

## 9. Form Layout & Responsive Design

### 9.1 Single-Column Layout

Research consistently shows single-column form layouts outperform multi-column layouts for completion rates and scanning speed. Use single-column as default; only use side-by-side for closely related short fields (e.g., first/last name, city/state/zip).

### 9.2 Field Grouping

Group related fields visually with consistent spacing. Leave more white space between unrelated groups than within groups. Use `<fieldset>` and `<legend>` for semantic grouping where appropriate.

### 9.3 Mobile-Specific

- Form inputs must use ≥16px font size to prevent iOS auto-zoom on focus
- Keep primary submit button in the bottom third of the screen (thumb-friendly zone)
- Test with virtual keyboard open — ensure the active field and submit button remain visible
- Single-column only on mobile viewports (stack side-by-side fields)
- Touch targets: 44×44px minimum (see Section 2.5)

### 9.4 iOS Font Size

Input fields with font size below 16px trigger iOS Safari auto-zoom. Always use:
```css
input, select, textarea { font-size: 16px; } /* or larger */
```

---

## 10. Internationalization

### 10.1 Name Fields

Use a single "Full Name" field instead of separate First/Last name fields. Many cultures (Chinese, Japanese, Icelandic, Indonesian) don't follow Western first/last naming conventions. Allow all Unicode characters.

### 10.2 Address Fields

Provide country-specific address formatting when possible. At minimum, don't hardcode field labels to US conventions (e.g., "ZIP Code" → "Postal Code" for international forms).

### 10.3 RTL Support

For Arabic, Hebrew, and other RTL languages: form layout, label alignment, and error message position should flip. Use CSS `direction: rtl` or `[dir="rtl"]` selectors. Tailwind RTL variants: `rtl:text-right`, `rtl:ml-0 rtl:mr-4`.

### 10.4 Phone Fields

Use `type="tel"` with `inputMode="tel"`. Don't enforce a single phone format — international numbers vary in length and structure.

---

## 11. Code Conventions

### 11.1 Error Catch Pattern

Use underscore prefix to avoid variable shadowing with form event handler parameters:
```js
try {
  const recaptchaToken = await executeRecaptcha("login");
} catch (_err) { /* reCAPTCHA failed — proceed for demo */ }
```

### 11.2 State Update on Change

Clear field errors on change when field was previously touched or form was submitted:
```js
const set = (field) => (e) => {
  setForm((f) => ({ ...f, [field]: e.target.value }));
  if (touched[field] || submitted) setErrors((p) => ({ ...p, [field]: "" }));
};
```

### 11.3 Production Comments

Mark demo-only code with production migration notes:
```js
// 🔧 PRODUCTION: Use Server Actions (automatic CSRF), NextAuth signIn(), or getCsrfToken()
/* SECURITY: always show success — never reveal account existence */
```

---

## 12. Testing

### 12.1 Automated Testing

Run `axe-core` or Lighthouse accessibility audits in CI/CD. These catch ~30% of accessibility issues (contrast, missing labels, missing ARIA attributes).

### 12.2 Screen Reader Testing

Manual screen reader testing is essential — automated tools miss interaction issues. Test with:
- **NVDA** (Windows) — free, most popular
- **VoiceOver** (macOS/iOS) — built-in
- **JAWS** (Windows) — enterprise standard

**Test checklist:**
- Tab through all fields — verify each field's name and role are announced
- Trigger validation errors — verify errors are announced immediately via `role="alert"`
- Submit form with errors — verify error summary is announced and first errored field receives focus
- Complete form — verify success message is announced
- Test in both browse mode and forms mode (NVDA) or web rotor (VoiceOver)

### 12.3 Keyboard-Only Testing

Navigate the entire form using only keyboard. Verify:
- All fields reachable via Tab
- All dropdowns operable via Arrow keys, Enter, Escape
- Modal focus trap works correctly
- Submit and cancel buttons reachable
- Focus ring visible on every focused element

### 12.4 Mobile Testing

Test on actual touch devices (not just responsive browser mode):
- Virtual keyboard doesn't obscure the active field
- Correct keyboard appears for each input type (email, phone, numeric)
- Touch targets are large enough (44×44px)
- Form is single-column and scrollable

---

## 13. File Reference

### 13.1 Auth & Registration Forms

| File | Contains |
|------|----------|
| `src/components/shared/auth-ui.jsx` | Shared field components (FloatingField, UsernameField, EmailField, FloatingPasswordField, PasswordStrength, Toggle, ErrorSummary, RecaptchaNotice, VerificationSuccessPanel, ResetPasswordSuccessPanel) |
| `src/components/shared/auth-modal.jsx` | Modal with login + register tabs |
| `src/components/phases/register.jsx` | Standalone /register page (mirrors modal) |
| `src/components/phases/contact.jsx` | Contact form with own FloatingField + FloatingSelect |
| `src/components/phases/filters.jsx` | Deal/supplier filter column |
| `src/components/phases/shell.jsx` | Footer newsletter form |

### 13.2 Dashboard Profile Forms

| File | Contains |
|------|----------|
| `src/components/shared/form-fields.jsx` | All shared dashboard form components: FloatingField, FloatingSelect, FloatingTextarea, CountrySelect, MultiSelect, CategorySelector, PhoneInput, CurrencyAmountInput, BrandPillInput, BusinessHoursGrid, LanguageSelector, ImageUploadPlaceholder, ProfileProgressBar, ProfileTabBar, TabStatus, TabProgressBadge, ErrorSummaryPanel, FormSection, HelpTooltip, DiscountTierBuilder |
| `src/components/phases/account-profile.jsx` | Account profile form (3 tabs: Personal & Business, Address, Contact Options) |
| `src/components/phases/buyer-profile.jsx` | Buyer profile form (4 tabs: Buyer Profile, Sourcing Preferences, Purchasing & Delivery, Online Presence) |
| `src/components/phases/supplier-profile-form.jsx` | Supplier profile form (4 tabs: Supplier Profile, Products & Supply, Orders & Payments, Reach & Operations) |
| `src/components/shared/app-layout.jsx` | Main app shell with sidebar (uses `usePanelCollapse` for sidebar persistence) |
| `src/components/phases/dashboard.jsx` | Dashboard re-exports shared components for profile forms |

### 13.3 Shared Hooks

| File | Contains |
|------|----------|
| `src/components/shared/use-rate-limit.js` | Escalating lockout hook |
| `src/components/shared/use-breach-check.js` | HIBP password check hook |
| `src/components/shared/use-recaptcha.js` | reCAPTCHA v3 hook |
| `src/components/shared/use-email-check.js` | Email availability hook |
| `src/components/shared/use-username-check.js` | Username availability hook |
| `src/components/shared/use-verification-email.js` | Resend email hook with cooldown |
| `src/components/shared/use-last-login.js` | Last login tracking hook (localStorage + CustomEvent) |
| `src/components/shared/use-form-draft.js` | Form draft persistence hook (localStorage + beforeunload) |
| `src/components/shared/use-panel-collapse.js` | Panel collapse state persistence hook (localStorage + useLayoutEffect) |

### 13.4 Configuration

| File | Contains |
|------|----------|
| `next.config.js` | Security headers (CSP, X-Frame-Options, etc.) |

---

## 14. Checklist for New Forms

When creating any new form, verify:

**Accessibility (WCAG 2.2):**
- [ ] Every input has `id` + `<label htmlFor>`
- [ ] Required fields have both `required` and `aria-required`
- [ ] Errored fields have `aria-invalid` + `aria-describedby` pointing to error `<p id>`
- [ ] Custom dropdowns have full combobox/listbox ARIA + keyboard navigation + typeahead
- [ ] Collapsible sections have `aria-expanded` + `aria-controls`
- [ ] Icon-only buttons have `aria-label`
- [ ] Dynamic banners/errors use `role="alert"` (urgent) or `role="status"` (non-urgent)
- [ ] Tab order follows visual layout (no positive `tabIndex`)
- [ ] Focus indicators are visible (2px ring, 3:1 contrast)
- [ ] Color is never the sole state indicator (always paired with text/icons)
- [ ] Focused fields not obscured by sticky headers (`scroll-padding-top`)
- [ ] Password fields allow paste and autofill (WCAG 3.3.8)
- [ ] Multi-step forms pre-populate data from previous steps (WCAG 3.3.7)

**Validation & UX:**
- [ ] `<form>` uses `noValidate` attribute
- [ ] Error prevention: constrained input types, format hints, pre-population
- [ ] Form validates onBlur (per field, with 120ms delay) and onSubmit (all fields)
- [ ] onChange clears existing error (doesn't show new errors while typing)
- [ ] Error summary panel appears on submit with clickable field links
- [ ] First errored field receives focus on submit
- [ ] Error messages are specific and suggest corrections (WCAG 3.3.3)
- [ ] Loading state: spinner + disabled inputs during submission
- [ ] Success state: clear confirmation with `role="status"`

**Design & Aesthetics:**
- [ ] Visual states: default → focused → filled → error (consistent colors)
- [ ] Field containers use `shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15)]`
- [ ] Floating labels with `transition-all duration-200` animation
- [ ] Required fields show red asterisk
- [ ] Placeholder only visible when focused; never sole label
- [ ] All text meets WCAG AA contrast (4.5:1 min; use `text-slate-500` not `-400` for labels)
- [ ] Contrast verified on colored field backgrounds, not just white
- [ ] Browser autofill styles overridden in globals.css
- [ ] Interactive elements ≥ 44×44px touch target (buttons, toggles, icon buttons)
- [ ] Animations respect `prefers-reduced-motion` (auto-rotation paused, transitions suppressed)
- [ ] Single-column layout on mobile

**Mobile:**
- [ ] Input fields use ≥16px font size (prevents iOS auto-zoom)
- [ ] Correct `inputMode` set for each field (email, tel, numeric)
- [ ] Form tested with virtual keyboard open
- [ ] Primary action in bottom third of screen (thumb zone)
- [ ] Touch targets are 44×44px minimum

**Security:**
- [ ] reCAPTCHA v3 integrated with try/catch fallback
- [ ] Rate limiting on submit-heavy forms (login, forgot password)
- [ ] Security badge + reCAPTCHA notice near submit button
- [ ] Keyboard: Enter submits, Escape closes modals/dropdowns
- [ ] Proper `autoComplete` values on all inputs (never `off` on auth fields)

**Data Persistence:**
- [ ] Long forms use `useFormDraft` hook for localStorage draft saving
- [ ] `clearDraft()` called on successful submission
- [ ] `beforeunload` warning active when form has data
- [ ] Draft data expires after 30 days maximum

**Dashboard Profile Forms (Tab-Based):**
- [ ] `TAB_FIELDS` config lists all form fields in correct tabs with correct required/optional
- [ ] `REQUIRED_FIELDS` map includes only required fields with user-facing labels
- [ ] Progress bar field arrays match `TAB_FIELDS` (same fields, same weights)
- [ ] `getTabProgress` reads from `TAB_FIELDS` with correct `isFilled()` for special types
- [ ] Validation checks all required fields, runs format validation on optional fields if filled
- [ ] `findTabForField()` correctly maps field names to tab IDs for error panel navigation
- [ ] Scroll-to-top uses `scrollMarginTop: 120px` + `scrollIntoView({ block: "start" })`
- [ ] Currency dropdowns inherit from header via `useHeaderCurrency` + `userOverriddenCurrencies`
- [ ] Draft-restored currencies marked as overridden via `draftSyncedRef`
- [ ] All search inputs inside dropdowns prevent Enter from submitting form
- [ ] Dropdown font sizes consistent at `text-[15px]` across all components
- [ ] Textarea focus placeholders use `placeholder-transparent focus:placeholder-slate-300`

**Testing:**
- [ ] Tested with screen reader (NVDA or VoiceOver)
- [ ] Tested with keyboard-only navigation
- [ ] Tested on mobile device with touch
- [ ] Automated accessibility audit passes (axe-core / Lighthouse)
