# Building a Vue 3 Library with Ship-Source-Code Approach

(This is just a research doc, not part of the dps-auth-web project)

This guide explains how to create a Vue 3 library that ships source code directly (no compilation step). The consumer installs your library and their build tool compiles everything together.

## Overview

- **Your library**: Provides a custom `createApp` wrapper with a pre-built Vue 3 app
- **Consumer's code**: Minimal - just install, configure, and run
- **Build tool**: Bun with Vite
- **Distribution**: Ship uncompiled source code directly

---

## Your Library Setup

### Project Structure

```
your-library/
├── src/
│   ├── index.ts                    # Main entry point
│   ├── PrebuiltApp.vue             # Your complete app component
│   ├── components/
│   │   ├── Sidebar.vue
│   │   ├── MainContent.vue
│   │   └── Footer.vue
│   ├── plugins/
│   │   └── my-plugin.ts
│   ├── composables/
│   │   └── useAppConfig.ts
│   └── styles/
│       └── main.css
├── package.json
├── tsconfig.json
├── bunfig.toml                     # Optional Bun config
└── README.md
```

### package.json

```json
{
  "name": "your-library-name",
  "version": "1.0.0",
  "type": "module",
  "description": "A pre-built Vue 3 app with custom createApp wrapper",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./style.css": "./src/styles/main.css"
  },
  "files": [
    "src",
    "README.md"
  ],
  "peerDependencies": {
    "vue": "^3.4.0"
  },
  "author": "Your Name",
  "license": "MIT"
}
```

### src/index.ts

```typescript
import { createApp as vueCreateApp, App } from 'vue'
import PrebuiltApp from './PrebuiltApp.vue'
import MyPlugin from './plugins/my-plugin'
import type { AppOptions } from './types'

export function createApp(options?: AppOptions): App {
  const app = vueCreateApp(PrebuiltApp)

  // Install your custom plugin
  app.use(MyPlugin, options)

  // Provide configuration globally
  app.provide('appConfig', options || {})

  // Configure error handling
  app.config.errorHandler = (err, instance, info) => {
    console.error('App Error:', err, info)
    // Add your custom error handling logic
  }

  return app
}

// Export types and utilities
export type { AppOptions }
export { default as PrebuiltApp } from './PrebuiltApp.vue'
```

### src/types.ts

```typescript
export interface AppOptions {
  theme?: 'light' | 'dark'
  apiBaseUrl?: string
  enableAnalytics?: boolean
  customData?: Record<string, any>
}
```

### src/PrebuiltApp.vue

```vue
<template>
  <div :class="`app-container theme-${config.theme || 'light'}`">
    <Sidebar />
    <main class="main-content">
      <MainContent />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import Sidebar from './components/Sidebar.vue'
import MainContent from './components/MainContent.vue'
import Footer from './components/Footer.vue'
import type { AppOptions } from './types'

const config = inject<AppOptions>('appConfig', {})
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.theme-light {
  background-color: #ffffff;
  color: #000000;
}

.theme-dark {
  background-color: #1a1a1a;
  color: #ffffff;
}

.main-content {
  flex: 1;
}
</style>
```

### src/plugins/my-plugin.ts

```typescript
import type { App } from 'vue'
import type { AppOptions } from '../types'

export default {
  install(app: App, options?: AppOptions) {
    // Add global properties
    app.config.globalProperties.$api = {
      baseUrl: options?.apiBaseUrl || 'https://api.example.com',
      get: async (endpoint: string) => {
        const response = await fetch(`${options?.apiBaseUrl}${endpoint}`)
        return response.json()
      }
    }

    // Add custom directives
    app.directive('focus', {
      mounted(el) {
        el.focus()
      }
    })

    // Register global components if needed
    // app.component('GlobalButton', GlobalButton)
  }
}
```

### src/composables/useAppConfig.ts

```typescript
import { inject } from 'vue'
import type { AppOptions } from '../types'

export function useAppConfig() {
  const config = inject<AppOptions>('appConfig', {})
  
  return {
    config,
    theme: config.theme || 'light',
    apiBaseUrl: config.apiBaseUrl || '',
    isAnalyticsEnabled: config.enableAnalytics || false
  }
}
```

### src/styles/main.css

```css
/* Your global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}

/* Add more global styles */
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*.ts", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Publishing Your Library

```bash
# No build step needed!
bun publish
```

---

## Consumer's Project Setup

### Project Structure

```
consumer-project/
├── src/
│   └── main.ts                     # Entry point - minimal code!
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### package.json

```json
{
  "name": "consumer-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "your-library-name": "^1.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "vue-tsc": "^2.0.0"
  }
}
```

### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Standard Vite config - compiles your library's source code automatically
export default defineConfig({
  plugins: [vue()]
})
```

### src/main.ts

```typescript
import { createApp } from 'your-library-name'
import 'your-library-name/style.css'

// That's all the consumer needs to write!
const app = createApp({
  theme: 'dark',
  apiBaseUrl: 'https://api.example.com',
  enableAnalytics: true,
  customData: {
    appName: 'My Awesome App',
    version: '1.0.0'
  }
})

app.mount('#app')
```

### index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

### Consumer's Build Commands

```bash
# Install dependencies
bun install

# Development server
bun run dev

# Production build
bun run build

# Preview production build
bun run preview
```

---

## How It Works

1. **Your library** ships uncompiled `.vue` and `.ts` files
2. **Consumer installs** your library via `bun install your-library-name`
3. **Consumer's Vite** processes and compiles:
   - Your library's Vue components (`.vue` files)
   - Your library's TypeScript (`.ts` files)
   - Consumer's own code
4. **Everything is bundled** together into the final application

---

## Benefits of This Approach

- **No build step for you** - just publish source code
- **Better tree-shaking** - consumer's bundler removes unused code
- **Easier debugging** - source maps point to actual source code
- **Full optimization control** - consumer's build tool handles everything
- **Simple workflow** - fewer moving parts

---

## Advanced: Allow Consumer Customization

If you want to let consumers override parts of your app:

### src/index.ts (Enhanced)

```typescript
import { createApp as vueCreateApp, App, Component } from 'vue'
import PrebuiltApp from './PrebuiltApp.vue'
import MyPlugin from './plugins/my-plugin'
import type { AppOptions } from './types'

export interface ExtendedAppOptions extends AppOptions {
  // Allow custom root component
  rootComponent?: Component
  // Allow additional plugins
  plugins?: any[]
  // Allow additional global components
  components?: Record<string, Component>
}

export function createApp(options?: ExtendedAppOptions): App {
  // Use custom root component if provided, otherwise use default
  const rootComponent = options?.rootComponent || PrebuiltApp
  const app = vueCreateApp(rootComponent)

  app.use(MyPlugin, options)
  app.provide('appConfig', options || {})

  // Install additional plugins if provided
  options?.plugins?.forEach(plugin => {
    app.use(plugin)
  })

  // Register additional components if provided
  if (options?.components) {
    Object.entries(options.components).forEach(([name, component]) => {
      app.component(name, component)
    })
  }

  return app
}
```

### Consumer Usage (Advanced)

```typescript
import { createApp } from 'your-library-name'
import CustomComponent from './CustomComponent.vue'
import myPlugin from './my-plugin'

const app = createApp({
  theme: 'dark',
  apiBaseUrl: 'https://api.example.com',
  plugins: [myPlugin],
  components: {
    'custom-component': CustomComponent
  }
})

app.mount('#app')
```

---

## Summary

- **Your library**: Publish source code directly (no compilation)
- **Consumer**: Use standard Vite + Vue setup with Bun
- **Result**: Consumer gets your complete app with minimal configuration
