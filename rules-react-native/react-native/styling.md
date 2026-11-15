# Styling Rule

## Hard Rules

1. **Use `StyleSheet.create` at the bottom of the file, or the project's adopted styling library consistently.** Do not mix multiple styling approaches in one project.
2. **No inline style objects** (`style={{ ... }}`) except for values that are truly dynamic at runtime (e.g. computed from animation, safe-area insets, or props) — and then only the dynamic part, merged with a static style.

   ```tsx
   // ✅ Correct
   <View style={[styles.card, { paddingBottom: insets.bottom }]} />

   // ❌ Wrong
   <View style={{ padding: 16, backgroundColor: '#fff', borderRadius: 8 }} />
   ```
3. **All colors, spacing, radii, and typography come from the theme.** No hex colors or raw pixel numbers in components (see `no-magic-numbers.md`).
4. **Support light and dark mode** through theme colors by semantic role (`surface`, `textPrimary`) — never by hard-coded color names (`white`, `gray200`) in components.
5. **Respect safe areas** with the safe-area library's hooks/components on screens. Never hard-code status-bar or notch heights.
6. **Layout with flexbox; avoid fixed widths/heights.** Use `flex`, `gap`, and percentages so layouts adapt to different screen sizes, orientations, and font scaling.
7. **Support dynamic type.** Do not disable `allowFontScaling` except where layout truly cannot scale, and then set `maxFontSizeMultiplier`.
8. **Keyboard handling:** screens with inputs must use keyboard-avoiding behavior and keep the focused input visible.
9. **Use `Platform.select` / `.ios.tsx` / `.android.tsx` for platform differences** rather than scattered `Platform.OS === ...` checks inside JSX.

## Why

Centralized tokens make theming, dark mode, and redesigns a one-file change. Flexible layouts and font scaling are what keep the app usable across the very wide range of devices and accessibility settings it will run on.
