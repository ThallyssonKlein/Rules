# Flyweight Pattern Rule

**Category:** Structural

Use sharing to support large numbers of fine-grained objects efficiently.

## When to Use

- The application creates a huge number of objects and storage cost is high.
- Most object state can be made extrinsic (passed in by the caller).
- Groups of objects can be replaced by few shared instances once extrinsic state is removed.
- The application does not depend on object identity.

## When NOT to Use

- The object count is small — measure first; the pattern adds complexity and run-time cost for looking up or passing extrinsic state.
- Objects have mostly unique, non-shareable state.
- Identity checks (`===`) matter to the logic.
- Shared instances are mutable — they must be immutable (`val` properties, immutable types).

## Hard Rules

1. **Apply Flyweight only when at least one "When to Use" condition is true.** If none applies, use the simpler alternative.
2. **If any "When NOT to Use" condition applies, do not introduce the pattern.** Prefer plain functions, interfaces and composition.
3. **Name the pattern in the class name only when it adds meaning** (e.g. `CachedUserRepository`, not `UserRepositoryDecoratorImpl`).

## Kotlin Example

**Kotlin note:** Image loaders (Coil/Glide), `RecyclerView.RecycledViewPool` and `remember` in Compose are flyweights already. Create your own only after measuring a real memory cost, and keep shared instances immutable.

```kotlin
// ✅ Correct — one shared, immutable icon per type; the position (extrinsic state) is passed in
class MarkerIconCache(private val createIcon: (MarkerType) -> BitmapDescriptor) {
    private val icons = ConcurrentHashMap<MarkerType, BitmapDescriptor>()

    fun get(type: MarkerType): BitmapDescriptor = icons.getOrPut(type) { createIcon(type) }
}

fun addMarker(map: GoogleMap, position: LatLng, type: MarkerType) {
    map.addMarker(MarkerOptions().position(position).icon(iconCache.get(type)))
}

// ❌ Wrong — decoding a new bitmap for each of thousands of markers on every bind
map.addMarker(MarkerOptions().position(position).icon(createIcon(type)))
```

## Related Patterns

- Composite (shared leaves in a DAG)
- State and Strategy (stateless instances can be flyweights)

## Why

Patterns buy flexibility with indirection. Use Flyweight when the flexibility it provides is actually needed today — not "just in case".
