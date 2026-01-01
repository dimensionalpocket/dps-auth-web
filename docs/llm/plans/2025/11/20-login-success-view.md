# Login success view plan

Goal
Implement a non-functional layout for the login-success route that displays "You are logged in" inside a card with two buttons: Return to Site and Account Settings.

Constraints
- Follow project Vue conventions: `<script setup lang="ts">` first, then `<template>`, omit `<style>` if empty.
- Use existing UI components: [`src/components/ui/card/Card.vue`](src/components/ui/card/Card.vue:1), [`src/components/ui/button/Button.vue`](src/components/ui/button/Button.vue:1).
- TailwindCSS for styling.

Files to modify
- [`src/views/LoginSuccessView.vue`](src/views/LoginSuccessView.vue:1) — replace placeholder content with the new layout.

Implementation notes
- Non-functional: the buttons may call router.push to named routes 'home' and 'account' as placeholders; it's acceptable if those routes don't exist.
- Keep markup minimal and accessible.

Proposed component
```vue
<script setup lang="ts">
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import CardHeader from '@/components/ui/card/CardHeader.vue';
import CardTitle from '@/components/ui/card/CardTitle.vue';
import Button from '@/components/ui/button/Button.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

function goHome() {
  router.push({ name: 'home' });
}

function goAccount() {
  router.push({ name: 'account' });
}
</script>

<template>
  <div class="w-full max-w-md">
    <Card>
      <CardHeader>
        <CardTitle>Login Successful</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="text-center py-4">
          <p class="mb-4 text-lg font-medium">You are logged in</p>
          <div class="flex gap-2 justify-center">
            <Button type="button" @click="goHome">Return to Site</Button>
            <Button type="button" @click="goAccount">Account Settings</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
```

Steps
1. Update [`src/views/LoginSuccessView.vue`](src/views/LoginSuccessView.vue:1) with the proposed component.
2. Run the dev server (bun run dev) and visually verify the layout.
3. If routes are missing, leave as non-functional placeholders; update later as needed.

Summary of changes
- One file modified: [`src/views/LoginSuccessView.vue`](src/views/LoginSuccessView.vue:1)

Approval
- If this plan is approved I will implement the change in [`src/views/LoginSuccessView.vue`](src/views/LoginSuccessView.vue:1).