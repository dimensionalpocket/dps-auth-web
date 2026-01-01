# Implement Logout Functionality

## Current State Analysis
- HomeView has a "Log out" button with empty `handleLogout()` function
- Auth store has a complete `logout()` method that calls `_authLogout()` and clears session data
- Router has auth guards that redirect unauthenticated users to login

## Implementation Options

### Option 1: Direct Logout (Recommended)
- Call `authStore.logout()` directly from HomeView
- Redirect to login page after successful logout
- No additional view needed
- Pros: Simple, fast, follows common UX patterns
- Cons: No confirmation dialog

### Option 2: Confirmation Dialog
- Show a confirmation modal before logging out
- Use existing UI components (Card, Button) to create modal
- Pros: Prevents accidental logouts
- Cons: More complex, additional state management

### Option 3: Dedicated Logout View
- Create `/logout` route that handles logout and redirects
- Pros: Clean separation of concerns
- Cons: Unnecessary navigation step, poor UX

## Recommended Implementation (Option 1)

### Files to Modify
1. `src/views/HomeView.vue` - Implement `handleLogout()` function and add loading state
2. `src/stores/auth.ts` - Verify logout method properly sets loading state

### Implementation Details

#### HomeView.vue Updates
```typescript
// In HomeView.vue
async function handleLogout() {
  await authStore.logout();
  router.push({ name: 'login' });
}
```

#### Button Loading State
```vue
<template>
  <div class="flex flex-col sm:flex-row gap-2">
    <Button 
      @click="handleChangePassword" 
      class="flex-1"
      :disabled="authStore.loading"
    >
      Change password
    </Button>
    <Button 
      variant="destructive" 
      @click="handleLogout" 
      class="flex-1"
      :disabled="authStore.loading"
    >
      <Spinner v-if="authStore.loading" class="w-4 h-4 mr-2" />
      {{ authStore.loading ? 'Logging out...' : 'Log out' }}
    </Button>
  </div>
</template>
```

#### Auth Store Verification
The logout method already properly sets loading state:
- Sets `loading.value = true` at start
- Sets `loading.value = false` in finally block
- This ensures loading state is always cleared, even on errors

### Additional Enhancements (Optional)
- Show toast/notification on successful logout
- Handle logout errors more gracefully (currently just logs to console)

## Rationale
Direct logout is the most common pattern in modern web apps. Users expect logout to be immediate, and the auth store already handles the backend communication and session cleanup. The router guards will automatically handle redirecting to login if the user tries to access protected routes after logout.

## Testing Steps
1. Click logout button
2. Verify user is redirected to login page
3. Verify accessing protected routes redirects to login
4. Verify login works after logout
5. Verify buttons are disabled during logout process
6. Verify loading spinner appears on logout button
7. Verify loading state is cleared after logout completes (success or error)