# Collections and Streams Rule

Use the right collection or stream operation for each task. Never write a manual `for` loop when a declarative operation expresses the same intent more clearly. This project targets **Java 8**, so only Java 8 Stream/Collection APIs are available — see the "Java 8 ceiling" note at the end before copying any snippet.

## Hard Rules

1. **Use `map` for transformations — never a loop that adds to a new list.**

   ```java
   // ✅ Correct
   List<String> names = users.stream().map(User::getName).collect(Collectors.toList());

   // ❌ Wrong — loop + add is a manual map
   List<String> names = new ArrayList<>();
   for (User user : users) {
       names.add(user.getName());
   }
   ```

2. **Use `filter` for exclusions — never add conditionally inside a loop.**

   ```java
   // ✅ Correct
   List<Order> active = orders.stream()
       .filter(order -> order.getStatus() == OrderStatus.ACTIVE)
       .collect(Collectors.toList());

   // ❌ Wrong
   List<Order> active = new ArrayList<>();
   for (Order order : orders) {
       if (order.getStatus() == OrderStatus.ACTIVE) active.add(order);
   }
   ```

3. **Use `findFirst` / `findAny` to locate a single element — never a loop with a flag or early `break`.**
   Return an `Optional` and resolve it explicitly (`orElseThrow`, `orElse`, `map`).

   ```java
   // ✅ Correct
   Item target = items.stream()
       .filter(item -> item.getId().equals(id))
       .findFirst()
       .orElseThrow(() -> new ItemNotFoundException(id));

   // ❌ Wrong
   Item target = null;
   for (Item item : items) {
       if (item.getId().equals(id)) { target = item; break; }
   }
   ```

4. **Use `anyMatch` / `allMatch` / `noneMatch` for boolean checks — never a manual flag variable.**

   ```java
   // ✅ Correct
   boolean hasActive = orders.stream().anyMatch(order -> order.getStatus() == OrderStatus.ACTIVE);

   // ❌ Wrong
   boolean hasActive = false;
   for (Order order : orders) {
       if (order.getStatus() == OrderStatus.ACTIVE) { hasActive = true; break; }
   }
   ```

5. **Use `flatMap` instead of nested loops that flatten.**

   ```java
   // ✅ Correct
   List<Tag> tags = posts.stream()
       .flatMap(post -> post.getTags().stream())
       .collect(Collectors.toList());

   // ❌ Wrong
   List<Tag> tags = new ArrayList<>();
   for (Post post : posts) {
       tags.addAll(post.getTags());
   }
   ```

6. **Use `contains` instead of `indexOf(...) != -1`.**

   ```java
   // ✅ Correct
   if (allowedStatuses.contains(order.getStatus())) { ... }

   // ❌ Wrong
   if (allowedStatuses.indexOf(order.getStatus()) != -1) { ... }
   ```

7. **Use `Collectors` (`groupingBy`, `toMap`, `partitioningBy`) before reaching for `reduce`.**

   ```java
   // ✅ Correct — groupingBy is the right fit for grouping
   Map<String, List<Order>> byBranch = orders.stream()
       .collect(Collectors.groupingBy(Order::getBranch));

   // ❌ Wrong — manual grouping with a null-checked get/put in a loop
   Map<String, List<Order>> byBranch = new HashMap<>();
   for (Order order : orders) {
       List<Order> bucket = byBranch.get(order.getBranch());
       if (bucket == null) { bucket = new ArrayList<>(); byBranch.put(order.getBranch(), bucket); }
       bucket.add(order);
   }
   ```

8. **Never mutate the source collection — prefer producing a new one.**
   `Collections.sort`, `List.sort`, `Collections.reverse`, and `removeIf` mutate in place. Sort through a stream instead.

   ```java
   // ✅ Correct — new sorted list, source untouched
   List<Order> sorted = orders.stream()
       .sorted(Comparator.comparing(Order::getCreatedAt))
       .collect(Collectors.toList());

   // ❌ Wrong — sorts the caller's list as a side effect
   orders.sort(Comparator.comparing(Order::getCreatedAt));
   ```

9. **Prefer exposing a defensive copy over the internal mutable collection from public methods.**
   Java 8 has no `List.of(...)` / `Set.of(...)` (added in Java 9) and no `Stream.toList()` (added in Java 16) — use `Collections.unmodifiableList(...)` (or `-Set`/`-Map`) wrapping a copy.

   ```java
   // ✅ Correct — Java 8 compatible, callers can't mutate the internal list
   public List<Tag> getTags() { return Collections.unmodifiableList(new ArrayList<>(tags)); }

   // ❌ Wrong — leaks internal mutable state
   public List<Tag> getTags() { return tags; }
   ```

   Several `Bean`/DTO classes in this codebase are plain mutable JavaBeans (no-arg constructor + getters/setters) because they cross EJB remote or JDBC row-mapping boundaries — this rule applies to the collections those classes *return*, not to relaxing their own field mutability.

10. **Never use `forEach` or `peek` to build a result or mutate outside state.**
    Lambdas in a stream pipeline must be side-effect free. If the result matters, use `map`, `filter`, `collect`, or `flatMap`. `forEach` is acceptable only as a terminal operation for a real side effect (e.g. sending each message to a queue).

    ```java
    // ✅ Correct
    return items.stream().map(this::transform).collect(Collectors.toList());

    // ❌ Wrong — mutating outside state from inside the pipeline
    List<Result> results = new ArrayList<>();
    items.forEach(item -> results.add(transform(item)));
    ```

11. **Chain at most two intermediate operations inline. Extract intermediate results beyond that.**

    ```java
    // ✅ Correct — two operations, intent is clear
    List<String> activeNames = users.stream()
        .filter(User::isActive)
        .map(User::getName)
        .collect(Collectors.toList());

    // ✅ Correct — three steps: extract the intermediate list
    List<User> activeUsers = users.stream().filter(User::isActive).collect(Collectors.toList());
    List<EnrichedUser> enriched = activeUsers.stream().map(this::enrich).collect(Collectors.toList());
    List<EnrichedUser> sorted = enriched.stream()
        .sorted(Comparator.comparing(EnrichedUser::getScore))
        .collect(Collectors.toList());

    // ❌ Wrong — four inline operations obscure what each step produces
    List<EnrichedUser> result = users.stream().filter(User::isActive).map(this::enrich)
        .sorted(Comparator.comparing(EnrichedUser::getScore)).collect(Collectors.toList());
    ```

## Java 8 ceiling — do not copy these from newer-Java examples

- `Stream.toList()` → use `.collect(Collectors.toList())`.
- `List.of(...)`, `Set.of(...)`, `Map.of(...)` → use `Collections.unmodifiableList/Set/Map(...)` wrapping a populated collection, or `Arrays.asList(...)` for small fixed literals.
- `var` → always declare the explicit type.
- Record-based value types → see `objects-and-data-structures.md`.

## Why

Declarative operations communicate *what* is being computed, not *how*. A reader seeing `filter` immediately knows only a subset passes; seeing `map` immediately knows every element is transformed. Manual loops force the reader to simulate execution to infer the same intent. This matters just as much on Java 8 as on any newer version — the only difference is which terminal/factory methods are available to express it.
