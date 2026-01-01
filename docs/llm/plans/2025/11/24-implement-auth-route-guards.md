# 24-implement-auth-route-guards.md

## Overview
Implement route guards to protect authenticated routes using Vue Router's navigation guards and the existing authStore. The home route should only be accessible to authenticated users, redirecting unauthenticated users to the login route.

## Implementation Details

### Files to Modify

#### 1. `src/lib/router.ts`
- Add meta field to routes that require authentication
- Implement global navigation guard using `router.beforeEach`
- Import and use the authStore to check authentication status

#### 2. `src/stores/auth.ts` (if needed)
- Add a computed getter for checking if user is authenticated
- This will provide a clean way to check authentication status in the route guard

### Implementation Steps

#### Step 1: Add Auth Getter to Auth Store
Add a computed property `isAuthenticated` to the auth store:
```typescript
const isAuthenticated = computed(() => sessionData.value !== null)
```

#### Step 2: Update Router Configuration
Modify the routes array to include meta fields:
```typescript
const routes = [
  { 
    path: '/', 
    name: 'home', 
    component: HomeView,
    meta: { requiresAuth: true }
  },
  { path: '/login', name: 'login', component: LoginView },
  { 
    path: '/login-success', 
    name: 'login-success', 
    component: LoginSuccessView,
    meta: { requiresAuth: true }
  },
  { path: '/register', name: 'register', component: RegisterView },
]
```

#### Step 3: Implement Navigation Guard
Add a `router.beforeEach` navigation guard:
```typescript
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login page with return URL
    next({ 
      name: 'login', 
      query: { redirect: to.fullPath } 
    })
  } else {
    next()
  }
})
```

#### Step 4: Handle Redirect After Login
Update the login success logic in `LoginView.vue` to handle the redirect query parameter:
```typescript
async function onSubmit () {
  const ok = await authStore.login(username.value, password.value);
  if (ok) {
    const redirectPath = router.currentRoute.value.query.redirect as string || 'login-success'
    router.replace(redirectPath.startsWith('/') ? redirectPath : { name: redirectPath })
  } else {
    password.value = '';
  }
}
```

### Technical Considerations

#### Route Guard Logic
- The guard will check `to.meta.requiresAuth` before allowing access
- Unauthenticated users accessing protected routes will be redirected to login
- The original destination is preserved in the query parameter for post-login redirect

#### Auth State Management
- The auth store's `sessionData` serves as the source of truth for authentication
- A computed getter provides a clean boolean check for authentication status
- No additional state management is required beyond the existing auth store

#### Redirect Flow
- Users are redirected to login with the intended destination in the query
- After successful login, users are redirected to their original destination
- Falls back to 'login-success' if no redirect parameter exists

### Benefits
- Clean separation of concerns between routing and authentication logic
- Reusable pattern for future protected routes
- Preserves user experience by maintaining intended navigation flow
- Uses existing auth store without requiring additional state management