/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<object, object, any>;
  export default component;
}

interface ImportMetaEnv {
  readonly VITE_DPS_AUTH_API_PROTOCOL: string
  readonly VITE_DPS_DOMAIN: string
  readonly VITE_DPS_API_SUBDOMAIN: string
  readonly VITE_DPS_AUTH_API_SUBDOMAIN: string
  readonly VITE_DPS_AUTH_API_PORT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
