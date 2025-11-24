- `VITE_DPS_DOMAIN` (Base domain, e.g., "dps.localhost"), 
- `VITE_DPS_API_SUBDOMAIN` (general API subdomain, e.g.,: "api"), 
- `VITE_DPS_AUTH_API_SUBDOMAIN` (sub-subdomain for the auth backend, e.g., 'auth'), 
- `VITE_DPS_AUTH_API_PORT` (can be left empty for default ports), 
- `VITE_DPS_AUTH_API_PROTOCOL` (string, http or https). 

Assemble the full URL based on these variables, e.g., "https://auth.api.dps.localhost:3000". If port is not defined, omit it from the URL. 

Also expose all of those variables via the vite config.
