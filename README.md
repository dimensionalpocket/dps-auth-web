# @dimensionalpocket/dps-auth-web

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

This is the Vue app that provides the DPS authentication user interface. Consumes [DpsAuthApi](https://github.com/dimensionalpocket/dps-auth-api).

Part of the [DPS ecosystem](https://github.com/dimensionalpocket/dps-readme).

Stack: Bun, Vue 3, Vite, TailwindCSS, Pinia, Vue Router.

## Deployment

This app is fully configurable via environment variables so that you can deploy it to any CDN-backed static hosting service (e.g., Render).

The variables are prefixed with `VITE_` so that Vite can expose them to the client-side code.

| Environment Variable | Description | Default Value |
|----------------------|-------------|---------------|
| `VITE_DPS_DOMAIN` | Main domain of your website. | `dps.localhost` |
| `VITE_DPS_API_SUBDOMAIN` | Subdomain for all API services. | `api` |
| `VITE_DPS_AUTH_API_SUBDOMAIN` | Sub-subdomain for the Auth API service. | `auth` |
| `VITE_DPS_AUTH_API_PORT` | Port for the Auth API service. In development, should be set to 3000. | Not set |

## License

[MIT](LICENSE)
