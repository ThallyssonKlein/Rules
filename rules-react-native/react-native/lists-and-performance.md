# Lists and Performance Rule

## Hard Rules

1. **Never render long or unbounded data with `ScrollView` + `map`.** Use `FlatList`, `SectionList`, or the project's adopted virtualized list.
2. **Every list has a stable `keyExtractor`** returning a unique string id. Never use the index.
3. **`renderItem` must be a stable reference** (`useCallback` or a module-level function) and render a small, memoized (`React.memo`) item component.
4. **Tune lists when needed:** provide `getItemLayout` for fixed-height rows, and set `initialNumToRender`, `windowSize`, and `removeClippedSubviews` based on profiling — not by default.
5. **Add pagination (`onEndReached`) and pull-to-refresh** for remote lists; always render explicit empty, loading, and error states.
6. **Keep expensive work off the JS thread's hot path.** Heavy computation goes in `useMemo`, a background task, or the native side — not in render.
7. **Animate with native-driven or UI-thread animations** (`useNativeDriver: true`, or Reanimated worklets). Never animate layout properties via `setState` on every frame.
8. **Optimize images:** specify explicit dimensions, use appropriately sized assets, and a caching image component for remote images.
9. **Do not `console.log` in render or in loops** (also blocked by the logging rules).
10. **Measure before optimizing.** Do not sprinkle `memo`/`useCallback`/`useMemo` without a reason; profile with the React DevTools Profiler / Flipper-equivalent first.

```tsx
// ✅ Correct
const renderItem = useCallback(({ item }: ListRenderItemInfo<Order>) => <OrderCard order={item} onPress={handlePress} />, [handlePress]);
<FlatList data={orders} keyExtractor={order => order.id} renderItem={renderItem} />

// ❌ Wrong
<ScrollView>{orders.map((order, index) => <OrderCard key={index} order={order} />)}</ScrollView>
```

## Why

JS-thread jank and memory pressure are the most visible quality problems in a mobile app. Virtualization, stable references, and native-driven animation keep scrolling at 60 fps on mid-range devices.
