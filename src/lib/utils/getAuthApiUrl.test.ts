import { describe, it, expect, beforeEach } from 'bun:test'
import { getAuthApiUrl } from './getAuthApiUrl'

describe('getAuthApiUrl', () => {
  beforeEach(() => {
    // Clear all relevant environment variables before each test
    delete process.env.VITE_DPS_AUTH_API_PROTOCOL
    delete process.env.VITE_DPS_DOMAIN
    delete process.env.VITE_DPS_AUTH_API_SUBDOMAIN
    delete process.env.VITE_DPS_AUTH_API_PORT
    delete process.env.VITE_DPS_API_PATH
  })

  it('returns correct URL when VITE_DPS_API_PATH is "api"', () => {
    process.env.VITE_DPS_API_PATH = 'api'
    const url = getAuthApiUrl()
    expect(url).toBe('http://auth.localhost/api/graphql')
  })

  it('returns correct URL when VITE_DPS_API_PATH is empty string', () => {
    process.env.VITE_DPS_API_PATH = ''
    const url = getAuthApiUrl()
    expect(url).toBe('http://auth.localhost/graphql')
  })

  it('returns correct URL when VITE_DPS_API_PATH is undefined', () => {
    const url = getAuthApiUrl()
    expect(url).toBe('http://auth.localhost/graphql')
  })

  it('returns correct URL when VITE_DPS_API_PATH contains whitespace', () => {
    process.env.VITE_DPS_API_PATH = '  api  '
    const url = getAuthApiUrl()
    expect(url).toBe('http://auth.localhost/api/graphql')
  })

  it('returns correct URL when VITE_DPS_API_PATH is "v1/api"', () => {
    process.env.VITE_DPS_API_PATH = 'v1/api'
    const url = getAuthApiUrl()
    expect(url).toBe('http://auth.localhost/v1/api/graphql')
  })

  it('returns correct URL with custom protocol and port', () => {
    process.env.VITE_DPS_AUTH_API_PROTOCOL = 'https'
    process.env.VITE_DPS_AUTH_API_PORT = '443'
    process.env.VITE_DPS_API_PATH = 'api'
    const url = getAuthApiUrl()
    expect(url).toBe('https://auth.localhost:443/api/graphql')
  })

  it('returns correct URL with custom domain', () => {
    process.env.VITE_DPS_DOMAIN = 'example.com'
    process.env.VITE_DPS_API_PATH = 'api'
    const url = getAuthApiUrl()
    expect(url).toBe('http://auth.example.com/api/graphql')
  })

  it('returns correct URL with custom auth subdomain', () => {
    process.env.VITE_DPS_AUTH_API_SUBDOMAIN = 'login'
    process.env.VITE_DPS_API_PATH = 'api'
    const url = getAuthApiUrl()
    expect(url).toBe('http://login.localhost/api/graphql')
  })
})
