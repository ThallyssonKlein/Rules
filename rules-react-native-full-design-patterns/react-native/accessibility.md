# Accessibility Rule

## Hard Rules

1. **Every interactive element has an accessible name and role.** Set `accessibilityRole` and `accessibilityLabel` (when visible text isn't enough), plus `accessibilityState` (`disabled`, `selected`, `checked`, `busy`).
2. **Icon-only buttons must have an `accessibilityLabel`.**
3. **Touch targets are at least 44×44 pt (iOS) / 48×48 dp (Android).** Use `hitSlop` when the visual is smaller.
4. **Text contrast meets WCAG AA** (4.5:1 body, 3:1 large). Never convey meaning with color alone.
5. **Support screen readers:** logical focus order, group related content with `accessible`, hide decorative elements (`accessibilityElementsHidden` / `importantForAccessibility="no-hide-descendants"`).
6. **Announce dynamic changes** (errors, toasts, loading complete) with the accessibility announcement API or live regions.
7. **Respect user settings:** font scaling (see `styling.md`), reduce-motion (skip or shorten animations), and bold text.
8. **Form inputs have labels, appropriate `keyboardType`, `textContentType`/`autoComplete`, and clear error text tied to the field.**
9. **Prefer `getByRole`/`getByLabelText` in tests** — it verifies accessibility while testing.

```tsx
// ✅ Correct
<Pressable accessibilityRole="button" accessibilityLabel="Add to cart" onPress={handleAdd} hitSlop={theme.spacing.sm}>
  <PlusIcon />
</Pressable>
```

## Why

Accessibility is a legal and usability requirement on both stores, and the same labels and roles make UI tests more robust.
