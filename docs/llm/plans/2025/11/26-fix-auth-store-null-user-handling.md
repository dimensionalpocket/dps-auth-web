# Fix Auth Store _authMe Null User Handling

## Date
2025-11-26@20:06

## Problem Analysis

The auth store has an issue in the `me()` function (line 76-90) where `_authMe()` can return a null user when the user is not authenticated, but the current code assumes the user object will always be present.

### Current Issue
In `src/stores/auth.ts:76-90`, the `me()` function handles the `_authMe()` response incorrectly:

```typescript
async function me (): Promise<void> {
  sessionInfoPromise.value = _authMe()
    .then(user => {
      sessionData.value = {
        username: user.username,  // This will fail if user is null
        userId: user.userId,      // This will fail if user is null
        uuid: user.uuid           // This will fail if user is null
      };
    })
    .catch(error => {
      sessionData.value = null;
      throw error;
    });
  
  return sessionInfoPromise.value;
}
```

The issue is that when `_authMe()` is called without a valid session, it likely returns `null` or throws an error, but the current code only handles errors in the `.catch()` block. If `null` is returned (not an error), the `.then()` block will try to access properties on `null`, causing a runtime error.

## Root Cause

Based on the GraphQL schema documentation, `authMe` requires "Valid session cookie". When no valid session exists:
1. The GraphQL query likely returns `null` for the `authMe` field
2. The `_authMe()` wrapper returns `result.data.authMe` which would be `null`
3. The current code doesn't handle the `null` case properly

## Solution Plan

### Files to Modify
- `src/stores/auth.ts` - Fix the `me()` function to handle null user response

### Implementation Details

1. **Update the `me()` function** to properly handle null user response:
   - Check if the returned user is null before accessing its properties
   - Set `sessionData.value = null` when user is null (not authenticated)
   - Only set session data when user is not null

2. **Update the `_authMe()` wrapper function** in `src/lib/auth-wrapper.ts`:
   - Modify the return type to allow null: `Promise<AuthMeResponse | null>`
   - Handle the case where `result.data.authMe` is null

### Code Changes

#### 1. Update auth-wrapper.ts (_authMe function)

```typescript
export async function _authMe(): Promise<AuthMeResponse | null> {
  const result = await client.query(AUTH_ME, {}).toPromise()
  if (result.error) throw result.error
  return result.data.authMe  // This can be null when not authenticated
}
```

#### 2. Update auth.ts (me function)

```typescript
async function me (): Promise<void> {
  sessionInfoPromise.value = _authMe()
    .then(user => {
      if (user) {
        sessionData.value = {
          username: user.username,
          userId: user.userId,
          uuid: user.uuid
        };
      } else {
        sessionData.value = null;
      }
    })
    .catch(error => {
      sessionData.value = null;
      throw error;
    });
  
  return sessionInfoPromise.value;
}
```

### Testing Strategy

1. **Test unauthenticated state**: Verify that calling `me()` when not logged in sets `sessionData.value = null` without throwing errors
2. **Test authenticated state**: Verify that calling `me()` when logged in properly sets the session data
3. **Test error handling**: Verify that GraphQL errors are still properly caught and handled

### Benefits

- Fixes runtime errors when checking authentication status
- Properly handles the valid use case of users not being logged in
- Maintains existing error handling for actual GraphQL errors
- No breaking changes to the public API of the auth store

## Implementation Notes

- This is a bug fix, not a feature change
- The solution maintains backward compatibility
- No new dependencies are required
- The fix aligns with the expected behavior described in the GraphQL schema documentation