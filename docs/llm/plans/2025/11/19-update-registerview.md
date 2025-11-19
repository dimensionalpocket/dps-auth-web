# Plan: Update RegisterView.vue to use auth store

Objective

- Update [`src/views/RegisterView.vue`](src/views/RegisterView.vue:1) to use the auth store API and follow patterns from [`src/views/LoginView.vue`](src/views/LoginView.vue:1) and [`src/stores/auth.ts`](src/stores/auth.ts:1).

Scope

- Modify only [`src/views/RegisterView.vue`](src/views/RegisterView.vue:1).

Requirements

1. Make the form password-manager-friendly — prevent default submit and submit programmatically (like LoginView).
2. Use authRegister() from the store to create the user.
3. Add a field error element under the button showing authRegisterLastError from the store.
4. Add keydown.enter handlers on all input fields (matching LoginView).
5. Add :disabled bindings on all inputs and buttons using authLoading.
6. Add the spinner and change the button description while authLoading is true.

Implementation steps

1. Import the store and components: `useAuthStore`, `Spinner`, plus `ref` and `useRouter`.
2. Add reactive refs: `username`, `password`, `passwordConfirm`.
3. Add an async `onSubmit()` that calls `authStore.authRegister(username.value, password.value, passwordConfirm.value)`. On success call `router.replace({ name: 'home' })`. On failure do NOT clear password fields; keep user input intact and display authRegisterLastError.
4. Update the form to use `@submit.prevent` and change the submit control to `type="button"` with `@click="onSubmit"` (same pattern as LoginView).
5. Add `@keydown.enter.prevent="onSubmit"` to username, password, and confirm fields.
6. Add `:disabled="authStore.authLoading"` to all inputs and the submit button.
7. Replace the button label with a `<Spinner />` and "Creating account…" while `authStore.authLoading` is true.
8. Render `<FieldError>` beneath the button bound to `authStore.authRegisterLastError`.

Code sample (full revised component)

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
import FieldDescription from '@/components/ui/field/FieldDescription.vue';
import FieldGroup from '@/components/ui/field/FieldGroup.vue';
import FieldLabel from '@/components/ui/field/FieldLabel.vue';
import FieldError from '@/components/ui/field/FieldError.vue';
import Input from '@/components/ui/input/Input.vue';
import Spinner from '@/components/ui/spinner/Spinner.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const passwordConfirm = ref('');

async function onSubmit () {
  const ok = await authStore.authRegister(username.value, password.value, passwordConfirm.value);
  if (ok) {
    // Replace to trigger password manager save prompt
    router.replace({ name: 'home' });
  } else {
    // Do not clear password fields on failure; preserve user input and show error
  }
}
</script>

<template>
  <div class="w-full max-w-md">
    <Card>
      <CardHeader class="text-center">
        <CardTitle class="text-xl">Create your account</CardTitle>
        <CardDescription>Complete the form below to create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent>
          <FieldGroup>
            <Field>
              <FieldLabel for="username">Username</FieldLabel>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="username"
                required
                autocomplete="username"
                v-model="username"
                :disabled="authStore.authLoading"
                @keydown.enter.prevent="onSubmit"
              />
            </Field>
            <Field>
              <Field class="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel for="new-password">Password</FieldLabel>
                  <Input
                    id="new-password"
                    name="new-password"
                    type="password"
                    required
                    autocomplete="new-password"
                    v-model="password"
                    :disabled="authStore.authLoading"
                    @keydown.enter.prevent="onSubmit"
                  />
                </Field>
                <Field>
                  <FieldLabel for="confirm-password">Confirm Password</FieldLabel>
                  <Input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    required
                    autocomplete="new-password"
                    v-model="passwordConfirm"
                    :disabled="authStore.authLoading"
                    @keydown.enter.prevent="onSubmit"
                  />
                </Field>
              </Field>
            </Field>
            <Field>
              <Button :disabled="authStore.authLoading" type="button" @click="onSubmit">
                <template v-if="authStore.authLoading">
                  <Spinner class="h-4 w-4 mr-2 inline-block" />
                  Creating account…
                </template>
                <template v-else>
                  Create Account
                </template>
              </Button>
              <FieldDescription class="text-center">
                Already have an account? <a href="#">Sign in</a>
              </FieldDescription>
              <FieldError v-if="authStore.authRegisterLastError" class="mt-2 text-center">
                {{ authStore.authRegisterLastError }}
              </FieldError>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
```

Notes and rationale

- Preventing native submit and using programmatic submission mirrors [`src/views/LoginView.vue`](src/views/LoginView.vue:1) and improves password manager behavior.
- Clearing password fields on failure prevents password managers from offering to save incorrect credentials.
- `:disabled` bindings and spinner maintain consistent UX with LoginView.

Testing

- Manual test: autofill with a password manager, press Enter in fields, verify spinner and disabled states, confirm FieldError shows when passwords mismatch.

Next steps

- After plan approval, implement the changes in [`src/views/RegisterView.vue`](src/views/RegisterView.vue:1) and run the tests.

End.