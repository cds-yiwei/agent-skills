# Tailwind CSS Gap Components for GCDS

When the GC Design System lacks an advanced component, use Tailwind CSS to build it while matching GCDS visual style. Load Tailwind via CDN alongside GCDS:

```html
<script src="https://cdn.tailwindcss.com"></script>
<script>
tailwind.config = {
  prefix: 'tw-',  // Avoid conflicts with GCDS CSS shortcuts
  theme: {
    extend: {
      colors: {
        'gc-blue-900': '#26374a',
        'gc-blue-800': '#2b4380',
        'gc-blue-700': '#335075',
        'gc-blue-600': '#1c578a',
        'gc-blue-500': '#2572b4',
        'gc-blue-100': '#b2d8f0',
        'gc-red-700': '#d3080c',
        'gc-red-100': '#f3e8e8',
        'gc-green-700': '#1b6c1e',
        'gc-green-100': '#d8eeca',
        'gc-yellow-700': '#ee7100',
        'gc-yellow-100': '#f9f4d4',
        'gc-gray-50': '#f5f5f5',
        'gc-gray-100': '#eeeeee',
        'gc-gray-200': '#cccccc',
        'gc-gray-600': '#666666',
        'gc-gray-700': '#555555',
        'gc-gray-800': '#444444',
        'gc-gray-900': '#333333',
        'gc-text': '#333333',
        'gc-text-secondary': '#555555',
        'gc-border': '#cccccc',
        'gc-bg-light': '#f5f5f5',
      },
      fontFamily: {
        'gc': ['Noto Sans', 'sans-serif'],
      },
      borderRadius: {
        'gc': '0.25rem',
      }
    }
  }
}
</script>
```

**Important:** Use `tw-` prefix on all Tailwind classes to avoid conflicts with GCDS CSS Shortcuts.

---

## Table of Contents

- [Enhanced Card](#enhanced-card)
- [Data Table](#data-table)
- [Modal Dialog](#modal-dialog)
- [Toast Notification](#toast-notification)
- [Tabs](#tabs)
- [Badge / Tag](#badge--tag)
- [Stats / Metric Card](#stats--metric-card)
- [Hero Section](#hero-section)

---

## Enhanced Card

The built-in `<gcds-card>` is a simple link card. For multi-action cards with richer content:

### Basic Content Card
```html
<div class="tw-bg-white tw-border tw-border-gc-border tw-rounded-gc tw-overflow-hidden tw-font-gc">
  <img src="image.jpg" alt="Description" class="tw-w-full tw-h-48 tw-object-cover">
  <div class="tw-p-6">
    <span class="tw-inline-block tw-bg-gc-blue-100 tw-text-gc-blue-900 tw-text-xs tw-font-semibold tw-px-2 tw-py-1 tw-rounded-gc tw-mb-3">Category</span>
    <h3 class="tw-text-lg tw-font-semibold tw-text-gc-blue-900 tw-mb-2">Card Title</h3>
    <p class="tw-text-gc-text-secondary tw-text-sm tw-mb-4">Card description text goes here with more detail than the basic card supports.</p>
    <div class="tw-flex tw-gap-3">
      <gcds-button button-role="primary" size="small">Primary Action</gcds-button>
      <gcds-button button-role="secondary" size="small">Secondary</gcds-button>
    </div>
  </div>
</div>
```

### Horizontal Card
```html
<div class="tw-flex tw-flex-col md:tw-flex-row tw-bg-white tw-border tw-border-gc-border tw-rounded-gc tw-overflow-hidden tw-font-gc">
  <img src="image.jpg" alt="" class="tw-w-full md:tw-w-64 tw-h-48 md:tw-h-auto tw-object-cover">
  <div class="tw-p-6 tw-flex tw-flex-col tw-justify-between">
    <div>
      <h3 class="tw-text-lg tw-font-semibold tw-text-gc-blue-900 tw-mb-2">Title</h3>
      <p class="tw-text-gc-text-secondary tw-text-sm">Description with supporting details.</p>
    </div>
    <div class="tw-mt-4">
      <gcds-link href="/details">Learn more</gcds-link>
    </div>
  </div>
</div>
```

### Card Grid (3 columns)
```html
<gcds-grid columns="1fr" columns-tablet="1fr 1fr" columns-desktop="1fr 1fr 1fr" gap="400">
  <!-- Repeat card pattern for each item -->
  <div class="tw-bg-white tw-border tw-border-gc-border tw-rounded-gc tw-p-6 tw-font-gc">
    <h3 class="tw-text-lg tw-font-semibold tw-text-gc-blue-900 tw-mb-2">Card 1</h3>
    <p class="tw-text-gc-text-secondary tw-text-sm">Description.</p>
  </div>
  <!-- ... more cards -->
</gcds-grid>
```

---

## Data Table

GCDS has no table component. Build accessible tables with Tailwind:

### Basic Table
```html
<div class="tw-overflow-x-auto tw-border tw-border-gc-border tw-rounded-gc tw-font-gc">
  <table class="tw-w-full tw-text-sm tw-text-left tw-text-gc-text">
    <thead class="tw-bg-gc-blue-900 tw-text-white">
      <tr>
        <th class="tw-px-4 tw-py-3 tw-font-semibold">Name</th>
        <th class="tw-px-4 tw-py-3 tw-font-semibold">Status</th>
        <th class="tw-px-4 tw-py-3 tw-font-semibold">Date</th>
        <th class="tw-px-4 tw-py-3 tw-font-semibold">Actions</th>
      </tr>
    </thead>
    <tbody class="tw-divide-y tw-divide-gc-border">
      <tr class="hover:tw-bg-gc-gray-50">
        <td class="tw-px-4 tw-py-3">John Doe</td>
        <td class="tw-px-4 tw-py-3">
          <span class="tw-bg-gc-green-100 tw-text-gc-green-700 tw-text-xs tw-font-medium tw-px-2 tw-py-1 tw-rounded-gc">Active</span>
        </td>
        <td class="tw-px-4 tw-py-3">2025-10-01</td>
        <td class="tw-px-4 tw-py-3">
          <gcds-link href="/edit/1">Edit</gcds-link>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Striped Table
```html
<div class="tw-overflow-x-auto tw-border tw-border-gc-border tw-rounded-gc tw-font-gc">
  <table class="tw-w-full tw-text-sm tw-text-left tw-text-gc-text">
    <thead class="tw-bg-gc-gray-100 tw-text-gc-text">
      <tr>
        <th class="tw-px-4 tw-py-3 tw-font-semibold">Column A</th>
        <th class="tw-px-4 tw-py-3 tw-font-semibold">Column B</th>
      </tr>
    </thead>
    <tbody>
      <tr class="tw-bg-white">
        <td class="tw-px-4 tw-py-3">Data 1</td>
        <td class="tw-px-4 tw-py-3">Data 2</td>
      </tr>
      <tr class="tw-bg-gc-gray-50">
        <td class="tw-px-4 tw-py-3">Data 3</td>
        <td class="tw-px-4 tw-py-3">Data 4</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## Modal Dialog

GCDS has no modal. Build one with Tailwind + minimal JS:

```html
<!-- Trigger -->
<gcds-button button-role="primary" onclick="document.getElementById('modal-1').showModal()">
  Open Modal
</gcds-button>

<!-- Modal -->
<dialog id="modal-1" class="tw-p-0 tw-rounded-gc tw-border tw-border-gc-border tw-shadow-xl tw-max-w-lg tw-w-full tw-font-gc tw-backdrop:tw-bg-black/50">
  <div class="tw-flex tw-items-center tw-justify-between tw-px-6 tw-py-4 tw-border-b tw-border-gc-border tw-bg-gc-gray-50">
    <h2 class="tw-text-lg tw-font-semibold tw-text-gc-blue-900">Modal Title</h2>
    <button onclick="this.closest('dialog').close()" class="tw-text-gc-gray-600 hover:tw-text-gc-text tw-text-xl tw-leading-none" aria-label="Close">&times;</button>
  </div>
  <div class="tw-px-6 tw-py-4">
    <p class="tw-text-gc-text">Modal body content goes here. This can contain forms, text, or any HTML.</p>
  </div>
  <div class="tw-flex tw-justify-end tw-gap-3 tw-px-6 tw-py-4 tw-border-t tw-border-gc-border tw-bg-gc-gray-50">
    <gcds-button button-role="secondary" onclick="this.closest('dialog').close()">Cancel</gcds-button>
    <gcds-button button-role="primary">Confirm</gcds-button>
  </div>
</dialog>
```

**Key points:**
- Uses native `<dialog>` element for accessibility (Escape to close, focus trapping)
- `showModal()` adds backdrop automatically
- Style backdrop with `tw-backdrop:tw-bg-black/50`

---

## Toast Notification

GCDS has no toast/snackbar. Build a dismissible toast:

```html
<!-- Toast container - position fixed at top right -->
<div id="toast-container" class="tw-fixed tw-top-4 tw-right-4 tw-z-50 tw-flex tw-flex-col tw-gap-3 tw-font-gc" aria-live="polite"></div>

<!-- Toast template (clone via JS) -->
<template id="toast-template">
  <div class="tw-flex tw-items-start tw-gap-3 tw-p-4 tw-rounded-gc tw-shadow-lg tw-border tw-max-w-sm tw-animate-[slideIn_0.3s_ease-out]" role="alert">
    <gcds-icon class="tw-mt-0.5 tw-flex-shrink-0"></gcds-icon>
    <div class="tw-flex-1">
      <p class="tw-font-semibold tw-text-sm toast-title"></p>
      <p class="tw-text-sm tw-mt-1 toast-message"></p>
    </div>
    <button onclick="this.closest('[role=alert]').remove()" class="tw-text-gc-gray-600 hover:tw-text-gc-text tw-text-lg tw-leading-none tw-flex-shrink-0" aria-label="Dismiss">&times;</button>
  </div>
</template>

<style>
  @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
</style>

<script>
function showToast(type, title, message, duration = 5000) {
  const styles = {
    success: { bg: 'tw-bg-gc-green-100', border: 'tw-border-gc-green-700', icon: 'checkmark-circle' },
    warning: { bg: 'tw-bg-gc-yellow-100', border: 'tw-border-gc-yellow-700', icon: 'warning-triangle' },
    danger:  { bg: 'tw-bg-gc-red-100', border: 'tw-border-gc-red-700', icon: 'exclamation-circle' },
    info:    { bg: 'tw-bg-gc-blue-100', border: 'tw-border-gc-blue-800', icon: 'info-circle' },
  };
  const s = styles[type] || styles.info;
  const tmpl = document.getElementById('toast-template').content.cloneNode(true);
  const el = tmpl.querySelector('[role=alert]');
  el.classList.add(s.bg, s.border);
  tmpl.querySelector('gcds-icon').setAttribute('name', s.icon);
  tmpl.querySelector('.toast-title').textContent = title;
  tmpl.querySelector('.toast-message').textContent = message;
  document.getElementById('toast-container').appendChild(tmpl);
  if (duration > 0) setTimeout(() => el?.remove(), duration);
}
</script>
```

**Usage:**
```javascript
showToast('success', 'Saved', 'Your changes have been saved.');
showToast('danger', 'Error', 'Something went wrong. Try again.');
showToast('warning', 'Warning', 'Your session will expire in 5 minutes.');
showToast('info', 'Info', 'A new version is available.');
```

---

## Tabs

GCDS has no tab component. Build accessible tabs:

```html
<div class="tw-font-gc" role="tablist" aria-label="Content tabs">
  <div class="tw-flex tw-border-b tw-border-gc-border">
    <button role="tab" aria-selected="true" aria-controls="panel-1" id="tab-1"
      class="tw-px-4 tw-py-3 tw-text-sm tw-font-semibold tw-border-b-2 tw-border-gc-blue-900 tw-text-gc-blue-900 tw-bg-transparent"
      onclick="switchTab(this, 'panel-1')">Tab 1</button>
    <button role="tab" aria-selected="false" aria-controls="panel-2" id="tab-2"
      class="tw-px-4 tw-py-3 tw-text-sm tw-font-semibold tw-border-b-2 tw-border-transparent tw-text-gc-text-secondary tw-bg-transparent hover:tw-text-gc-blue-900 hover:tw-border-gc-gray-200"
      onclick="switchTab(this, 'panel-2')">Tab 2</button>
  </div>
  <div id="panel-1" role="tabpanel" aria-labelledby="tab-1" class="tw-p-4">
    <p>Tab 1 content here.</p>
  </div>
  <div id="panel-2" role="tabpanel" aria-labelledby="tab-2" class="tw-p-4 tw-hidden">
    <p>Tab 2 content here.</p>
  </div>
</div>

<script>
function switchTab(tab, panelId) {
  const tablist = tab.closest('[role=tablist]');
  tablist.querySelectorAll('[role=tab]').forEach(t => {
    t.setAttribute('aria-selected', 'false');
    t.classList.replace('tw-border-gc-blue-900', 'tw-border-transparent');
    t.classList.replace('tw-text-gc-blue-900', 'tw-text-gc-text-secondary');
  });
  tablist.querySelectorAll('[role=tabpanel]').forEach(p => p.classList.add('tw-hidden'));
  tab.setAttribute('aria-selected', 'true');
  tab.classList.replace('tw-border-transparent', 'tw-border-gc-blue-900');
  tab.classList.replace('tw-text-gc-text-secondary', 'tw-text-gc-blue-900');
  document.getElementById(panelId).classList.remove('tw-hidden');
}
</script>
```

---

## Badge / Tag

```html
<!-- Status badges -->
<span class="tw-inline-flex tw-items-center tw-px-2.5 tw-py-0.5 tw-rounded-gc tw-text-xs tw-font-semibold tw-font-gc tw-bg-gc-green-100 tw-text-gc-green-700">Active</span>
<span class="tw-inline-flex tw-items-center tw-px-2.5 tw-py-0.5 tw-rounded-gc tw-text-xs tw-font-semibold tw-font-gc tw-bg-gc-red-100 tw-text-gc-red-700">Closed</span>
<span class="tw-inline-flex tw-items-center tw-px-2.5 tw-py-0.5 tw-rounded-gc tw-text-xs tw-font-semibold tw-font-gc tw-bg-gc-yellow-100 tw-text-gc-yellow-700">Pending</span>
<span class="tw-inline-flex tw-items-center tw-px-2.5 tw-py-0.5 tw-rounded-gc tw-text-xs tw-font-semibold tw-font-gc tw-bg-gc-blue-100 tw-text-gc-blue-900">New</span>
<span class="tw-inline-flex tw-items-center tw-px-2.5 tw-py-0.5 tw-rounded-gc tw-text-xs tw-font-semibold tw-font-gc tw-bg-gc-gray-100 tw-text-gc-gray-700">Archived</span>
```

---

## Stats / Metric Card

```html
<gcds-grid columns="1fr" columns-tablet="1fr 1fr" columns-desktop="1fr 1fr 1fr 1fr" gap="300">
  <div class="tw-bg-white tw-border tw-border-gc-border tw-rounded-gc tw-p-6 tw-text-center tw-font-gc">
    <p class="tw-text-3xl tw-font-bold tw-text-gc-blue-900">1,234</p>
    <p class="tw-text-sm tw-text-gc-text-secondary tw-mt-1">Applications received</p>
  </div>
  <div class="tw-bg-white tw-border tw-border-gc-border tw-rounded-gc tw-p-6 tw-text-center tw-font-gc">
    <p class="tw-text-3xl tw-font-bold tw-text-gc-green-700">89%</p>
    <p class="tw-text-sm tw-text-gc-text-secondary tw-mt-1">Approval rate</p>
  </div>
  <div class="tw-bg-white tw-border tw-border-gc-border tw-rounded-gc tw-p-6 tw-text-center tw-font-gc">
    <p class="tw-text-3xl tw-font-bold tw-text-gc-yellow-700">14</p>
    <p class="tw-text-sm tw-text-gc-text-secondary tw-mt-1">Days average processing</p>
  </div>
  <div class="tw-bg-white tw-border tw-border-gc-border tw-rounded-gc tw-p-6 tw-text-center tw-font-gc">
    <p class="tw-text-3xl tw-font-bold tw-text-gc-red-700">23</p>
    <p class="tw-text-sm tw-text-gc-text-secondary tw-mt-1">Pending review</p>
  </div>
</gcds-grid>
```

---

## Hero Section

```html
<div class="tw-bg-gc-blue-900 tw-text-white tw-py-16 tw-font-gc">
  <gcds-container size="xl" centered>
    <div class="tw-max-w-2xl">
      <h1 class="tw-text-4xl tw-font-bold tw-mb-4">Service Title</h1>
      <p class="tw-text-lg tw-mb-8 tw-text-gc-blue-100">Brief description of the government service and what citizens can do here.</p>
      <div class="tw-flex tw-gap-4">
        <gcds-button button-role="primary">Get Started</gcds-button>
        <gcds-button button-role="secondary">Learn More</gcds-button>
      </div>
    </div>
  </gcds-container>
</div>
```
