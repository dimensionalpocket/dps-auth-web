# Plan: update-app-vue

Summary
- Implement a minimal base layout in [`src/App.vue`](src/App.vue:1) with a top navbar, main content area, and footer using Tailwind utilities and Vue `<script setup lang="ts">`.
- Navbar and footer backgrounds span the full viewport width (full-bleed) while their inner contents are constrained and centered on large screens.
- Main content is centered both horizontally and vertically and stretches to the footer. Placeholders used for all content.

Goals
- Full-bleed navbar and footer backgrounds that span the viewport.
- Constrained (centered) inner content on large screens and full-width on mobile.
- Navbar contains left button, center title, and right login text placeholders.
- Main area vertically and horizontally centered with placeholder "Main content".
- Footer contains single centered placeholder "Footer".

Constraints / Notes
- Follow project conventions per [`docs/llm/instructions.md`](docs/llm/instructions.md:1).
- Use `<script setup lang="ts">` in `.vue` files.
- Use TailwindCSS utilities; avoid custom CSS beyond minimal necessary.
- Do not implement changes until this plan is reviewed and approved.

Files to modify/create
- Modify: [`src/App.vue`](src/App.vue:1)
- Create: [`docs/llm/plans/2025/11/16-update-app-vue.md`](docs/llm/plans/2025/11/16-update-app-vue.md:1)

Implementation steps
1. Draft a new layout in [`src/App.vue`](src/App.vue:1):
   - Top-level container: min-h-screen, flex, flex-col, subtle background (e.g., bg-slate-50).
   - Header (navbar): full-bleed background (e.g., bg-slate-100) with an inner constrained container (mx-auto max-w-4xl px-4).
   - Main: flex-1 that centers its inner constrained container both vertically and horizontally.
   - Footer: full-bleed background with constrained inner container and centered text.
2. Add placeholder texts: "Return to Site", "Account center", "Login info", "Main content", "Footer".
3. Keep implementation minimal and purely structural; do not add interactivity or hooks now.
4. After approval, implement in code, run `bun run dev` to visually verify, and iterate.

Suggested template snippet (for review; do not implement until approved)
```vue
<script setup lang="ts">
// no script logic needed for placeholders
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50">
    <!-- Navbar: full-bleed bg -->
    <header class="w-full bg-slate-100">
      <div class="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
        <div class="text-sm">Return to Site</div>
        <div class="font-semibold">Account center</div>
        <div class="text-sm">Login info</div>
      </div>
    </header>

    <!-- Main: constrained inner content centered -->
    <main class="flex-1 flex items-center justify-center px-4">
      <div class="mx-auto max-w-4xl w-full text-center">
        Main content
      </div>
    </main>

    <!-- Footer: full-bleed bg -->
    <footer class="w-full bg-slate-100">
      <div class="mx-auto max-w-4xl px-4 py-3 text-center">
        Footer
      </div>
    </footer>
  </div>
</template>
```

Verification
- Visual check in browser using `bun run dev`.
- Confirm full-bleed backgrounds for navbar/footer and constrained inner content at large widths.
- Confirm main content is vertically and horizontally centered.

Next steps after approval
- Switch to code mode and implement the layout in [`src/App.vue`](src/App.vue:1).
- Update the todo list to mark the plan complete and start implementation.
- Run the dev server and iterate as needed.

Saved plan path: [`docs/llm/plans/2025/11/16-update-app-vue.md`](docs/llm/plans/2025/11/16-update-app-vue.md:1)