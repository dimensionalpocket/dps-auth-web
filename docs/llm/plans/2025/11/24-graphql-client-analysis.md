# GraphQL Client Analysis and Recommendation

## Date: 2025-11-24@13:08

## Overview
Analysis of GraphQL client options for Vue.js project with aggressive retry requirements during backend deployments. Backend is Rust async-graphql (non-Apollo).

## Requirements
- Retry only on HTTP 502 status code (indicates app deployment/unavailability)
- Once 502 is received, retry once per second for 60 seconds
- Fail request if still receiving 502 after 60 seconds
- No retry for other errors (network, 4xx, 5xx except 502)
- Vue.js integration
- Compatible with non-Apollo GraphQL backends
- Production-ready reliability

## Options Analyzed

### 1. urql (Recommended)

**Pros:**
- Exchange-based architecture with `@urql/exchange-retry`
- Highly customizable retry logic with fine-grained control
- Native `@urql/vue` package with excellent Vue 3 Composition API support
- Reasonable bundle size (~12KB core + exchanges)
- Backend-agnostic design
- Good TypeScript support
- Active development (8.9k GitHub stars)

**Cons:**
- Exchange architecture has learning curve
- Smaller community than Apollo

**Retry Configuration:**
```typescript
import { createClient, cacheExchange, fetchExchange } from '@urql/vue'
import { retryExchange } from '@urql/exchange-retry'

const client = createClient({
  url: 'https://your-graphql-endpoint.com/graphql',
  exchanges: [
    cacheExchange,
    retryExchange({
      initialDelayMs: 1000,   // Retry once per second
      maxDelayMs: 1000,      // Keep consistent 1-second intervals
      maxNumberAttempts: 60,  // Retry for 60 seconds total
      retryIf: error => {
        // Only retry on HTTP 502 (Bad Gateway) - deployment indicator
        return error.response && error.response.status === 502
      }
    }),
    fetchExchange
  ]
})
```

### 2. Vue Apollo

**Pros:**
- Largest GraphQL client community
- Official `@vue/apollo-composable` with excellent Vue integration
- Comprehensive feature set
- Extensive documentation and resources

**Cons:**
- Larger bundle size (~50KB+)
- More complex link chain architecture
- Steeper learning curve
- Overkill for simple use cases

**Retry Configuration:**
```typescript
import { RetryLink } from '@apollo/client/link/retry'

const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 10000,
    jitter: true
  },
  attempts: {
    max: 15,
    retryIf: (error, _operation) => {
      return !!error && error.networkError !== undefined
    }
  }
})
```

### 3. Graffle (formerly graphql-request)

**Pros:**
- Smallest bundle size (~8KB)
- Simple API design
- Extension-based architecture
- Good TypeScript support

**Cons:**
- Less mature Vue integration
- Smaller community (6.1k GitHub stars)
- Fewer production battle scars
- Limited ecosystem

## Decision: urql

After careful analysis, **urql is selected** as the GraphQL client for this project due to:

1. **Precise retry control** - Exchange-based architecture allows exact 502-specific retry logic
2. **Simple retry configuration** - Clear, debuggable retry mechanism without complex link chains
3. **Excellent Vue integration** - Native `@urql/vue` with Vue 3 Composition API support
4. **Reasonable bundle size** - ~12KB core + exchanges (vs Apollo's ~50KB)
5. **Backend-agnostic** - Perfect compatibility with Rust async-graphql
6. **Production-ready** - Sufficiently mature with active development (8.9k GitHub stars)

The specific retry requirements (502-only, 1-second intervals for 60 seconds) are perfectly suited to urql's `retryExchange` configuration.

## Implementation Plan

### Files to Create/Modify:

1. **`src/lib/utils/getAuthApiUrl.ts`** - Helper function to assemble GraphQL URL from environment variables
2. **`src/lib/graphql-auth-client.ts`** - GraphQL authentication client configuration
3. **`src/lib/auth-wrapper.ts`** - Wrapper with internal methods (_authLogin, _authRegister, etc.) that hide GraphQL queries
4. **`src/stores/auth.ts`** - Update existing auth store to call wrapper methods and manage state
5. **`src/stores/site.ts`** - New site store with similar pattern
6. **`src/main.ts`** - Integrate client with Vue app
7. **`package.json`** - Add urql dependencies

### Dependencies to Add:
```bash
bun add @urql/vue @urql/exchange-retry
```

### Environment Variables to Configure:
```bash
# .env file
VITE_DPS_DOMAIN=dps.localhost
VITE_DPS_API_SUBDOMAIN=api
VITE_DPS_AUTH_API_SUBDOMAIN=auth
VITE_DPS_AUTH_API_PORT=4000
VITE_DPS_AUTH_API_PROTOCOL=http
```

### Client Configuration:
```typescript
// src/lib/utils/getAuthApiUrl.ts
/**
 * Assembles the GraphQL authentication API URL from environment variables
 * Based on docs/drafts/graphql-url-assembly.md
 */
export function getAuthApiUrl(): string {
  const protocol = import.meta.env.VITE_DPS_AUTH_API_PROTOCOL || 'http'
  const domain = import.meta.env.VITE_DPS_DOMAIN || 'localhost'
  const apiSubdomain = import.meta.env.VITE_DPS_API_SUBDOMAIN || 'api'
  const authSubdomain = import.meta.env.VITE_DPS_AUTH_API_SUBDOMAIN || 'auth'
  const port = import.meta.env.VITE_DPS_AUTH_API_PORT

  // Build subdomain structure: auth.api.dps.localhost
  const subdomain = `${authSubdomain}.${apiSubdomain}.${domain}`
  
  // Assemble URL with optional port
  const baseUrl = `${protocol}://${subdomain}`
  const portSuffix = port ? `:${port}` : ''
  
  return `${baseUrl}${portSuffix}/graphql`
}
```

```typescript
// src/lib/graphql-auth-client.ts
import { createClient, cacheExchange, fetchExchange } from '@urql/vue'
import { retryExchange } from '@urql/exchange-retry'
import { getAuthApiUrl } from './utils/getAuthApiUrl'

export const graphqlAuthClient = createClient({
  url: getAuthApiUrl(),
  exchanges: [
    cacheExchange,
    retryExchange({
      initialDelayMs: 1000,   // Retry once per second
      maxDelayMs: 1000,      // Keep consistent 1-second intervals
      maxNumberAttempts: 60,  // Retry for 60 seconds total
      retryIf: error => {
        // Only retry on HTTP 502 (Bad Gateway) - deployment indicator
        return error.response && error.response.status === 502
      }
    }),
    fetchExchange
  ],
  fetchOptions: {
    headers: {
      'Content-Type': 'application/json',
    }
  }
})
```

### App Integration:
```typescript
// src/main.ts
import { createApp } from 'vue'
import { provideClient } from '@urql/vue'
import { graphqlAuthClient } from '@/lib/graphql-auth-client'
import App from './App.vue'
import router from '@/lib/router'

const app = createApp(App)
app.use(router)
provideClient(graphqlAuthClient)
app.mount('#app')
```

### Usage in Components:
```typescript
// Example usage in LoginView.vue with auth store
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const handleLogin = async (username: string, password: string) => {
  // Store handles loading, errors, and state updates automatically
  const success = await authStore.login(username, password)
  if (success) {
    console.log('Login successful')
    // authStore.authSessionData now contains user data
  }
}

const checkAuth = async () => {
  try {
    await authStore.me()
    // authStore.authSessionData updated if user is authenticated
  } catch (error) {
    console.log('Not authenticated')
  }
}
</script>
```

```typescript
// Example usage with site store
<script setup lang="ts">
import { useSiteStore } from '@/stores/site'

const siteStore = useSiteStore()

const loadSites = async () => {
  await siteStore.fetch()
  // siteStore.sites now contains all sites
}

const addNewSite = async () => {
  try {
    const newSite = await siteStore.add('my-site', 'api', 3000, 'https')
    console.log('Site added:', newSite)
  } catch (error) {
    console.error('Failed to add site:', error)
  }
}
</script>
```

### Auth Store Integration:
```typescript
// src/stores/auth.ts - Updated methods
import { _authLogin, _authRegister, _authLogout, _authMe, _authChangePassword } from '@/lib/auth-wrapper'

// Replace placeholder authLogin method
async function login(username: string, password: string) {
  authLoading.value = true
  authLoginLastError.value = null
  
  try {
    const result = await _authLogin(username, password)
    authSessionData.value = { 
      username: result.username,
      user_id: result.user_id,
      token: result.token
    }
    return true
  } catch (error) {
    authLoginLastError.value = error.message
    return false
  } finally {
    authLoading.value = false
  }
}

// Replace placeholder authRegister method
async function register(username: string, password: string, passwordConfirm: string) {
  authLoading.value = true
  authRegisterLastError.value = null
  
  try {
    const result = await _authRegister(username, password, passwordConfirm)
    authSessionData.value = { 
      username: result.username,
      user_id: result.user_id,
      uuid: result.uuid
    }
    return true
  } catch (error) {
    authRegisterLastError.value = error.message
    return false
  } finally {
    authLoading.value = false
  }
}

// Replace placeholder authLogout method
async function logout() {
  authLoading.value = true
  
  try {
    await _authLogout()
    authSessionData.value = null
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    authLoading.value = false
  }
}

// Add new me method
async function me() {
  try {
    const user = await _authMe()
    authSessionData.value = {
      username: user.username,
      user_id: user.user_id,
      uuid: user.uuid
    }
    return user
  } catch (error) {
    authSessionData.value = null
    throw error
  }
}

// Add changePassword method
async function changePassword(currentPassword: string, newPassword: string) {
  authLoading.value = true
  
  try {
    await _authChangePassword(currentPassword, newPassword)
    return true
  } catch (error) {
    authLoginLastError.value = error.message
    return false
  } finally {
    authLoading.value = false
  }
}
```

### Site Store:
```typescript
// src/stores/site.ts - New store
import { defineStore } from "pinia";
import { ref } from "vue";
import { _sites, _addSite, _updateSite, _removeSite } from '@/lib/auth-wrapper';

export const useSiteStore = defineStore('site', () => {
  const loading = ref(false);
  const sites = ref<Site[]>([]);
  const lastError = ref<string | null>(null);

  async function fetch() {
    loading.value = true;
    lastError.value = null;
    
    try {
      sites.value = await _sites();
    } catch (error) {
      lastError.value = error.message;
    } finally {
      loading.value = false;
    }
  }

  async function add(slug: string, subdomain?: string, port?: number, protocol?: string, metadataJson?: string) {
    loading.value = true;
    lastError.value = null;
    
    try {
      const newSite = await _addSite(slug, subdomain, port, protocol, metadataJson);
      sites.value.push(newSite);
      return newSite;
    } catch (error) {
      lastError.value = error.message;
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function update(id: number, slug?: string, subdomain?: string, port?: number, protocol?: string, metadataJson?: string) {
    loading.value = true;
    lastError.value = null;
    
    try {
      const updatedSite = await _updateSite(id, slug, subdomain, port, protocol, metadataJson);
      const index = sites.value.findIndex(site => site.id === id);
      if (index !== -1) {
        sites.value[index] = updatedSite;
      }
      return updatedSite;
    } catch (error) {
      lastError.value = error.message;
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function remove(siteId: number) {
    loading.value = true;
    lastError.value = null;
    
    try {
      const removedSite = await _removeSite(siteId);
      sites.value = sites.value.filter(site => site.id !== siteId);
      return removedSite;
    } catch (error) {
      lastError.value = error.message;
      throw error;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    sites,
    lastError,
    fetch,
    add,
    update,
    remove,
  }
})
```

### Auth Wrapper Implementation:
```typescript
// src/lib/auth-wrapper.ts
import { client } from '@urql/vue'

// GraphQL query/mutation constants
const GET_SERVER_TIMESTAMP = `
  query GetServerTimestamp {
    getServerTimestamp
  }
`

const AUTH_ME = `
  query AuthMe {
    authMe {
      user_id
      uuid
      username
      role_id
      created_ts
      updated_ts
      session_iat
      session_exp
    }
  }
`

const SITES = `
  query Sites {
    sites {
      id
      slug
      subdomain
      port
      protocol
    }
  }
`

const AUTH_REGISTER = `
  mutation AuthRegister($username: String!, $password: String!, $passwordConfirmation: String!) {
    authRegister(username: $username, password: $password, passwordConfirmation: $passwordConfirmation) {
      user_id
      uuid
      username
      role_id
      created_ts
      updated_ts
      message
    }
  }
`

const AUTH_LOGIN = `
  mutation AuthLogin($username: String!, $password: String!) {
    authLogin(username: $username, password: $password) {
      token
      user_id
      username
      message
    }
  }
`

const AUTH_LOGOUT = `
  mutation AuthLogout {
    authLogout {
      message
    }
  }
`

const AUTH_CHANGE_PASSWORD = `
  mutation AuthChangePassword($currentPassword: String!, $newPassword: String!) {
    authChangePassword(currentPassword: $currentPassword, newPassword: $newPassword) {
      message
    }
  }
`

const ADD_SITE = `
  mutation AddSite($slug: String!, $subdomain: String, $port: Int, $protocol: String, $metadataJson: String) {
    addSite(slug: $slug, subdomain: $subdomain, port: $port, protocol: $protocol, metadataJson: $metadataJson) {
      id
      slug
      subdomain
      port
      protocol
      metadataJson
      created_ts
      updated_ts
    }
  }
`

const UPDATE_SITE = `
  mutation UpdateSite($id: Int!, $slug: String, $subdomain: String, $port: Int, $protocol: String, $metadataJson: String) {
    updateSite(id: $id, slug: $slug, subdomain: $subdomain, port: $port, protocol: $protocol, metadataJson: $metadataJson) {
      id
      slug
      subdomain
      port
      protocol
      metadataJson
      created_ts
      updated_ts
    }
  }
`

const REMOVE_SITE = `
  mutation RemoveSite($site_id: Int!) {
    removeSite(site_id: $site_id) {
      id
      slug
      subdomain
      port
      protocol
      metadataJson
      created_ts
      updated_ts
    }
  }
`

// Type definitions based on schema
export interface AuthMeResponse {
  user_id: number
  uuid: string
  username: string
  role_id: number
  created_ts: number
  updated_ts: number
  session_iat: number
  session_exp: number
}

export interface AuthRegisterResponse {
  user_id: number
  uuid: string
  username: string
  role_id: number
  created_ts: number
  updated_ts: number
  message: string
}

export interface AuthLoginResponse {
  token: string
  user_id: number
  username: string
  message: string
}

export interface Site {
  id: number
  slug: string
  subdomain: string
  port: number
  protocol: string
  metadataJson?: string
  created_ts: number
  updated_ts: number
}

// Internal wrapper functions (underscore prefix to avoid naming conflicts with store methods)
export async function _getServerTimestamp(): Promise<string> {
  const result = await client.query(GET_SERVER_TIMESTAMP).toPromise()
  if (result.error) throw result.error
  return result.data.getServerTimestamp
}

export async function _authMe(): Promise<AuthMeResponse> {
  const result = await client.query(AUTH_ME).toPromise()
  if (result.error) throw result.error
  return result.data.authMe
}

export async function _sites(): Promise<Site[]> {
  const result = await client.query(SITES).toPromise()
  if (result.error) throw result.error
  return result.data.sites
}

export async function _authRegister(username: string, password: string, passwordConfirmation: string): Promise<AuthRegisterResponse> {
  const result = await client.mutation(AUTH_REGISTER, { username, password, passwordConfirmation }).toPromise()
  if (result.error) throw result.error
  return result.data.authRegister
}

export async function _authLogin(username: string, password: string): Promise<AuthLoginResponse> {
  const result = await client.mutation(AUTH_LOGIN, { username, password }).toPromise()
  if (result.error) throw result.error
  return result.data.authLogin
}

export async function _authLogout(): Promise<{ message: string }> {
  const result = await client.mutation(AUTH_LOGOUT).toPromise()
  if (result.error) throw result.error
  return result.data.authLogout
}

export async function _authChangePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
  const result = await client.mutation(AUTH_CHANGE_PASSWORD, { currentPassword, newPassword }).toPromise()
  if (result.error) throw result.error
  return result.data.authChangePassword
}

export async function _addSite(slug: string, subdomain?: string, port?: number, protocol?: string, metadataJson?: string): Promise<Site> {
  const result = await client.mutation(ADD_SITE, { slug, subdomain, port, protocol, metadataJson }).toPromise()
  if (result.error) throw result.error
  return result.data.addSite
}

export async function _updateSite(id: number, slug?: string, subdomain?: string, port?: number, protocol?: string, metadataJson?: string): Promise<Site> {
  const result = await client.mutation(UPDATE_SITE, { id, slug, subdomain, port, protocol, metadataJson }).toPromise()
  if (result.error) throw result.error
  return result.data.updateSite
}

export async function _removeSite(siteId: number): Promise<Site> {
  const result = await client.mutation(REMOVE_SITE, { site_id: siteId }).toPromise()
  if (result.error) throw result.error
  return result.data.removeSite
}
```

```typescript

```

## Next Steps

1. Review and approve this plan
2. Create `getAuthApiUrl` helper function with environment variable assembly
3. Implement GraphQL authentication client configuration using the URL helper
4. Create auth wrapper with internal methods (_authLogin, _authRegister, etc.) that hide GraphQL queries
5. Update existing auth store to call wrapper methods and manage state automatically
6. Create new site store with similar pattern
7. Update existing components to use store methods instead of mock data

This setup will provide robust GraphQL communication with precise 502-specific retry behavior for deployment resilience, flexible URL configuration, and clean store APIs that automatically manage state while hiding GraphQL complexity from components.