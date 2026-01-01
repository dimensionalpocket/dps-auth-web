# Implement PasswordChangeView

**Date**: 2025-11-27@12:48
**Task**: Create a password change view with authentication requirement

## Overview
Create a new `PasswordChangeView` component that allows authenticated users to change their password. The view should follow the same layout pattern as `RegisterView` and include proper form validation, loading states, and error handling.

## Implementation Details

### Files to Create/Modify

#### 1. Create `src/views/PasswordChangeView.vue`
- Follow the same layout structure as `RegisterView.vue`
- Use the same UI components (Card, Field, Input, Button, Spinner)
- Implement three form fields:
  - Current password (type="password", autocomplete="current-password")
  - New password (type="password", autocomplete="new-password") 
  - New password confirmation (type="password", autocomplete="new-password")
- Add component-level loading state management during form submission
- Display error messages using `FieldError` component
- Redirect to 'home' route on successful password change

#### 2. Modify `src/lib/router.ts`
- Add new route for password change:
  ```typescript
  { 
    path: '/password-change', 
    name: 'password-change', 
    component: PasswordChangeView,
    meta: { requiresAuth: true }
  }
  ```
- Import the new `PasswordChangeView` component

#### 3. Update `src/stores/auth.ts`
- Add `changePasswordLastError` ref to store password change specific errors
- Modify the existing `changePassword` method to use this new error state instead of `loginLastError`
- Remove loading state management from the changePassword method since loading will be handled at component level

## Code Structure

### PasswordChangeView.vue Template Structure
```vue
<template>
  <div class="w-full max-w-md">
    <Card>
      <CardHeader class="text-center">
        <CardTitle class="text-xl">Change Password</CardTitle>
        <CardDescription>
          Enter your current password and choose a new one
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent>
          <FieldGroup>
            <!-- Current Password Field -->
            <Field>
              <FieldLabel for="current-password">Current Password</FieldLabel>
              <Input
                id="current-password"
                name="current-password"
                type="password"
                required
                autocomplete="current-password"
                v-model="currentPassword"
                :disabled="loading"
                @keydown.enter.prevent="onSubmit"
              />
            </Field>
            
            <!-- New Password Fields -->
            <Field class="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel for="new-password">New Password</FieldLabel>
                <Input
                  id="new-password"
                  name="new-password"
                  type="password"
                  required
                  autocomplete="new-password"
                  v-model="newPassword"
                  :disabled="loading"
                  @keydown.enter.prevent="onSubmit"
                />
              </Field>
              <Field>
                <FieldLabel for="confirm-new-password">Confirm New Password</FieldLabel>
                <Input
                  id="confirm-new-password"
                  name="confirm-new-password"
                  type="password"
                  required
                  autocomplete="new-password"
                  v-model="newPasswordConfirm"
                  :disabled="loading"
                  @keydown.enter.prevent="onSubmit"
                />
              </Field>
            </Field>
            
            <!-- Submit Button and Error Display -->
            <Field>
              <Button :disabled="loading" type="button" @click="onSubmit">
                <template v-if="loading">
                  <Spinner class="h-4 w-4 mr-2 inline-block" />
                  Please wait…
                </template>
                <template v-else>
                  Change Password
                </template>
              </Button>
              <FieldError v-if="authStore.changePasswordLastError" class="mt-2 text-center">
                {{ authStore.changePasswordLastError }}
              </FieldError>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
```

### PasswordChangeView.vue Script Structure
```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from '@/components/ui/button/Button.vue';
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import CardDescription from '@/components/ui/card/CardDescription.vue';
import CardHeader from '@/components/ui/card/CardHeader.vue';
import CardTitle from '@/components/ui/card/CardTitle.vue';
import Field from '@/components/ui/field/Field.vue';
import FieldGroup from '@/components/ui/field/FieldGroup.vue';
import FieldLabel from '@/components/ui/field/FieldLabel.vue';
import FieldError from '@/components/ui/field/FieldError.vue';
import Input from '@/components/ui/input/Input.vue';
import Spinner from '@/components/ui/spinner/Spinner.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const loading = ref(false);
const currentPassword = ref('');
const newPassword = ref('');
const newPasswordConfirm = ref('');

async function onSubmit() {
  loading.value = true;
  const ok = await authStore.changePassword(
    currentPassword.value, 
    newPassword.value, 
    newPasswordConfirm.value
  );
  if (ok) {
    router.replace({ name: 'home' });
  } else {
    // Do not clear password fields on failure; store exposes error to display
  }
  loading.value = false;
}
</script>
```

### Auth Store Updates
Add to `src/stores/auth.ts`:
```typescript
const changePasswordLastError = ref<string | null>(null);

// In changePassword method:
catch (error: any) {
  changePasswordLastError.value = error.message || 'Password change failed';
  return false;
}

// Add to return object:
changePasswordLastError,
```

## Password Manager Compatibility
- Use proper `autocomplete` attributes:
  - `current-password` for current password field
  - `new-password` for new password fields
- Use semantic `name` attributes that match the field purposes
- Ensure proper form structure with labels

## Error Handling
- Display password change specific errors under the submit button
- Use `FieldError` component for consistent styling
- Do not clear form fields on error to allow user to retry
- Re-enable all fields when error occurs

## Loading States
- Disable all input fields and submit button during API call
- Show spinner with "Please wait…" message in button
- Use component-level `loading` ref to avoid conflicts with `authStore.loading` (reserved for session retrieval)

## Success Flow
- On successful password change, redirect to 'home' route using `router.replace()`
- This prevents back navigation to the password change form