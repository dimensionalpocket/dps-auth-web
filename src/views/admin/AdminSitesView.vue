<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
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

const router = useRouter()
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
  router.push({ name: 'admin-sites-new' })
}
</script>

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
