# 06-implement-admin-sites-view.md

## Overview
Update the existing AdminSitesView component to display a table of sites from the existing site store with edit and delete action buttons.

## Implementation Details

### Files to Modify

#### 1. Update `src/views/admin/AdminSitesView.vue`
- Replace the existing placeholder content with a proper Vue component using composition API with `<script setup lang="ts">`
- Import and use the existing site store to get the `sites` array
- Display sites in a simple table using existing Shadcn table components
- Add edit and delete buttons for each site (buttons will be non-functional for now)

### Component Structure

#### Script Section
```typescript
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSiteStore } from '@/stores/site'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const siteStore = useSiteStore()
const { sites, loading } = storeToRefs(siteStore)

const handleEditSite = (siteId: number) => {
  // TODO: Implement edit functionality
  console.log('Edit site:', siteId)
}

const handleDeleteSite = (siteId: number) => {
  // TODO: Implement delete functionality
  console.log('Delete site:', siteId)
}

const handleAddSite = () => {
  // TODO: Implement add site functionality
  console.log('Add site')
}
</script>
```

#### Template Section
```vue
<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Sites</h1>
      <Button @click="handleAddSite">Add Site</Button>
    </div>
    
    <div v-if="loading" class="text-center py-8">
      Loading sites...
    </div>
    
    <Table v-else>
      <TableHeader>
        <TableRow>
          <TableHead>Slug</TableHead>
          <TableHead>Subdomain</TableHead>
          <TableHead>Port</TableHead>
          <TableHead>Protocol</TableHead>
          <TableHead class="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="site in sites" :key="site.id">
          <TableCell class="font-medium">{{ site.slug }}</TableCell>
          <TableCell>{{ site.subdomain }}</TableCell>
          <TableCell>{{ site.port }}</TableCell>
          <TableCell>{{ site.protocol }}</TableCell>
          <TableCell class="text-right">
            <div class="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                @click="handleEditSite(site.id)"
              >
                Edit
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                @click="handleDeleteSite(site.id)"
              >
                Delete
              </Button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    
    <div v-if="!loading && sites.length === 0" class="text-center py-8 text-gray-500">
      No sites found. Click "Add Site" to create your first site.
    </div>
  </div>
</template>
```

### Dependencies
- All required components already exist in the project:
  - Table components from `@/components/ui/table`
  - Button component from `@/components/ui/button`
  - Site store from `@/stores/site`

### Notes
- The site store automatically fetches sites on initialization, so no manual fetch needed
- Site interface has: `id: number`, `slug: string`, `subdomain: string`, `port: number`, `protocol: string`, `metadataJson?: string`, `createdTs: number`, `updatedTs: number`
- Table only displays: slug, subdomain, port, protocol (excludes metadataJson, createdTs, updatedTs)
- Edit and delete functions accept `number` type for site ID (matching the Site interface)
- Component handles loading state from the store
- The "Add Site" button has a placeholder handler that logs to console
- Uses TailwindCSS for styling with existing design patterns
- No pagination or filtering needed as the site list is small (< 10 items)