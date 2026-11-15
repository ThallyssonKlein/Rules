# Hooks Rule

## Hard Rules

1. **Follow the Rules of Hooks:** call hooks only at the top level of components/hooks, never in conditions, loops, or nested functions. The `react-hooks` ESLint plugin must be enabled at `error` level.
2. **Never disable `react-hooks/exhaustive-deps`.** Fix the dependency list instead (stabilize with `useCallback`/`useRef`, or move logic out of the effect).
3. **Do not use `useEffect` for what can be derived or handled in an event.**
   - Derived values → compute during render (or `useMemo` if expensive).
   - User actions → run in the event handler.
   - Resetting state when a prop changes → give the component a `key`, do not sync with an effect.
   - Reserve effects for synchronizing with external systems (subscriptions, DOM APIs, timers, non-React widgets).
4. **Every effect that subscribes, sets a timer, or adds a listener must return a cleanup.** Effects must survive being mounted, unmounted and mounted again (React Strict Mode runs them twice in development).
5. **Extract reusable stateful logic into a custom hook** named `useX` that returns a small, typed, stable API. A hook does one thing.
6. **Use functional state updates** (`setX(prev => ...)`) when the new state depends on the old state.
7. **Do not store derived data in state.** Do not duplicate props into state.
8. **Use `useSyncExternalStore` for external stores/browser state** (`matchMedia`, `online` status, custom stores) instead of `useState` + `useEffect`.
9. **Keep context values small and memoized.** Split contexts by update frequency to avoid re-rendering the whole tree.
10. **Fetching never lives in a bare `useEffect`.** Use the project's data-fetching layer (see `state-and-data.md`).

```tsx
// ✅ Correct — derive, don't sync with effect
const visibleOrders = useMemo(() => orders.filter(order => order.status === status), [orders, status]);

// ❌ Wrong — effect used to derive state
const [visibleOrders, setVisibleOrders] = useState<Order[]>([]);
useEffect(() => { setVisibleOrders(orders.filter(order => order.status === status)); }, [orders, status]);
```

## Why

Misused effects cause render loops, stale data, leaks, and double-fetches. Most of them disappear when state is derived during render and effects are reserved for real external synchronization.
