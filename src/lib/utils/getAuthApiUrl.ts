/**
 * Assembles the GraphQL authentication API URL from environment variables
 */
export function getAuthApiUrl(): string {
  const protocol = import.meta.env.VITE_DPS_AUTH_API_PROTOCOL || 'http'
  const domain = import.meta.env.VITE_DPS_DOMAIN || 'localhost'
  const authSubdomain = import.meta.env.VITE_DPS_AUTH_API_SUBDOMAIN || 'auth'
  const port = import.meta.env.VITE_DPS_AUTH_API_PORT
  const apiPath = import.meta.env.VITE_DPS_API_PATH

  // Build subdomain structure: auth.dps.localhost
  const subdomain = `${authSubdomain}.${domain}`
  
  // Assemble URL with optional port
  const baseUrl = `${protocol}://${subdomain}`
  const portSuffix = port ? `:${port}` : ''
  
  // Build path: prepend "/" if apiPath exists and is not empty
  const pathPrefix = apiPath && apiPath.trim() ? `/${apiPath.trim()}` : ''
  
  return `${baseUrl}${portSuffix}${pathPrefix}/graphql`
}