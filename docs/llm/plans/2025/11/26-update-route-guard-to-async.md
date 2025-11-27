# Plan: Update Route Guard to be Async

## Problem Analysis

The current route guard in `src/lib/router.ts:31-42` uses `authStore.isAuthenticated` which is a synchronous computed property. However, authentication state depends on the `authMe` mutation being called to fetch session information from the backend. The guard needs to wait for this async operation to complete before making routing decisions.

## Current Issues

1. **Race Condition**: The guard checks `isAuthenticated` before the `me()` method completes
2. **No Session Initialization**: There's no automatic session checking on app startup
3. **Synchronous Guard**: Current guard cannot wait for async operations
4. **Delayed Session Check**: Session validation only happens when guard runs, not when app starts

## Proposed Solutions

### Approach 1: Promise-based Session Tracking (Recommended)

**Concept**: Add a `sessionInfoPromise` to the auth store that tracks the current session validation attempt.

**Pros**:
- Clean separation of concerns
- Promise can be cached and reused
- Easy to understand and debug
- Supports concurrent calls without duplicate requests
- **Eager initialization**: Session check starts immediately when store is created
- **Never null**: `sessionInfoPromise` always holds a Promise value
- **Leverages hoisting**: Can call `me()` before declaration for cleaner code

**Cons**:
- Requires understanding of function hoisting
- Promise management needs to handle re-calls properly

**Implementation**:
```typescript
// In auth store - using eager initialization with hoisting
const sessionInfoPromise = ref(me().catch(() => {}))

async function ensureSession() {
  // Promise is always available, never null
  return sessionInfoPromise.value
}

// me() is available above due to function hoisting
async function me() {
  sessionInfoPromise.value = _authMe()
    .then(user => {
      sessionData.value = {
        username: user.username,
        userId: user.userId,
        uuid: user.uuid
      }
      return user
    })
    .catch(error => {
      sessionData.value = null
      throw error
    })
  
  return sessionInfoPromise.value
}

// Reset promise on logout
async function logout() {
  await _authLogout()
  sessionData.value = null
  // Start new session check immediately
  sessionInfoPromise.value = me().catch(() => {})
}
```

### Approach 2: Loading State with Retry

**Concept**: Add an `authChecking` state and make the guard wait/check/retry.

**Pros**:
- Simpler promise management
- Clear loading state for UI
- More explicit about what's happening

**Cons**:
- More complex guard logic
- Potential for infinite retries if not careful
- May require timeout handling

### Approach 3: Async Computed Property

**Concept**: Create an async computed property that resolves when auth state is known.

**Pros**:
- Vue 3 Composition API friendly
- Reactive and declarative

**Cons**:
- Requires additional libraries (vue-async-computed)
- May be overkill for this use case
- Less control over timing

### Approach 4: Store Initialization Pattern

**Concept**: Initialize the auth store before router creation, ensuring session is known.

**Pros**:
- Simple and straightforward
- No changes needed to guard logic
- Predictable startup sequence

**Cons**:
- Blocks app startup on network request
- Poor UX if network is slow
- May show blank screen during initialization

## Vue Router Async Support

**Yes, Vue Router fully supports async navigation guards**. The `beforeEach` guard can return a Promise, and Vue Router will wait for it to resolve before proceeding.

```typescript
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth) {
    await authStore.ensureSession() // Always awaits a valid promise, never null
    if (!authStore.isAuthenticated) {
      next({ name: 'login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } else {
    next()
  }
})
```

## Recommended Implementation Plan

### 1. Update Auth Store (`src/stores/auth.ts`)

Add the following to the auth store using eager initialization:
- `sessionInfoPromise` ref initialized immediately with `me()` call (leveraging function hoisting)
- `ensureSession()` method that always returns the existing promise (never null)
- Update `me()` to manage the promise state and handle re-calls
- Update `logout()` to reset the promise with a new `me()` call
- Leverage JavaScript function hoisting to call `me()` before its declaration

**Key optimization**: Session check starts immediately when store is created, not when first needed.

### 2. Update Router Guard (`src/lib/router.ts`)

Convert the `beforeEach` guard to async:
- Use `await authStore.ensureSession()` before checking `isAuthenticated`
- No null checks needed since `sessionInfoPromise` is always defined
- Keep the same redirect logic but make it async-aware

### 3. App Initialization (`src/main.ts`)

No additional initialization needed - the eager initialization in the store handles this automatically.

## Files to Modify

1. `src/stores/auth.ts` - Add eager-initialized promise-based session tracking
2. `src/lib/router.ts` - Convert guard to async (no null checks needed)

## Testing Considerations

- Test guard behavior with slow network responses
- Test concurrent route navigation during session checking
- Test promise caching (multiple rapid calls should use same promise)
- Test promise invalidation after logout
- Test error handling when `me()` fails

## Edge Cases to Handle

1. **Network Errors**: What happens when `me()` fails? (Handled by catch in eager init)
2. **Timeouts**: Should we add a timeout to session checking?
3. **Concurrent Navigation**: Multiple route changes during session check
4. **Promise Rejection**: Handling when the session promise rejects (eager init prevents unhandled rejections)
5. **Function Re-calls**: What happens when `me()` is called again while promise is pending?

## Your Proposed Solution Analysis

Your idea of exposing `sessionInfoPromise` in the auth store is **excellent** and aligns with Approach 1. With the eager initialization optimization, this approach:

- ✅ Solves the race condition
- ✅ Prevents duplicate `me()` calls
- ✅ Is clean and maintainable
- ✅ Works well with Vue Router's async guard support
- ✅ Allows easy promise invalidation/replacement
- ✅ **Starts session check immediately** when store is created (no delay)
- ✅ **Never has null values** - promise is always available
- ✅ **Leverages function hoisting** for elegant code organization

The only additional consideration is error handling - what should happen if the `me()` call fails? The guard should handle this gracefully and redirect to login. The eager initialization uses `.catch(() => {})` to prevent unhandled promise rejections while still preserving the error state for the guard to handle.