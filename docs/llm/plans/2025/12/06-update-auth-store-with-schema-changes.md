# 06-update-auth-store-with-schema-changes.md

## Analysis

After comparing the current auth store implementation with the latest backend GraphQL schema, I've identified several missing fields and inconsistencies that need to be addressed:

### Current Issues Found:

1. **Missing role information**: The backend schema returns `roleId` and `roleName` in `authMe`, `authRegister`, and other user-related operations, but the auth store doesn't store or handle these fields.



3. **Inconsistent session data structure**: The `sessionData` object in the store has an inconsistent structure - sometimes includes `token`, sometimes includes `uuid`, but doesn't include the role information.

4. **Unnecessary token storage**: The `token` field is returned by `authLogin` but the frontend relies on cookies for authentication, making token storage redundant.

5. **Incomplete type safety**: The session data type definition doesn't match the complete backend response structure.

## Implementation Plan

### Files to Modify:

1. **`src/stores/auth.ts`** - Main auth store implementation
2. **`src/lib/auth-wrapper.ts`** - Update GraphQL queries to only request needed fields

### Changes Required:

#### 1. Update Session Data Type Definition
- Extend the `sessionData` type to include role fields returned by `authMe`
- Add `roleId`, `roleName`
- Remove `token` field entirely since frontend uses cookies for authentication
- Note: User timestamps (`createdTs`, `updatedTs`) and session expiration (`sessionIat`, `sessionExp`) are not needed in the frontend

#### 2. Update Login Method
- Remove token storage from login response (authLogin only returns token, userId, username, message)
- Call `me()` after successful login to get complete user data including role information and uuid
- Store only the complete user profile data from `me()`, not the limited login response

#### 3. Update Register Method  
- Store `roleId` from registration response
- Handle the complete user profile returned by registration

#### 4. Update `me()` Method
- Store relevant fields returned by `authMe` query
- Ensure session data includes role information

#### 5. Update GraphQL Queries in auth-wrapper.ts
- Update `AUTH_ME` query to request only: `userId`, `uuid`, `username`, `roleId`, `roleName`
- Update `AUTH_REGISTER` query to request only: `userId`, `uuid`, `username`, `roleId`, `message`
- Remove unnecessary fields: `createdTs`, `updatedTs`, `sessionIat`, `sessionExp`
- Update TypeScript interfaces to match the simplified query responses







### Updated Session Data Type:

```typescript
interface SessionData {
  username: string
  userId: number
  uuid: string
  roleId: number
  roleName: string
}
```

### Benefits of These Changes:

1. **Complete User Profile**: Store all available user information from the backend
2. **Role-Based Access Control**: Components can access `sessionData.roleName` and `sessionData.roleId` when needed
3. **Cleaner Authentication**: Remove unnecessary token storage since cookies are used for authentication
4. **Type Safety**: Improved TypeScript support with complete type definitions
5. **Future-Proof**: Ready for admin features that require role-based permissions

### Testing Considerations:

- Verify login stores complete user profile
- Verify registration stores role information
- Verify `me()` method updates role information
- Verify GraphQL queries only request needed fields
- Ensure all session fields are properly stored
- Ensure backward compatibility with existing components using the store

### No Breaking Changes Expected:

- Existing properties (`username`, `userId`, `isAuthenticated`) remain unchanged
- New properties are additive only
- Existing method signatures remain the same
- Token removal is internal only - no external components use the token