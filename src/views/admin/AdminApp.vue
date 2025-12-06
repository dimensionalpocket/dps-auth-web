<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { LayoutDashboard, Users, Globe } from 'lucide-vue-next'
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

// Reactive tab value for the Tabs component
const activeTab = ref(currentTab.value)

// Watch for route changes and update the active tab
watch(currentTab, (newValue) => {
  activeTab.value = newValue
}, { immediate: true })
</script>

<template>
  <div class="w-full max-w-4xl items-start h-full p-4">
    <Card class="w-full p-4">
      <CardContent class="p-0 m-0">
        <Tabs v-model="activeTab" class="w-full">
          <TabsList class="w-full">
            <TabsTrigger value="admin-home" as-child>
              <router-link :to="{ name: 'admin-home' }" class="flex items-center gap-2">
                <LayoutDashboard class="h-4 w-4" />
                Dashboard
              </router-link>
            </TabsTrigger>
            <TabsTrigger value="admin-users" as-child>
              <router-link :to="{ name: 'admin-users' }" class="flex items-center gap-2">
                <Users class="h-4 w-4" />
                Users
              </router-link>
            </TabsTrigger>
            <TabsTrigger value="admin-sites" as-child>
              <router-link :to="{ name: 'admin-sites' }" class="flex items-center gap-2">
                <Globe class="h-4 w-4" />
                Sites
              </router-link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div class="mt-4 w-full">
          <router-view />
        </div>
      </CardContent>
    </Card>
  </div>
</template>
