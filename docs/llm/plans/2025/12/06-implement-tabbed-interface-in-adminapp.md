# 06-implement-tabbed-interface-in-adminapp.md

## Plan: Implement Tabbed Interface in AdminApp

### Overview
Add a tabbed interface to AdminApp component with three tabs: Dashboard, Users, and Sites. The interface will be wrapped in a card component similar to LoginView.

### Prerequisites
The tabs component from Shadcn-Vue is already installed in the project at `src/components/ui/tabs/`.

### Implementation Steps

#### 1. Update AdminApp.vue
- Import necessary components: Card, CardContent, and all Tabs components
- Import useRouter from Vue Router
- Add reactive state to track active tab based on current route
- Implement tab switching logic with router navigation
- Replace the current template with a card containing the tabbed interface

#### 2. Tab Configuration
- Dashboard tab → routes to 'admin-home'
- Users tab → routes to 'admin-users' 
- Sites tab → routes to 'admin-sites'

#### 3. Layout Structure
```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Tabs from '@/components/ui/tabs/Tabs.vue'
import TabsList from '@/components/ui/tabs/TabsList.vue'
import TabsTrigger from '@/components/ui/tabs/TabsTrigger.vue'

const route = useRoute()

// Compute current tab based on route name
const currentTab = computed(() => {
  const routeName = route.name as string
  return ['admin-home', 'admin-users', 'admin-sites'].includes(routeName) ? routeName : 'admin-home'
})
</script>

<template>
  <div class="w-full max-w-4xl items-start h-full p-4">
    <Card class="w-full">
      <CardContent class="p-6">
        <Tabs :value="currentTab" class="w-full">
          <TabsList>
            <TabsTrigger value="admin-home" as-child>
              <router-link :to="{ name: 'admin-home' }">Dashboard</router-link>
            </TabsTrigger>
            <TabsTrigger value="admin-users" as-child>
              <router-link :to="{ name: 'admin-users' }">Users</router-link>
            </TabsTrigger>
            <TabsTrigger value="admin-sites" as-child>
              <router-link :to="{ name: 'admin-sites' }">Sites</router-link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div class="mt-6">
          <router-view />
        </div>
      </CardContent>
    </Card>
  </div>
</template>
```

#### 4. Script Logic
- Use computed property to determine active tab from current route
- Leverage Shadcn-Vue's `as-child` prop to wrap TabsTrigger with router-link
- Let Vue Router handle all navigation and state management
- No manual state synchronization needed - router-link handles active states automatically

### Files to Modify
- `src/views/admin/AdminApp.vue` - Complete rewrite to implement tabbed interface

### Technical Details
- Preserve the existing div wrapper with `w-full max-w-4xl items-start h-full p-4` classes
- Use full width for the tabbed interface (`w-full` class)
- Card wrapper will provide consistent styling with LoginView
- Router-view will be rendered inside the active tab content
- Tab state will sync with current route for proper navigation

### Dependencies
All required components are already available:
- Card components: `src/components/ui/card/`
- Tabs components: `src/components/ui/tabs/`
- Vue Router: already configured in the project