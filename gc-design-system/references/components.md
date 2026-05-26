# GC Design System Component Reference

Web Components (custom elements) from the GC Design System. Use `gcds-` prefix for all tags.

- **Current web component package**: `@gcds-core/components` (v1.2.0)
- **Current React wrapper package**: `@gcds-core/components-react` (v1.2.0)
- **Legacy package**: `@cdssnc/gcds-components` (v0.47.0)

All packages expose the same underlying components.

## Setup by project type

### Non-React (HTML/Web Components)

```html
<link rel="stylesheet" href="https://cdn.design-system.canada.ca/@gcds-core/components@1.2.0/dist/gcds/gcds.css" />
<script type="module" src="https://cdn.design-system.canada.ca/@gcds-core/components@1.2.0/dist/gcds/gcds.esm.js"></script>
```

### React

```bash
npm install @gcds-core/components @gcds-core/components-react
```

```tsx
import '@gcds-core/components-react/gcds.css';
import { GcdsButton, GcdsContainer } from '@gcds-core/components-react';
```

## Table of Contents

- [Layout](#layout)
- [Navigation](#navigation)
- [Content](#content)
- [Forms](#forms)
- [Feedback](#feedback)

## Layout

### `<gcds-container>`
**Description:** Basic box layout with predefined width constraints and alignment options.
**Key Attributes:** `size` (full/xl/lg/md/sm/xs), `centered`, `border`, `padding`, `margin`, `tag`
**Example:**
```html
<gcds-container size="lg" centered border>
  <p>Container content goes here.</p>
</gcds-container>
```

### `<gcds-grid>`
**Description:** Responsive layout system based on a 12-column CSS Grid.
**Key Attributes:** `columns`, `columns-tablet`, `columns-desktop`, `gap`, `tag`, `equal-row-height`
**Example:**
```html
<gcds-grid columns="1fr" columns-tablet="1fr 1fr" columns-desktop="1fr 1fr 1fr" gap="300">
  <div>Column 1</div>
  <div>Column 2</div>
</gcds-grid>
```

### `<gcds-card>`
**Description:** Structured container for actionable content, often used in grids.
**Key Attributes:** `card-title`, `card-title-tag`, `href`, `description`, `badge`, `img-src`, `img-alt`, `tag`
**Example:**
```html
<gcds-card card-title="Card Title" href="#" img-src="image.jpg" img-alt="Description">
  <p>Short description of the card content.</p>
</gcds-card>
```

## Navigation

### `<gcds-header>`
**Description:** Official Government of Canada branded header component.
**Key Attributes:** `lang-href`, `signature-variant` (colour/white), `signature-has-link`, `skip-to-href`, `hide-canada-link`
**Example:**
```html
<gcds-header lang-href="/fr" skip-to-href="#main">
  <gcds-breadcrumbs slot="breadcrumb"><gcds-breadcrumbs-item href="/">Home</gcds-breadcrumbs-item></gcds-breadcrumbs>
</gcds-header>
```

### `<gcds-footer>`
**Description:** Official Government of Canada branded footer component.
**Key Attributes:** `display` (compact/full), `contextual-heading`, `contextual-links`, `sub-links`
**Example:**
```html
<gcds-footer display="full"
  contextual-heading="Department Name"
  contextual-links='{"Contact us": "/contact", "About": "/about"}'>
</gcds-footer>
```

### `<gcds-breadcrumbs>`
**Description:** Navigation trail showing the user's current location in the hierarchy.
**Key Attributes:** Contains `<gcds-breadcrumbs-item>`
**Example:**
```html
<gcds-breadcrumbs>
  <gcds-breadcrumbs-item href="/">Home</gcds-breadcrumbs-item>
  <gcds-breadcrumbs-item>Current Page</gcds-breadcrumbs-item>
</gcds-breadcrumbs>
```

### `<gcds-top-navigation>`
**Description:** Horizontal navigation menu typically placed in the header.
**Key Attributes:** `label`, `alignment`
**Example:**
```html
<gcds-top-navigation label="Main menu">
  <gcds-nav-link href="/page-1">Page 1</gcds-nav-link>
</gcds-top-navigation>
```

### `<gcds-side-nav>`
**Description:** Vertical navigation menu for sidebars.
**Key Attributes:** `label`
**Example:**
```html
<gcds-side-nav label="Side menu">
  <gcds-nav-group label="Group 1">
    <gcds-nav-link href="/page-1">Page 1</gcds-nav-link>
  </gcds-nav-group>
</gcds-side-nav>
```

### `<gcds-pagination>`
**Description:** Navigation for splitting content across multiple pages.
**Key Attributes:** `display` (list/simple), `total-pages`, `current-page`, `url`
**Example:**
```html
<gcds-pagination total-pages="10" current-page="1" url="/page-{{n}}"></gcds-pagination>
```

### `<gcds-language-toggle>`
**Description:** Links for switching between English and French.
**Key Attributes:** `href`
**Example:**
```html
<gcds-language-toggle href="/fr"></gcds-language-toggle>
```

### `<gcds-theme-and-topic-menu>`
**Description:** Standardized Government of Canada theme navigation menu.
**Key Attributes:** None
**Example:**
```html
<gcds-theme-and-topic-menu></gcds-theme-and-topic-menu>
```

### `<gcds-signature>`
**Description:** Official Government of Canada corporate identity signature or wordmark.
**Key Attributes:** `type` (signature/wordmark), `variant` (colour/white), `has-link`
**Example:**
```html
<gcds-signature type="signature" variant="colour"></gcds-signature>
```

## Content

### `<gcds-heading>`
**Description:** Pre-styled heading element with optional margin controls.
**Key Attributes:** `tag` (h1-h6), `margin-top`, `margin-bottom`, `character-limit`
**Example:**
```html
<gcds-heading tag="h1">Main Page Heading</gcds-heading>
```

### `<gcds-text>`
**Description:** Styled paragraph for body text or captions.
**Key Attributes:** `display` (block/light), `character-limit`, `margin-top`, `margin-bottom`, `size` (body/caption)
**Example:**
```html
<gcds-text size="body">Standard body text goes here.</gcds-text>
```

### `<gcds-link>`
**Description:** Styled anchor tag for navigation and downloads.
**Key Attributes:** `href`, `external`, `size` (regular/small/inherit), `display` (inline/block), `download`
**Example:**
```html
<gcds-link href="https://canada.ca" external>Visit Canada.ca</gcds-link>
```

### `<gcds-icon>`
**Description:** Visual symbol for representing actions or concepts.
**Key Attributes:** `name`, `label`, `margin-left`, `margin-right`, `size` (inherit/text-small/text/h6-h1/caption)
**Example:**
```html
<gcds-icon name="search" label="Search"></gcds-icon>
```

### `<gcds-details>`
**Description:** Disclosure widget for showing or hiding additional content.
**Key Attributes:** `details-title`, `open`
**Example:**
```html
<gcds-details details-title="Click to expand">
  <p>Hidden content here.</p>
</gcds-details>
```

### `<gcds-date-modified>`
**Description:** Component for displaying the last updated timestamp or version.
**Key Attributes:** `type` (date/version)
**Example:**
```html
<gcds-date-modified type="date">2024-01-01</gcds-date-modified>
```

### `<gcds-stepper>`
**Description:** Visual indicator for progress through a multi-step process.
**Key Attributes:** `current-step`, `total-steps`, `tag` (h1/h2/h3)
**Example:**
```html
<gcds-stepper current-step="2" total-steps="5"></gcds-stepper>
```

### `<gcds-screenreader-only>`
**Description:** Content hidden visually but accessible to assistive technologies.
**Key Attributes:** `tag`
**Example:**
```html
<gcds-screenreader-only>This text is for screen readers.</gcds-screenreader-only>
```

## Forms

### `<gcds-button>`
**Description:** Actionable button or link styled as a button.
**Key Attributes:** `type` (submit/reset/button/link), `button-role` (primary/secondary/danger/skip-to-content), `size` (regular/small), `disabled`, `href`, `name`, `button-id`
**Example:**
```html
<gcds-button type="button" button-role="primary">Submit</gcds-button>
```

### `<gcds-input>`
**Description:** Single-line text input field.
**Key Attributes:** `type` (text/email/password/number/search/tel/url), `input-id`, `label`, `name`, `required`, `error-message`, `hint`, `size`, `value`
**Example:**
```html
<gcds-input input-id="name" label="Full name" name="name" required></gcds-input>
```

### `<gcds-textarea>`
**Description:** Multi-line text input field.
**Key Attributes:** `textarea-id`, `label`, `name`, `required`, `rows`, `character-count`, `error-message`, `hint`, `value`
**Example:**
```html
<gcds-textarea textarea-id="comments" label="Comments" name="comments" rows="5"></gcds-textarea>
```

### `<gcds-select>`
**Description:** Dropdown selection menu.
**Key Attributes:** `select-id`, `label`, `name`, `required`, `default-value`, `error-message`, `hint`
**Example:**
```html
<gcds-select select-id="province" label="Province" name="province">
  <option value="on">Ontario</option>
</gcds-select>
```

### `<gcds-checkboxes>`
**Description:** Group of checkbox options allowing multiple selections.
**Key Attributes:** `legend`, `name`, `required` (Contains `<gcds-checkbox>`)
**Example:**
```html
<gcds-checkboxes legend="Options" name="options">
  <gcds-checkbox checkbox-id="opt1" label="Option 1" value="1"></gcds-checkbox>
</gcds-checkboxes>
```

### `<gcds-radios>`
**Description:** Group of radio options allowing a single selection.
**Key Attributes:** `legend`, `name`, `required` (Contains `<gcds-radio>`)
**Example:**
```html
<gcds-radios legend="Pick one" name="choice">
  <gcds-radio radio-id="r1" label="Yes" value="yes"></gcds-radio>
</gcds-radios>
```

### `<gcds-file-uploader>`
**Description:** Input for selecting and uploading files.
**Key Attributes:** `uploader-id`, `label`, `name`, `required`, `accept`, `multiple`, `hint`
**Example:**
```html
<gcds-file-uploader uploader-id="files" label="Upload Resume" name="resume"></gcds-file-uploader>
```

### `<gcds-date-input>`
**Description:** Specialized input for entering calendar dates.
**Key Attributes:** `name`, `legend`, `required`, `format`
**Example:**
```html
<gcds-date-input name="birthdate" legend="Date of birth"></gcds-date-input>
```

### `<gcds-fieldset>`
**Description:** Container for grouping related form elements.
**Key Attributes:** `legend`, `fieldset-id`, `required`, `error-message`, `hint`
**Example:**
```html
<gcds-fieldset legend="Mailing Address" fieldset-id="address">
  <gcds-input input-id="city" label="City" name="city"></gcds-input>
</gcds-fieldset>
```

### `<gcds-search>`
**Description:** Search interface, defaults to Canada.ca global search.
**Key Attributes:** `placeholder`, `action`
**Example:**
```html
<gcds-search placeholder="Search website" action="/search-results"></gcds-search>
```

## Feedback

### `<gcds-notice>`
**Description:** Contextual alert message for important information or feedback.
**Key Attributes:** `type` (info/success/warning/danger), `notice-title`, `notice-title-tag`
**Example:**
```html
<gcds-notice type="info" notice-title="Note">
  <p>Information notice content.</p>
</gcds-notice>
```

### `<gcds-error-message>`
**Description:** Inline error message associated with a form field.
**Key Attributes:** `message-id`
**Example:**
```html
<gcds-error-message message-id="err1">This field is required.</gcds-error-message>
```

### `<gcds-error-summary>`
**Description:** Summary of all validation errors found on a page.
**Key Attributes:** `heading`, `listen`
**Example:**
```html
<gcds-error-summary heading="Check the following errors" listen>
  <ul><li><a href="#input1">Error 1</a></li></ul>
</gcds-error-summary>
```
