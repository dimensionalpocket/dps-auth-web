<script setup lang="ts">
import { useColorMode, useTitle } from '@vueuse/core'
import LoginDropdown from './components/LoginDropdown.vue';
import Button from './components/ui/button/Button.vue';
import { ChevronLeft } from 'lucide-vue-next';

useColorMode({ initialValue: 'dark' })
useTitle('Account center') // TODO: use env variable in a future update

</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
    <!-- Navbar: full-bleed background, constrained inner content -->
    <header class="w-full bg-slate-100 dark:bg-slate-900 border-b-2 border-b-slate-500">
      <div class="mx-auto max-w-4xl px-4 py-2 flex items-center justify-between">
        <Button variant="outline" size="sm">
          <ChevronLeft />
          <span class="hidden sm:inline">Return to Site</span>
        </Button>
        <div class="font-semibold">Account Center</div>
        <LoginDropdown/>
      </div>
    </header>

    <!-- Main: expands to fill space between header and footer, centers content -->
    <main class="flex-1 flex items-center justify-center px-4">
      <div class="mx-auto max-w-4xl w-full text-center">
        <router-view/>
      </div>
    </main>

    <!-- Footer: full-bleed background, constrained inner content -->
    <footer class="w-full bg-slate-100 dark:bg-slate-900 border-t-2 border-t-slate-500 text-sm font-extralight">
      <div class="mx-auto max-w-4xl px-4 pt-2 pb-3 text-center">
        Terms of Service <b class="font-extrabold mx-3">·</b> Privacy Policy
      </div>
    </footer>
  </div>
</template>

<style>
html, body {
  font-feature-settings: "cv02","cv03","cv04","cv11","tnum";
  font-family: "InterVariable", "Inter", "system-ui";
}
</style>
