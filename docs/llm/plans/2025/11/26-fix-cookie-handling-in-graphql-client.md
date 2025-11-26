# 26-fix-cookie-handling-in-graphql-client

## Problem Analysis

After examining the authentication setup and response headers, and researching cookie behavior extensively, I've identified the actual issues preventing cookie storage:

### Current Issues

1. **Missing Credentials Configuration**: The URQL GraphQL client is not configured to include credentials in requests, which is required for cookies to be sent and received. **This is the primary issue.**

2. **Secure Flag on HTTP**: The cookie has `Secure` flag but the app is running on HTTP (not HTTPS), which prevents cookie storage in most browsers.

3. **Localhost Domain Quirks**: The response cookie has `Domain=.dps.localhost` but some browsers have issues with localhost domain handling. Research shows that for localhost development, it's often better to omit the domain attribute entirely.

4. **Cookie Path is Correct**: The cookie has `Path=/api` which is correct for `/api/graphql` requests. Cookie path matching works as expected - `/api/graphql` starts with `/api`.

5. **Port Does NOT Affect Domain Matching**: Research confirms that ports are ignored in cookie domain matching. The port `:5000` is not causing the domain mismatch issue.

6. **CORS Configuration**: While the server allows `*` origin, proper credential handling requires specific origin configuration when using credentials.

## Solution Plan

### 1. Fix GraphQL Client Credentials Configuration (Primary Fix)

**Files to modify**: `src/lib/graphql-auth-client.ts`, `src/lib/auth-wrapper.ts`

Add `credentials: 'include'` to both GraphQL client configurations to ensure cookies are sent and received properly. This is the most critical fix.

### 2. Fix Secure Flag Conflict

**Backend changes needed** (coordinate with backend team):
- Remove `Secure` flag for HTTP development environments, OR
- Configure the frontend to run on HTTPS in development

### 3. Optimize Localhost Domain Handling

**Backend changes needed** (coordinate with backend team):
- For localhost development, consider omitting the `Domain` attribute entirely and letting the browser use the default
- If domain must be set, ensure it follows proper localhost conventions

### 4. Verify CORS Configuration

**Backend changes needed** (coordinate with backend team):
- When using `credentials: 'include'`, the server must respond with `Access-Control-Allow-Credentials: true`
- The `Access-Control-Allow-Origin` cannot be `*` when credentials are used - must specify the exact origin

### 5. Add Cookie Validation

**Files to modify**: `src/stores/auth.ts`

Add validation to ensure cookies are being properly stored after login, and provide better error handling when cookies fail to save.

### 6. Test Cookie Persistence

**Files to modify**: Add test utilities

Create a utility to check if cookies are being properly stored and accessible across requests.

## Implementation Details

### Step 1: Update GraphQL Client Configuration (Critical)

```typescript
// In both graphql-auth-client.ts and auth-wrapper.ts
fetchOptions: {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  }
}
```

### Step 2: Backend CORS and Cookie Configuration

Request backend team to update:
- CORS headers: `Access-Control-Allow-Credentials: true` and specific origin instead of `*`
- Cookie flags: Remove `Secure` flag for HTTP environments
- Domain handling: Consider omitting `Domain` attribute for localhost

### Step 3: Environment Configuration (Optional)

Add HTTPS development server configuration if you want to keep the `Secure` flag.

### Step 4: Add Cookie Validation

```typescript
// In auth store
async function validateCookieStorage(): Promise<boolean> {
  try {
    await _authMe();
    return true;
  } catch (error) {
    console.warn('Cookie validation failed - cookies may not be stored');
    return false;
  }
}
```

### Step 5: Update Login Flow

Modify the login method to validate cookie storage after successful authentication.

## Expected Outcome

After implementing these changes:
- Cookies will be properly stored by the browser after successful login
- Subsequent GraphQL requests will include the authentication cookie
- The user session will persist across page refreshes
- Cross-subdomain authentication will work correctly

## Key Insights

- **Port does not affect cookie domain matching** - the `:5000` port is not the issue
- **Missing credentials configuration is the primary blocker** - without `credentials: 'include'`, cookies won't be sent/received
- **Secure flag conflicts with HTTP** - this is a common development environment issue
- **Localhost domain handling has quirks** - sometimes omitting domain entirely works better

## Dependencies

- Backend team cooperation to adjust CORS and cookie configuration
- HTTPS development environment or backend cookie flag adjustments
- Testing across different browsers to ensure consistent cookie behavior