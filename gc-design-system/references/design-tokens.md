# GCDS Design Tokens Reference

Design tokens are CSS custom properties (variables) prefixed with `--gcds-`. Use them for consistent styling.

## Colour Tokens

### Global Text & Background
| Token | Purpose |
|-------|---------|
| `--gcds-text-primary` | Default text colour (#333333) |
| `--gcds-text-secondary` | Secondary text (#555555) |
| `--gcds-text-light` | Light text (for dark backgrounds) |
| `--gcds-bg-primary` | GC primary accent background |
| `--gcds-bg-dark` | Dark background |
| `--gcds-bg-light` | Light background (#f5f5f5) |
| `--gcds-bg-white` | White background |

### State Colours
| Token | Purpose |
|-------|---------|
| `--gcds-danger-background` | Danger/error background |
| `--gcds-danger-border` | Danger border |
| `--gcds-danger-text` | Danger text |
| `--gcds-active-background` | Active state background |
| `--gcds-disabled-background` | Disabled state background |
| `--gcds-focus-text` | Focus state text |
| `--gcds-focus-background` | Focus state background |

### Base Colour Palette
Blue scale: `--gcds-color-blue-50` through `--gcds-color-blue-900`
Red scale: `--gcds-color-red-50` through `--gcds-color-red-900`
Green scale: `--gcds-color-green-50` through `--gcds-color-green-900`
Yellow scale: `--gcds-color-yellow-50` through `--gcds-color-yellow-900`
Grayscale: `--gcds-color-grayscale-50` through `--gcds-color-grayscale-1000`

Key blue values:
- `--gcds-color-blue-900`: #26374a (darkest GC blue)
- `--gcds-color-blue-800`: #2b4380
- `--gcds-color-blue-750`: #335075
- `--gcds-color-blue-700`: #1c578a
- `--gcds-color-blue-600`: #2572b4
- `--gcds-color-blue-100`: #b2d8f0

---

## Spacing Tokens

Token pattern: `--gcds-spacing-<scale>`

| Token | Value |
|-------|-------|
| `--gcds-spacing-0` | 0 |
| `--gcds-spacing-25` | 0.125rem (2px) |
| `--gcds-spacing-50` | 0.25rem (4px) |
| `--gcds-spacing-75` | 0.375rem (6px) |
| `--gcds-spacing-100` | 0.5rem (8px) |
| `--gcds-spacing-150` | 0.75rem (12px) |
| `--gcds-spacing-200` | 1rem (16px) |
| `--gcds-spacing-250` | 1.25rem (20px) |
| `--gcds-spacing-300` | 1.5rem (24px) |
| `--gcds-spacing-400` | 2rem (32px) |
| `--gcds-spacing-450` | 2.25rem (36px) |
| `--gcds-spacing-500` | 2.5rem (40px) |
| `--gcds-spacing-550` | 2.75rem (44px) |
| `--gcds-spacing-600` | 3rem (48px) |
| `--gcds-spacing-700` | 3.5rem (56px) |
| `--gcds-spacing-800` | 4rem (64px) |
| `--gcds-spacing-900` | 5rem (80px) |
| `--gcds-spacing-1000` | 6rem (96px) |
| `--gcds-spacing-1050` | 6.5rem (104px) |
| `--gcds-spacing-1100` | 7rem (112px) |
| `--gcds-spacing-1150` | 7.5rem (120px) |
| `--gcds-spacing-1200` | 8rem (128px) |
| `--gcds-spacing-1250` | 8.5rem (136px) |

---

## Typography Tokens

### Font Sizes
| Token | Purpose |
|-------|---------|
| `--gcds-font-sizes-h1` | Heading 1 size |
| `--gcds-font-sizes-h2` | Heading 2 size |
| `--gcds-font-sizes-h3` | Heading 3 size |
| `--gcds-font-sizes-h4` | Heading 4 size |
| `--gcds-font-sizes-h5` | Heading 5 size |
| `--gcds-font-sizes-h6` | Heading 6 size |
| `--gcds-font-sizes-text` | Body text (1.25rem) |
| `--gcds-font-sizes-text-small` | Small text |
| `--gcds-font-sizes-caption` | Caption text |

### Font Families
| Token | Value |
|-------|-------|
| `--gcds-font-families-body` | Noto Sans, sans-serif |
| `--gcds-font-families-heading` | Noto Sans, sans-serif |
| `--gcds-font-families-monospace` | Noto Sans Mono, monospace |

### Font Weights
| Token | Value |
|-------|-------|
| `--gcds-font-weights-light` | 300 |
| `--gcds-font-weights-regular` | 400 |
| `--gcds-font-weights-medium` | 500 |
| `--gcds-font-weights-semibold` | 600 |
| `--gcds-font-weights-bold` | 700 |

### Line Heights
| Token | Value |
|-------|-------|
| `--gcds-line-heights-tight` | 1.25 |
| `--gcds-line-heights-normal` | 1.5 |
| `--gcds-line-heights-loose` | 1.75 |

---

## Usage in Custom CSS

```css
.custom-section {
  background-color: var(--gcds-bg-light);
  color: var(--gcds-text-primary);
  padding: var(--gcds-spacing-400);
  font-family: var(--gcds-font-families-body);
  font-size: var(--gcds-font-sizes-text);
  border: 1px solid var(--gcds-color-grayscale-200);
  border-radius: var(--gcds-spacing-50);
}

.custom-heading {
  color: var(--gcds-color-blue-900);
  font-weight: var(--gcds-font-weights-bold);
  margin-bottom: var(--gcds-spacing-300);
}
```
