# Plan: Update [`src/views/LoginView.vue`](src/views/LoginView.vue:1) to use session store

Summary

- Update the login view to authenticate using the Pinia session store.
- Prevent default form submission and use the store's sessionAuthenticate().
- Disable UI and show spinner while sessionLoading is true; display sessionLastError on failure.
- After successful authentication, redirect to the route named sign-in-success (use the route name, not the path). Read route names from [`src/lib/router.ts`](src/lib/router.ts:1).

Files to modify

- [`src/views/LoginView.vue`](src/views/LoginView.vue:1)
- [`src/stores/session.ts`](src/stores/session.ts:1)
- [`src/lib/router.ts`](src/lib/router.ts:1) (read for route names; contains name: 'sign-in-success')

Decisions

- Adapt the existing markup in [`src/views/LoginView.vue`](src/views/LoginView.vue:1); do not replace the file.
- Expose sessionLastError from [`src/stores/session.ts`](src/stores/session.ts:1).
- Redirect after successful authentication using a named route push (router.push({ name: 'sign-in-success' })).

Implementation steps

1) Store change

- Add sessionLastError to the returned object so views can read it.
- Snippet:

```ts
// src/stores/session.ts — return section
  return {
    sessionLoading,
    sessionData,
    sessionLastError,
    sessionAuthenticate,
    sessionLogout,
  }
```

2) LoginView changes (adapt existing file)

- Import ref from 'vue', Spinner component, and useSessionStore from the session store.
- Use useRouter() from 'vue-router' (or import the exported router) to perform a named push on success.
- Add username and password refs and bind them to the Input components with v-model.
- Add an async onSubmit() that calls sessionStore.sessionAuthenticate and checks its boolean return value.
- Add @submit.prevent to the <form> so it does not submit like a normal HTML form.
- Disable inputs and buttons while sessionStore.sessionLoading is true using :disabled.
- Show Spinner in the button and change its label to "Logging in…" when sessionStore.sessionLoading is true.
- Display sessionStore.sessionLastError via FieldError under the button when present.

3) Post-success redirect (new required step)

- Read the route definitions in [`src/lib/router.ts`](src/lib/router.ts:1) — the file defines a route with name 'sign-in-success'.
- When sessionAuthenticate returns true, redirect to that route using the route name: router.push({ name: 'sign-in-success' }).
- Use useRouter() inside the component (recommended) or import the exported router from [`src/lib/router.ts`](src/lib/router.ts:1).

Example onSubmit snippet

```ts
import { useRouter } from 'vue-router';
const router = useRouter();
async function onSubmit () {
  const ok = await sessionStore.sessionAuthenticate(username.value, password.value);
  if (ok) {
    router.push({ name: 'sign-in-success' });
  }
}
```

Example component fragments (keep existing structure; integrate these fragments)

```ts
<script setup lang="ts">
import { ref } from 'vue';
import Spinner from '@/components/ui/spinner/Spinner.vue';
import { useSessionStore } from '@/stores/session';
import { useRouter } from 'vue-router';

const sessionStore = useSessionStore();
const router = useRouter();
const username = ref('');
const password = ref('');

async function onSubmit () {
  const ok = await sessionStore.sessionAuthenticate(username.value, password.value);
  if (ok) router.push({ name: 'sign-in-success' });
}
</script>
```

```vue
<template>
  <form @submit.prevent="onSubmit">
    <!-- username -->
    <Input id="username" v-model="username" name="username" ... />
    <!-- password -->
    <Input id="password" v-model="password" name="password" type="password" ... />

    <Button :disabled="sessionStore.sessionLoading" type="submit">
      <Spinner v-if="sessionStore.sessionLoading" class="h-4 w-4 mr-2" />
      <span v-if="sessionStore.sessionLoading">Logging in…</span>
      <span v-else>Login</span>
    </Button>

    <FieldError v-if="sessionStore.sessionLastError">{{ sessionStore.sessionLastError }}</FieldError>
  </form>
</template>
```

Testing

- Correct credentials (user/pass): verify spinner appears, authentication completes, and the app navigates to the named route sign-in-success.
- Incorrect credentials: verify error message from sessionLastError appears and inputs/buttons re-enable.
- Confirm the form does not cause a full-page reload on submit.

Next steps

- After you approve this updated plan I will implement:
  - the small store export change,
  - the edits to [`src/views/LoginView.vue`](src/views/LoginView.vue:1) (bindings, submit handler, spinner, error, redirect),
  - update the todo list statuses accordingly.