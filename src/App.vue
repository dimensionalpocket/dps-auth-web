<script setup lang="ts">
import { useColorMode } from '@vueuse/core'

useColorMode({ initialValue: 'dark' })
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
    <!-- Navbar: full-bleed background, constrained inner content -->
    <header class="w-full bg-slate-100 dark:bg-slate-800">
      <div class="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
        <div class="text-sm">Return to Site</div>
        <div class="font-semibold">Account center</div>
        <div class="text-sm">Login info</div>
      </div>
    </header>

    <!-- Main: expands to fill space between header and footer, centers content -->
    <main class="flex-1 flex items-center justify-center px-4">
      <div class="mx-auto max-w-4xl w-full text-center">
        Main content
      </div>
    </main>

    <!-- Footer: full-bleed background, constrained inner content -->
    <footer class="w-full bg-slate-100 dark:bg-slate-800">
      <div class="mx-auto max-w-4xl px-4 py-3 text-center">
        Footer
      </div>
    </footer>
  </div>
</template>
