# Components Rule

## Hard Rules

1. **Function components only.** Class components are allowed solely for `ErrorBoundary`.
2. **Type props with an explicit `interface <Name>Props`.** Never use `React.FC`; annotate the props parameter directly. Never use `any` for props; type `children` as `ReactNode`.
3. **Never create components inside another component's body.** They remount every render and lose state.
4. **Do not use array index as `key`** unless the list is static and never reordered. Use a stable id.
5. **No inline object/array/function props on memoized children in hot paths.** Extract with `useMemo`/`useCallback` only when profiling or a memoized child justifies it — do not wrap everything by default.
6. **Guard conditional rendering so `0` / `''` don't leak** (`{count > 0 && ...}`, not `{count && ...}`).
7. **Presentational components receive data and callbacks via props;** they do not call APIs, read storage, or navigate. Pages/containers do.
8. **Use semantic HTML elements.** Interactive things are `<button>`/`<a>`, never a `<div onClick>`. Buttons inside forms declare `type`.
9. **Spread of native props is explicit.** Wrapper components that extend an element use `ComponentPropsWithoutRef<'button'>` and forward `ref` (React 19: as a prop; earlier: `forwardRef`). Never spread unknown props onto DOM nodes blindly.
10. **Prefer composition over configuration.** Use `children` and slots instead of ever-growing boolean props (`isPrimary`, `isLarge`, `hasIcon`...).
11. **Keep pages thin.** A page file wires hooks, layout, and routing; heavy UI goes into child components.

```tsx
// ✅ Correct
interface OrderCardProps { order: Order; onSelect: (orderId: string) => void }

export function OrderCard({ order, onSelect }: OrderCardProps) {
  return (
    <button type="button" onClick={() => onSelect(order.id)}>
      {order.title}
    </button>
  );
}

// ❌ Wrong
export const OrderCard: React.FC<any> = ({ order }) => <div onClick={() => {}}>{order.title}</div>;
```

## Why

Predictable, typed, small components render fast, are easy to test, and avoid the most common runtime bugs (remounting children, stray `0` in the DOM, unreachable `div` buttons).
