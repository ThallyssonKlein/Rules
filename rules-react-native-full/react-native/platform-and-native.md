# Platform and Native Modules Rule

## Hard Rules

1. **Code must work on both iOS and Android** unless the feature is explicitly platform-specific. Verify behavior on both before finishing, or state clearly which platform was not verified.
2. **Isolate platform differences** in `.ios.ts(x)` / `.android.ts(x)` files or `Platform.select` inside a dedicated module — not scattered across components.
3. **Wrap every native module/SDK behind an app-owned interface** in `src/services/` (e.g. `storage`, `analytics`, `biometrics`). Components and hooks depend on the wrapper, which makes them mockable and swappable.
4. **Request permissions just-in-time with context,** handle all outcomes (granted, denied, blocked) and provide a path to settings when blocked. Never request on app launch without need.
5. **Store secrets and tokens in secure storage (Keychain / Keystore backed),** never in plain async storage, source code, or the JS bundle. Never commit API keys or `.env` files.
6. **Config via environment/build config,** not hard-coded URLs or keys. Separate dev / staging / production.
7. **Handle connectivity and lifecycle:** offline states, app backgrounding/foregrounding, and cancelled/in-flight requests.
8. **Deep links and navigation params are typed** and validated before use; treat deep link input as untrusted.
9. **Check library compatibility before adding a dependency:** actively maintained, supports the current React Native version and the New Architecture, and works with the project's Expo/bare setup. Prefer libraries already used in the project.
10. **After adding or upgrading a native dependency,** state that a native rebuild (and `pod install` for bare iOS) is required.

## Why

Most React Native production incidents come from platform divergence, permission edge cases, leaked secrets, and unmocked native dependencies. Isolating them behind owned interfaces keeps the rest of the code portable and testable.
