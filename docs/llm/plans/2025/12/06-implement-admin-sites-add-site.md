# 06-implement-admin-sites-add-site.md

## Overview
Implement the Add Site functionality for the Admin panel, including a new route, view component, form handling with error display, and cache optimization for the sites list.

## Implementation Details

### 1. Update Router Configuration
**File**: `src/lib/router.ts`
- Add import for `AdminSitesNewView` (to be created)
- Add new child route to the admin routes array:
  ```typescript
  {
    path: 'sites/new',
    name: 'admin-sites-new',
    component: AdminSitesNewView,
  }
  ```

### 2. Create AdminSitesNewView Component
**File**: `src/views/admin/AdminSitesNewView.vue`
- Create new Vue component with form for adding a site
- Use composition API with `<script setup lang="ts">`
- Import necessary UI components (Button, Card, Field components, Input, Spinner)
- Import and use site store and router
- Form fields:
  - Slug (required)
  - Subdomain (optional)
  - Port (optional, number)
  - Protocol (optional, string)
- Handle form submission:
  - Call `siteStore.add()` method with form values (excluding metadata)
  - On success: call `siteStore.fetch()` then redirect to `admin-sites` route
  - On error: display error using FieldError component (similar to LoginView)
- Loading state with spinner during submission
- Cancel button to return to sites list

**Code Preview**:
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useSiteStore } from '@/stores/site'
import { Button } from '@/components/ui/button'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import Field from '@/components/ui/field/Field.vue'
import FieldGroup from '@/components/ui/field/FieldGroup.vue'
import FieldLabel from '@/components/ui/field/FieldLabel.vue'
import FieldError from '@/components/ui/field/FieldError.vue'
import Input from '@/components/ui/input/Input.vue'
import Spinner from '@/components/ui/spinner/Spinner.vue'

const router = useRouter()
const siteStore = useSiteStore()
const { loading } = storeToRefs(siteStore)

const slug = ref('')
const subdomain = ref('')
const port = ref<number | undefined>(undefined)
const protocol = ref('')

async function onSubmit() {
  try {
    await siteStore.add(
      slug.value,
      subdomain.value || undefined,
      port.value,
      protocol.value || undefined
    )
    await siteStore.fetch()
    router.push({ name: 'admin-sites' })
  } catch (error) {
    // Error is handled by the store and displayed via FieldError
  }
}

function onCancel() {
  router.push({ name: 'admin-sites' })
}
</script>

<template>
  <div class="w-full">
    <Card>
      <CardHeader>
        <CardTitle>Add New Site</CardTitle>
        <CardDescription>
          Enter the site details below to create a new site
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent>
          <FieldGroup>
            <Field>
              <FieldLabel for="slug">
                Slug *
              </FieldLabel>
              <Input
                id="slug"
                name="slug"
                type="text"
                placeholder="site-slug"
                required
                v-model="slug"
                :disabled="loading"
                @keydown.enter.prevent="onSubmit"
              />
            </Field>
            <Field>
              <FieldLabel for="subdomain">
                Subdomain
              </FieldLabel>
              <Input
                id="subdomain"
                name="subdomain"
                type="text"
                placeholder="subdomain"
                v-model="subdomain"
                :disabled="loading"
                @keydown.enter.prevent="onSubmit"
              />
            </Field>
            <Field>
              <FieldLabel for="port">
                Port
              </FieldLabel>
              <Input
                id="port"
                name="port"
                type="number"
                placeholder="8080"
                v-model.number="port"
                :disabled="loading"
                @keydown.enter.prevent="onSubmit"
              />
            </Field>
            <Field>
              <FieldLabel for="protocol">
                Protocol
              </FieldLabel>
              <Input
                id="protocol"
                name="protocol"
                type="text"
                placeholder="https"
                v-model="protocol"
                :disabled="loading"
                @keydown.enter.prevent="onSubmit"
              />
            </Field>
            <Field>
              <div class="flex gap-2">
                <Button :disabled="loading" type="button" @click="onSubmit">
                  <template v-if="loading">
                    <Spinner class="h-4 w-4 mr-2 inline-block" />
                    Adding Site…
                  </template>
                  <template v-else>
                    Add Site
                  </template>
                </Button>
                <Button variant="outline" type="button" @click="onCancel" :disabled="loading">
                  Cancel
                </Button>
              </div>
              <FieldError v-if="siteStore.lastError" class="mt-2">
                {{ siteStore.lastError }}
              </FieldError>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
```

### 3. Update AdminSitesView Button
**File**: `src/views/admin/AdminSitesView.vue`
- Update `handleAddSite()` function to navigate to new route:
  ```typescript
  const handleAddSite = () => {
    router.push({ name: 'admin-sites-new' })
  }
  ```
- Add `useRouter` import and router instance

### 4. Update Sites Query Cache Policy
**File**: `src/lib/auth-wrapper.ts`
- Modify `_sites()` function to use `requestPolicy: 'network-only'` (similar to `_authMe`):
  ```typescript
  export async function _sites(): Promise<Site[]> {
    const result = await client.query(SITES, {}, { requestPolicy: 'network-only' }).toPromise()
    if (result.error) throw result.error
    return result.data.sites
  }
  ```

### 5. Form Validation and Error Handling
- Use reactive refs for form fields
- Implement basic validation (required slug field)
- Display validation errors and API errors using FieldError component
- Clear form on successful submission
- Handle loading states appropriately

## Files to Modify/Create
1. `src/lib/router.ts` - Add new route
2. `src/views/admin/AdminSitesNewView.vue` - Create new view component
3. `src/views/admin/AdminSitesView.vue` - Update button navigation
4. `src/lib/auth-wrapper.ts` - Update cache policy for sites query

## Dependencies
No new packages required. All necessary UI components and stores are already available in the project.

## Testing Considerations
- Test form submission with valid data
- Test error handling with invalid data
- Test redirect after successful site creation
- Verify new site appears in sites list after creation
- Test loading states during form submission