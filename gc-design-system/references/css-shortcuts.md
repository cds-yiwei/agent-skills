# GCDS CSS Shortcuts Reference

CSS utility classes built to match GC Design System tokens. Add via:
```html
<link rel="stylesheet" href="https://cdn.design-system.alpha.canada.ca/@gcds-core/css-shortcuts@1.1.0/dist/gcds-css-shortcuts.min.css" />
```

## Install and load styles

### Non-React (HTML/Web Components)

Load both GCDS component styles and CSS shortcuts:

```html
<link rel="stylesheet" href="https://cdn.design-system.canada.ca/@gcds-core/components@1.2.0/dist/gcds/gcds.css" />
<link rel="stylesheet" href="https://cdn.design-system.alpha.canada.ca/@gcds-core/css-shortcuts@1.1.0/dist/gcds-css-shortcuts.min.css" />
<script type="module" src="https://cdn.design-system.canada.ca/@gcds-core/components@1.2.0/dist/gcds/gcds.esm.js"></script>
```

### React

```bash
npm install @gcds-core/components @gcds-core/components-react @gcds-core/css-shortcuts
```

```tsx
import '@gcds-core/components-react/gcds.css';
import '@gcds-core/css-shortcuts/dist/gcds-css-shortcuts.min.css';
```

## Table of Contents

- [Responsive Breakpoints](#responsive-breakpoints)
- [State Prefixes](#state-prefixes)
- [Layout](#layout)
- [Typography](#typography)
- [Spacing](#spacing)
- [Flexbox & Grid](#flexbox--grid)
- [Background & Border](#background--border)
- [Icons & Images](#icons--images)
- [Interactive](#interactive)

---

## Responsive Breakpoints

Prefix any class with a breakpoint to apply it conditionally:

| Prefix | Min Width | Example |
|--------|-----------|---------|
| `xs:` | >480px | `xs:d-flex` |
| `sm:` | >640px | `sm:d-block` |
| `md:` | >768px | `md:p-400` |
| `lg:` | >1024px | `lg:d-grid` |
| `xl:` | >1280px | `xl:m-600` |

```html
<div class="d-block md:d-flex lg:d-grid">Responsive layout</div>
```

## State Prefixes

| Prefix | Trigger | Example |
|--------|---------|---------|
| `hover:` | Mouse hover | `hover:bg-light` |
| `focus:` | Focus state | `focus:border-primary` |

---

## Layout

### Display
`d-block`, `d-inline`, `d-inline-block`, `d-flex`, `d-inline-flex`, `d-grid`, `d-inline-grid`, `d-none`, `d-table`, `d-table-row`, `d-table-cell`

### Position
`pos-static`, `pos-relative`, `pos-absolute`, `pos-fixed`, `pos-sticky`

### Visibility
`visible`, `invisible`

### Overflow
`overflow-auto`, `overflow-hidden`, `overflow-scroll`, `overflow-visible`, `overflow-x-auto`, `overflow-x-hidden`, `overflow-y-auto`, `overflow-y-hidden`

### Box Sizing
`box-border`, `box-content`

### Container Sizing
`container-full`, `container-xl`, `container-lg`, `container-md`, `container-sm`, `container-xs`

---

## Typography

### Font Family
`font-family-body`, `font-family-heading`, `font-family-monospace`

### Font Size
`font-size-h1`, `font-size-h2`, `font-size-h3`, `font-size-h4`, `font-size-h5`, `font-size-h6`, `font-size-text`, `font-size-text-small`

### Font Weight
`font-weight-light`, `font-weight-regular`, `font-weight-medium`, `font-weight-semibold`, `font-weight-bold`

### Font Style
`font-style-normal`, `font-style-italic`

### Line Height
`line-height-tight`, `line-height-normal`, `line-height-loose`

### Text Colour
| Class | Token |
|-------|-------|
| `text-primary` | `--gcds-text-primary` |
| `text-secondary` | `--gcds-text-secondary` |
| `text-light` | `--gcds-text-light` |
| `text-current` | `currentColor` |
| `text-transparent` | `transparent` |

### Text Alignment
`text-left`, `text-center`, `text-right`, `text-justify`

### Text Transform
`text-uppercase`, `text-lowercase`, `text-capitalize`, `text-normal-case`

### Text Overflow
`text-truncate`, `text-ellipsis`, `text-clip`

### Text Decoration (Links)
`link-underline`, `link-no-underline`

### Link Colour
`link-default`, `link-light`

### Link Size
`link-regular`, `link-small`, `link-inherit`

### Word Break
`break-normal`, `break-all`, `break-word`

### List Style
`list-none`, `list-disc`, `list-decimal`

---

## Spacing

Values use GCDS spacing tokens: `0`, `25`, `50`, `75`, `100`, `150`, `200`, `250`, `300`, `400`, `450`, `500`, `550`, `600`, `700`, `800`, `900`, `1000`, `1050`, `1100`, `1150`, `1200`, `1250`, or `auto`.

### Margin
| Class | Property |
|-------|----------|
| `m-<value>` | margin (all sides) |
| `mt-<value>` | margin-block-start (top) |
| `mb-<value>` | margin-block-end (bottom) |
| `ms-<value>` | margin-inline-start (left) |
| `me-<value>` | margin-inline-end (right) |
| `mx-<value>` | margin-inline (left + right) |
| `my-<value>` | margin-block (top + bottom) |

```html
<div class="m-400">All sides margin 400</div>
<div class="mx-auto container-lg">Centered container</div>
<div class="mt-600 mb-300">Top 600, bottom 300</div>
```

### Padding
| Class | Property |
|-------|----------|
| `p-<value>` | padding (all sides) |
| `pt-<value>` | padding-block-start (top) |
| `pb-<value>` | padding-block-end (bottom) |
| `ps-<value>` | padding-inline-start (left) |
| `pe-<value>` | padding-inline-end (right) |
| `px-<value>` | padding-inline (left + right) |
| `py-<value>` | padding-block (top + bottom) |

```html
<div class="p-400 bg-light">Padded box with background</div>
<div class="px-600 py-300">Horizontal 600, vertical 300</div>
```

---

## Flexbox & Grid

### Flex
`flex-1`, `flex-auto`, `flex-initial`, `flex-none`

### Flex Direction
`flex-row`, `flex-row-reverse`, `flex-col`, `flex-col-reverse`

### Flex Wrap
`flex-wrap`, `flex-nowrap`, `flex-wrap-reverse`

### Flex Grow / Shrink
`flex-grow`, `flex-grow-0`, `flex-shrink`, `flex-shrink-0`

### Align Items
`items-start`, `items-end`, `items-center`, `items-baseline`, `items-stretch`

### Align Self
`self-auto`, `self-start`, `self-end`, `self-center`, `self-stretch`

### Align Content
`content-start`, `content-end`, `content-center`, `content-between`, `content-around`, `content-evenly`, `content-stretch`

### Justify Content
`justify-start`, `justify-end`, `justify-center`, `justify-between`, `justify-around`, `justify-evenly`

### Justify Items
`justify-items-start`, `justify-items-end`, `justify-items-center`, `justify-items-stretch`

### Justify Self
`justify-self-auto`, `justify-self-start`, `justify-self-end`, `justify-self-center`, `justify-self-stretch`

### Gap
Uses spacing tokens: `gap-<value>` (e.g., `gap-300`, `gap-400`)

### Grid Columns
`grid-cols-1` through `grid-cols-12`, `grid-cols-none`

### Grid Rows
`grid-rows-1` through `grid-rows-6`, `grid-rows-none`

### Order
`order-first`, `order-last`, `order-none`, `order-1` through `order-12`

### Place Content / Items / Self
`place-content-center`, `place-content-start`, `place-content-end`, `place-content-between`, `place-content-around`, `place-content-evenly`, `place-content-stretch`

`place-items-center`, `place-items-start`, `place-items-end`, `place-items-stretch`

`place-self-auto`, `place-self-center`, `place-self-start`, `place-self-end`, `place-self-stretch`

---

## Background & Border

### Background Colour
| Class | Token |
|-------|-------|
| `bg-primary` | `--gcds-bg-primary` (GC blue accent) |
| `bg-dark` | `--gcds-bg-dark` |
| `bg-light` | `--gcds-bg-light` |
| `bg-white` | `--gcds-bg-white` |
| `bg-black` | `--gcds-color-grayscale-1000` |
| `bg-danger` | `--gcds-danger-background` |
| `bg-active` | `--gcds-active-background` |
| `bg-disabled` | `--gcds-disabled-background` |
| `bg-transparent` | `transparent` |
| `bg-current` | `currentColor` |
| `bg-inherit` | `inherit` |

### Border Colour
`border-primary`, `border-dark`, `border-light`, `border-danger`, `border-disabled`, `border-transparent`, `border-current`, `border-inherit`

### Border Style
`border-solid`, `border-dashed`, `border-dotted`, `border-none`

### Border Width
`border-0`, `border-100`, `border-200` (uses spacing tokens)

### Border Radius
`rounded-0`, `rounded-100`, `rounded-200`, `rounded-300`, `rounded-400`, `rounded-full`

---

## Icons & Images

### Icon Size
`icon-text-small`, `icon-text`, `icon-h6`, `icon-h5`, `icon-h4`, `icon-h3`, `icon-h2`, `icon-h1`

### Image
`img-fluid` (max-width: 100%, height: auto)

---

## Interactive

### Cursor
`cursor-auto`, `cursor-default`, `cursor-pointer`, `cursor-not-allowed`, `cursor-wait`, `cursor-text`

### Pointer Events
`pointer-events-auto`, `pointer-events-none`

### Transition
`transition-none`, `transition-all`, `transition-colors`, `transition-opacity`, `transition-transform`

---

## Common Patterns

### Centered content section
```html
<div class="container-lg mx-auto p-400">
  <h2 class="font-size-h2 mb-300">Section Title</h2>
  <p class="text-secondary">Description text.</p>
</div>
```

### Responsive flex layout
```html
<div class="d-flex flex-col md:flex-row gap-300">
  <div class="flex-1">Left content</div>
  <div class="flex-1">Right content</div>
</div>
```

### Card-like box with background
```html
<div class="bg-light p-400 rounded-200 border-solid border-100 border-light">
  <h3 class="font-size-h4 mb-200">Card Title</h3>
  <p class="text-secondary font-size-text-small">Card description.</p>
</div>
```

### Dark section with light text
```html
<div class="bg-dark text-light p-600">
  <h2 class="font-size-h2 mb-300">Dark Section</h2>
  <p>Light text on dark background.</p>
</div>
```
