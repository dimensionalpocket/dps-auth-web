/**
 * Assembles the GraphQL authentication API URL from environment variables
 * Based on docs/drafts/graphql-url-assembly.md
 */
export function getAuthApiUrl(): string {
  const protocol = import.meta.env.VITE_DPS_AUTH_API_PROTOCOL || 'http'
  const domain = import.meta.env.VITE_DPS_DOMAIN || 'localhost'
  const apiSubdomain = import.meta.env.VITE_DPS_API_SUBDOMAIN || 'api'
  const authSubdomain = import.meta.env.VITE_DPS_AUTH_API_SUBDOMAIN || 'auth'
  const port = import.meta.env.VITE_DPS_AUTH_API_PORT

  // Build subdomain structure: auth.api.dps.localhost
  const subdomain = `${authSubdomain}.${apiSubdomain}.${domain}`
  
  // Assemble URL with optional port
  const baseUrl = `${protocol}://${subdomain}`
  const portSuffix = port ? `:${port}` : ''
  
  return `${baseUrl}${portSuffix}/graphql`
}