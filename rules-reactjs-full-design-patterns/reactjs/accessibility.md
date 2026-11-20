# Accessibility Rule

## Hard Rules

1. **Semantic HTML first, ARIA second.** Use `button`, `a`, `nav`, `main`, `ul`, `h1-h6`, `label`, `dialog`. Add `role`/`aria-*` only when no native element exists. No ARIA is better than bad ARIA.
2. **Every interactive element has an accessible name.** Icon-only buttons need `aria-label`; images need meaningful `alt` (empty `alt=""` for decorative).
3. **Everything works with the keyboard alone.** Logical tab order, no positive `tabindex`, visible `:focus-visible`, `Esc` closes overlays, arrow keys for composite widgets.
4. **Modals and menus manage focus:** move focus in on open, trap it while open, and restore it to the trigger on close. Prefer native `<dialog>` or a vetted headless library over hand-rolled ones.
5. **Heading levels are hierarchical,** with a single `h1` per page. Pages use landmarks and a "skip to content" link.
6. **Text contrast meets WCAG AA** (4.5:1 body, 3:1 large text and UI components). Never convey meaning with color alone.
7. **Announce dynamic changes** (errors, toasts, loading complete, route changes) using `aria-live` regions or `role="alert"`/`role="status"`. On SPA navigation, move focus or update the document title.
8. **Touch/click targets are at least 24×24 CSS px** (aim for 44×44 on touch UIs).
9. **Respect user preferences:** `prefers-reduced-motion`, `prefers-color-scheme`, zoom up to 200% without loss of content.
10. **Prefer `getByRole`/`getByLabelText` in tests** — it verifies accessibility while testing. Run `eslint-plugin-jsx-a11y` at `error` level.

```tsx
// ✅ Correct
<button type="button" aria-label="Add to cart" onClick={handleAdd}>
  <PlusIcon aria-hidden="true" />
</button>

// ❌ Wrong
<div onClick={handleAdd}><PlusIcon /></div>
```

## Why

Accessibility is a legal and usability requirement, improves SEO and keyboard/power-user flows, and the same roles and labels make UI tests more robust.
