# Collections and Streams Rule

Use the right collection or stream operation for each task. Never write a manual `for` loop when a declarative operation expresses the same intent more clearly.

## Hard Rules

1. **Use `map` for transformations — never a loop that adds to a new list.**
   `map` declares intent: input collection → output collection of the same size. A loop with `add` is an imperative workaround that forces the reader to infer the intent.

   ```java
   // ✅ Correct
   List<String> names = users.stream().map(User::name).toList();

   // ❌ Wrong — loop + add is a manual map
   List<String> names = new ArrayList<>();
   for (User user : users) {
       names.add(user.name());
   }
   ```

2. **Use `filter` for exclusions — never add conditionally inside a loop.**

   ```java
   // ✅ Correct
   List<Order> active = orders.stream()
       .filter(order -> order.status() == OrderStatus.ACTIVE)
       .toList();

   // ❌ Wrong
   List<Order> active = new ArrayList<>();
   for (Order order : orders) {
       if (order.status() == OrderStatus.ACTIVE) active.add(order);
   }
   ```

3. **Use `findFirst` / `findAny` to locate a single element — never a loop with a flag or early `break`.**
   Return an `Optional` and resolve it explicitly (`orElseThrow`, `orElse`, `map`).

   ```java
   // ✅ Correct
   Item target = items.stream()
       .filter(item -> item.id().equals(id))
       .findFirst()
       .orElseThrow(() -> new ItemNotFoundException(id));

   // ❌ Wrong
   Item target = null;
   for (Item item : items) {
       if (item.id().equals(id)) { target = item; break; }
   }
   ```

4. **Use `anyMatch` / `allMatch` / `noneMatch` for boolean checks — never a manual flag variable.**

   ```java
   // ✅ Correct
   boolean hasActive = orders.stream().anyMatch(order -> order.status() == OrderStatus.ACTIVE);
   boolean allConfirmed = orders.stream().allMatch(Order::confirmed);

   // ❌ Wrong
   boolean hasActive = false;
   for (Order order : orders) {
       if (order.status() == OrderStatus.ACTIVE) { hasActive = true; break; }
   }
   ```

5. **Use `flatMap` instead of nested loops that flatten.**

   ```java
   // ✅ Correct
   List<Tag> tags = posts.stream().flatMap(post -> post.tags().stream()).toList();

   // ❌ Wrong
   List<Tag> tags = new ArrayList<>();
   for (Post post : posts) {
       tags.addAll(post.tags());
   }
   ```

6. **Use `contains` instead of `indexOf(...) != -1`.**

   ```java
   // ✅ Correct
   if (allowedStatuses.contains(order.status())) { ... }

   // ❌ Wrong
   if (allowedStatuses.indexOf(order.status()) != -1) { ... }
   ```

7. **Use `Collectors` (`groupingBy`, `toMap`, `partitioningBy`) before reaching for `reduce`.**
   `reduce` is powerful but hurts readability. Use it only when no collector fits.

   ```java
   // ✅ Correct — groupingBy is the right fit for grouping
   Map<String, List<Order>> byTenant = orders.stream()
       .collect(Collectors.groupingBy(Order::tenantId));

   // ✅ Correct — toMap when mapping to a map
   Map<String, String> labelById = items.stream()
       .collect(Collectors.toMap(Item::id, Item::label));

   // ❌ Wrong — manual grouping with computeIfAbsent in a loop
   Map<String, List<Order>> byTenant = new HashMap<>();
   for (Order order : orders) {
       byTenant.computeIfAbsent(order.tenantId(), key -> new ArrayList<>()).add(order);
   }

   // ❌ Wrong — reduce used as a convoluted map
   List<String> names = users.stream().reduce(new ArrayList<>(), (acc, user) -> { acc.add(user.name()); return acc; }, (a, b) -> a);
   ```

8. **Never mutate the source collection — always produce a new one.**
   `Collections.sort`, `List.sort`, `Collections.reverse`, and `removeIf` mutate in place. Sort through a stream, and expose immutable collections.

   ```java
   // ✅ Correct — new sorted list, source untouched
   List<Order> sorted = orders.stream()
       .sorted(Comparator.comparing(Order::createdAt))
       .toList();

   // ❌ Wrong — sorts the caller's list as a side effect
   orders.sort(Comparator.comparing(Order::createdAt));
   ```

9. **Prefer `Stream.toList()` over `collect(Collectors.toList())`, and return immutable collections from public methods.**
   Use `List.of`, `Set.of`, `Map.of`, or `List.copyOf` to expose data. Never return an internal mutable collection.

   ```java
   // ✅ Correct
   public List<Tag> tags() { return List.copyOf(tags); }

   // ❌ Wrong — leaks internal mutable state
   public List<Tag> tags() { return tags; }
   ```

10. **Never use `forEach` or `peek` to build a result or mutate outside state.**
    Lambdas in a stream pipeline must be side-effect free. If the result matters, use `map`, `filter`, `collect`, or `flatMap`. `forEach` is acceptable only as a terminal operation for a real side effect (e.g. sending each message).

    ```java
    // ✅ Correct
    return items.stream().map(this::transform).toList();

    // ❌ Wrong — mutating outside state from inside the pipeline
    List<Result> results = new ArrayList<>();
    items.forEach(item -> results.add(transform(item)));
    ```

11. **Chain at most two intermediate operations inline. Extract intermediate results beyond that.**
    Long chains are hard to debug and hide intermediate types.

    ```java
    // ✅ Correct — two operations, intent is clear
    List<String> activeNames = users.stream().filter(User::active).map(User::name).toList();

    // ✅ Correct — three steps: extract the intermediate list
    List<User> activeUsers = users.stream().filter(User::active).toList();
    List<EnrichedUser> enriched = activeUsers.stream().map(this::enrich).toList();
    List<EnrichedUser> sorted = enriched.stream().sorted(Comparator.comparing(EnrichedUser::score)).toList();

    // ❌ Wrong — four inline operations obscure what each step produces
    List<EnrichedUser> result = users.stream().filter(User::active).map(this::enrich)
        .sorted(Comparator.comparing(EnrichedUser::score)).toList();
    ```

## Why

Declarative operations communicate *what* is being computed, not *how*. A reader seeing `filter` immediately knows only a subset passes; seeing `map` immediately knows every element is transformed. Manual loops force the reader to simulate execution to infer the same intent. Immutability prevents surprising aliasing bugs, and capping chain length keeps intermediate types inspectable and failures easier to isolate.
