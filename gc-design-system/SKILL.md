---
name: gc-design-system
description: Build professional Government of Canada websites using the GC Design System (GCDS) web components, CSS shortcuts, and design tokens. Use Tailwind CSS for advanced components not available in GCDS (tables, modals, toasts, tabs). Triggers when user mentions Canada.ca, Government of Canada website, GC Design System, GCDS, federal government web page, Canada.ca template, or asks to build a bilingual government service page.
---

# GC Design System Website Builder

Build accessible, bilingual Government of Canada websites using GCDS web components + Tailwind CSS for gaps.

## Quick Start

1. Copy the starter template from `assets/basic-page-template.html`
2. Modify header, main content, and footer sections
3. Use GCDS components for standard UI (see [references/components.md](references/components.md))
4. Use Tailwind CSS (tw- prefix) for advanced components (see [references/tailwind-gap-components.md](references/tailwind-gap-components.md))

## CDN Setup (HTML head)

```html
<link rel="stylesheet"
  href="https://cdn.design-system.alpha.canada.ca/@cdssnc/gcds-components@0.47.0/dist/gcds/gcds.css" />
<script type="module"
  src="https://cdn.design-system.alpha.canada.ca/@cdssnc/gcds-components@0.47.0/dist/gcds/gcds.esm.js"></script>
<link rel="stylesheet"
  href="https://cdn.design-system.alpha.canada.ca/@cdssnc/gcds-components@0.47.0/dist/gcds/gcds-utility.css" />
```

For Tailwind gap components, also add:
```html
<script src="https://cdn.tailwindcss.com"></script>
```
Configure Tailwind with `tw-` prefix to avoid GCDS class conflicts. See [references/tailwind-gap-components.md](references/tailwind-gap-components.md) for the full config block.

## npm Setup (alternative)

```bash
npm install @cdssnc/gcds-components
# or new packages:
npm install @gcds-core/components @gcds-core/css-shortcuts
```

Framework wrappers: `@cdssnc/gcds-components-react`, `@cdssnc/gcds-components-angular`, `@cdssnc/gcds-components-vue`

## Page Structure (mandatory)

Every GC page MUST have:

```
<gcds-header>     ← GC branded header (required)
  <gcds-search>   ← Search slot
  <gcds-breadcrumbs> ← Breadcrumb slot
<main>
  <gcds-container> ← Content wrapper
    Content here
  </gcds-container>
  <gcds-date-modified> ← Last update date
</main>
<gcds-footer>     ← GC branded footer (required)
```

## Component Decision Guide

### Use GCDS components for:
Header, Footer, Breadcrumbs, Buttons, Forms (Input, Textarea, Select, Checkboxes, Radios, File Upload, Date Input), Cards (basic link cards), Grid layout, Container, Navigation (Top Nav, Side Nav), Pagination, Notice/Alerts, Details (accordion), Stepper, Heading, Text, Link, Icon, Search, Error handling, Signature, Language Toggle

### Use Tailwind (tw- prefix) for:
- **Enhanced Cards** — multi-action, complex content cards
- **Data Tables** — sortable/striped tables
- **Modal Dialogs** — using native `<dialog>` element
- **Toast Notifications** — dismissible snackbar messages
- **Tabs** — tabbed content panels
- **Badges/Tags** — status indicators
- **Stats/Metric Cards** — dashboard number displays
- **Hero Sections** — full-width banner areas
- Any custom layout not covered by GCDS

## Key Rules

1. **Accessibility first** — All GCDS components are WCAG 2.1 AA. Keep custom Tailwind components accessible (aria roles, keyboard nav, focus management).
2. **Bilingual** — Set `lang="en"` or `lang="fr"` on `<html>`. Use `lang-href` on header for language toggle.
3. **GC branding** — Never modify the GC signature or wordmark. Always use `<gcds-header>` and `<gcds-footer>`.
4. **Tailwind prefix** — Always use `tw-` prefix on Tailwind classes to avoid conflicts with GCDS CSS shortcuts.
5. **Responsive** — Use `<gcds-grid>` with `columns`, `columns-tablet`, `columns-desktop` for responsive layouts. GCDS CSS shortcuts support `xs:`, `sm:`, `md:`, `lg:`, `xl:` breakpoint prefixes.

## References

| File | When to Read |
|------|-------------|
| [references/components.md](references/components.md) | Building any page — full component inventory with tags, attributes, and examples |
| [references/css-shortcuts.md](references/css-shortcuts.md) | Styling custom HTML — utility classes for spacing, typography, layout, colours |
| [references/tailwind-gap-components.md](references/tailwind-gap-components.md) | Need Table, Modal, Toast, Tabs, enhanced Card, Hero, Stats, or Badge |
| [references/design-tokens.md](references/design-tokens.md) | Writing custom CSS — all colour, spacing, typography token values |

## Assets

| File | Purpose |
|------|---------|
| [assets/basic-page-template.html](assets/basic-page-template.html) | Copy as starting point for any new GC page |
