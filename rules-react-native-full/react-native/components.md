# Components Rule

## Hard Rules

1. **Function components only.** Class components are allowed solely for `ErrorBoundary`.
2. **Type props with an explicit `interface <Name>Props`.** Never use `React.FC`; annotate the props parameter directly. Never use `any` for props or children (`ReactNode`).
3. **Never create components inside another component's body.** They remount every render and lose state.
4. **Do not use array index as `key`** unless the list is static and never reordered. Use a stable id.
5. **No inline object/array/function props on memoized children in hot paths.** Extract with `useMemo`/`useCallback` only when profiling or a memoized child justifies it — do not wrap everything by default.
6. **Raw text must be inside `<Text>`.** Never render strings or numbers directly inside `<View>`. Guard conditional rendering so `0` / `''` don't leak (`{count > 0 && ...}`, not `{count && ...}`).
7. **Presentational components receive data and callbacks via props;** they do not call APIs, read storage, or navigate. Screens/containers do.
8. **Use `Pressable` for touchables.** Do not use the legacy `TouchableOpacity`/`TouchableWithoutFeedback` in new code.
9. **Keep screens thin.** A screen file wires hooks, layout, and navigation; heavy UI goes into child components.

```tsx
// ✅ Correct
interface OrderCardProps { order: Order; onPress: (orderId: string) => void }

export function OrderCard({ order, onPress }: OrderCardProps) {
  return (
    <Pressable onPress={() => onPress(order.id)} accessibilityRole="button">
      <Text>{order.title}</Text>
    </Pressable>
  );
}

// ❌ Wrong
export const OrderCard: React.FC<any> = ({ order }) => <View>{order.title}</View>;
```

## Why

Predictable, typed, small components render fast, are easy to test, and avoid the most common RN runtime crashes (stray text outside `<Text>`, remounting children).
