# Styling Rule

## Hard Rules

1. **Use one styling approach per project** (CSS Modules, Tailwind, or the adopted CSS-in-JS/zero-runtime library). Do not mix approaches.
2. **No inline `style={{ ... }}`** except for values that are truly dynamic at runtime (computed positions, CSS custom properties from props) — pass only the dynamic part.

   ```tsx
   // ✅ Correct
   <div className={styles.card} style={{ '--progress': `${progress}%` } as CSSProperties} />

   // ❌ Wrong
   <div style={{ padding: 16, background: '#fff', borderRadius: 8 }} />
   ```
3. **All colors, spacing, radii, shadows, and typography come from design tokens** (CSS custom properties or the Tailwind theme). No hex colors or raw pixel values in components (see `no-magic-numbers.md`).
4. **Support light and dark mode** with semantic tokens (`--color-surface`, `--color-text-primary`), never hard-coded color names in components. Respect `prefers-color-scheme`.
5. **Responsive by default, mobile-first.** Use fluid layout (flex/grid, `clamp`, `minmax`) and a small, shared set of breakpoints. No fixed widths on containers.
6. **Use relative units for text and spacing (`rem`).** Never disable browser zoom or font-size preferences.
7. **Do not use `!important`** and avoid deep selectors; keep specificity flat.
8. **Never animate layout properties** (`width`, `height`, `top`, `left`); animate `transform`/`opacity`. Honor `prefers-reduced-motion`.
9. **Prevent layout shift:** reserve space for images, embeds, and async content (`width`/`height`, `aspect-ratio`, skeletons).
10. **Use `:focus-visible` styles;** never remove the outline without a visible replacement.

## Why

Centralized tokens make theming, dark mode, and redesigns a one-file change. Flat specificity and fluid layouts keep CSS predictable across the wide range of viewports, zoom levels, and user preferences.
