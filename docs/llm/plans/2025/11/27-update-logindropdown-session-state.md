# 27-update-logindropdown-session-state.md

## Plan: Update LoginDropdown to Check Session State

### Current Issues
- LoginDropdown uses hardcoded `v-if="true"` placeholder for not-signed-in state
- Logged-in state shows hardcoded "Username" instead of actual username from auth store
- Component doesn't react to authentication state changes

### Implementation Details

#### Files to Modify
- `src/components/LoginDropdown.vue`

#### Changes Required

1. **Import auth store**
   - Add import for `useAuthStore` from `@/stores/auth`

2. **Use auth store in component**
   - Initialize auth store using `useAuthStore()`
   - Use `isAuthenticated` computed property to determine login state
   - Access `sessionData.username` for displaying username

3. **Update template logic**
   - Replace `v-if="true"` with `v-if="!authStore.isAuthenticated"`
   - Replace `v-else` with `v-if="authStore.isAuthenticated"`
   - Replace hardcoded "Username" with `{{ authStore.sessionData?.username }}`

4. **Implement logout functionality**
   - Add logout handler function that calls `authStore.logout()` and redirects to login page
   - Follow pattern from HomeView: `await authStore.logout(); router.push({ name: 'login' })`
   - Add loading state to logout button: `:disabled="authStore.loading"`
   - Show spinner and "Logging out..." text when loading

5. **Add loading state indicator**
   - Add loading spinner that replaces entire component content when `authStore.loading` is true
   - Use existing Spinner component with "Loading..." text
   - Loading state should be top-level condition, taking precedence over auth states
   - Prevents user interaction during login/logout transitions

6. **Handle loading state (optional enhancement)**
   - Consider additional loading indicators if needed

#### Code Changes

**Script section additions:**
```typescript
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import Spinner from '@/components/ui/spinner/Spinner.vue'

const authStore = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'login' })
}
```

**Template changes:**
```vue
<!-- Replace line 16 -->
<div v-if="!authStore.isAuthenticated" class="text-right leading-none">

<!-- Replace line 24 -->
<ButtonGroup v-if="authStore.isAuthenticated">

<!-- Replace line 27 -->
<span class="hidden sm:inline">{{ authStore.sessionData?.username }}</span>
```

**Logout dropdown item update:**
```vue
<!-- Replace lines 64-67 -->
<DropdownMenuItem variant="destructive" @click="handleLogout" :disabled="authStore.loading">
  <Spinner v-if="authStore.loading" class="w-4 h-4 mr-2" />
  <LogOut/>
  {{ authStore.loading ? 'Logging out...' : 'Log out' }}
</DropdownMenuItem>
```

**Loading state wrapper:**
```vue
<!-- Replace entire template content (lines 15-72) -->
<template>
  <div>
    <!-- Loading state -->
    <div v-if="authStore.loading" class="text-right">
      <Spinner class="w-4 h-4 inline mr-2" />
      <span class="text-sm text-muted-foreground">Loading...</span>
    </div>
    
    <!-- Normal states -->
    <div v-else>
      <div v-if="!authStore.isAuthenticated" class="text-right leading-none">
        <span class="text-xs text-muted-foreground">Not logged in</span><br/>
        <span class="text-muted-foreground">
          <router-link :to="{ name: 'login' }" class="hover:underline text-primary">Login</router-link>
          or
          <router-link :to="{ name: 'register' }" class="hover:underline text-primary">Sign up</router-link>
        </span>
      </div>
      <ButtonGroup v-else>
        <Button variant="outline">
          <UserCog/>
          <span class="hidden sm:inline">{{ authStore.sessionData?.username }}</span>
        </Button>
        <!-- rest of dropdown content -->
      </ButtonGroup>
    </div>
  </div>
</template>
```

### Notes
- The auth store automatically initializes session checking on creation
- `isAuthenticated` computed property will react to session changes
- `sessionData?.username` safely handles null case with optional chaining
- No additional packages needed - uses existing Pinia store