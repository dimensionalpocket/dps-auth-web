import { createClient, cacheExchange, fetchExchange } from '@urql/core'
import { retryExchange } from '@urql/exchange-retry'
import { getAuthApiUrl } from './utils/getAuthApiUrl'

const client = createClient({
  url: getAuthApiUrl(),
  exchanges: [
    cacheExchange,
    retryExchange({
      initialDelayMs: 1000,   // Retry once per second
      maxDelayMs: 1000,      // Keep consistent 1-second intervals
      maxNumberAttempts: 60,  // Retry for 60 seconds total
      retryIf: error => {
        // Only retry on HTTP 502 (Bad Gateway) - deployment indicator
        return error.response && error.response.status === 502
      }
    }),
    fetchExchange
  ],
  fetchOptions: {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  }
})

// GraphQL query/mutation constants
const GET_SERVER_TIMESTAMP = `
  query GetServerTimestamp {
    getServerTimestamp
  }
`

const AUTH_ME = `
  query AuthMe {
    authMe {
      userId
      uuid
      username
      roleId
      createdTs
      updatedTs
      sessionIat
      sessionExp
    }
  }
`

const SITES = `
  query Sites {
    sites {
      id
      slug
      subdomain
      port
      protocol
    }
  }
`

const AUTH_REGISTER = `
  mutation AuthRegister($username: String!, $password: String!, $passwordConfirmation: String!) {
    authRegister(username: $username, password: $password, passwordConfirmation: $passwordConfirmation) {
      userId
      uuid
      username
      roleId
      createdTs
      updatedTs
      message
    }
  }
`

const AUTH_LOGIN = `
  mutation AuthLogin($username: String!, $password: String!) {
    authLogin(username: $username, password: $password) {
      token
      userId
      username
      message
    }
  }
`

const AUTH_LOGOUT = `
  mutation AuthLogout {
    authLogout {
      message
    }
  }
`

const AUTH_CHANGE_PASSWORD = `
  mutation AuthChangePassword($currentPassword: String!, $newPassword: String!, $newPasswordConfirmation: String!) {
    authChangePassword(currentPassword: $currentPassword, newPassword: $newPassword, newPasswordConfirmation: $newPasswordConfirmation) {
      message
    }
  }
`

const ADD_SITE = `
  mutation AddSite($slug: String!, $subdomain: String, $port: Int, $protocol: String, $metadataJson: String) {
    addSite(slug: $slug, subdomain: $subdomain, port: $port, protocol: $protocol, metadataJson: $metadataJson) {
      id
      slug
      subdomain
      port
      protocol
      metadataJson
      createdTs
      updatedTs
    }
  }
`

const UPDATE_SITE = `
  mutation UpdateSite($id: Int!, $slug: String, $subdomain: String, $port: Int, $protocol: String, $metadataJson: String) {
    updateSite(id: $id, slug: $slug, subdomain: $subdomain, port: $port, protocol: $protocol, metadataJson: $metadataJson) {
      id
      slug
      subdomain
      port
      protocol
      metadataJson
      createdTs
      updatedTs
    }
  }
`

const REMOVE_SITE = `
  mutation RemoveSite($siteId: Int!) {
    removeSite(siteId: $siteId) {
      id
      slug
      subdomain
      port
      protocol
      metadataJson
      createdTs
      updatedTs
    }
  }
`

// Type definitions based on schema
export interface AuthMeResponse {
  userId: number
  uuid: string
  username: string
  roleId: number
  createdTs: number
  updatedTs: number
  sessionIat: number
  sessionExp: number
}

export interface AuthRegisterResponse {
  userId: number
  uuid: string
  username: string
  roleId: number
  createdTs: number
  updatedTs: number
  message: string
}

export interface AuthLoginResponse {
  token: string
  userId: number
  username: string
  message: string
}

export interface Site {
  id: number
  slug: string
  subdomain: string
  port: number
  protocol: string
  metadataJson?: string
  createdTs: number
  updatedTs: number
}

// Internal wrapper functions (underscore prefix to avoid naming conflicts with store methods)
export async function _getServerTimestamp(): Promise<string> {
  const result = await client.query(GET_SERVER_TIMESTAMP, {}).toPromise()
  if (result.error) throw result.error
  return result.data.getServerTimestamp
}

export async function _authMe(): Promise<AuthMeResponse> {
  const result = await client.query(AUTH_ME, {}).toPromise()
  if (result.error) throw result.error
  return result.data.authMe
}

export async function _sites(): Promise<Site[]> {
  const result = await client.query(SITES, {}).toPromise()
  if (result.error) throw result.error
  return result.data.sites
}

export async function _authRegister(username: string, password: string, passwordConfirmation: string): Promise<AuthRegisterResponse> {
  const result = await client.mutation(AUTH_REGISTER, { username, password, passwordConfirmation }).toPromise()
  if (result.error) throw result.error
  return result.data.authRegister
}

export async function _authLogin(username: string, password: string): Promise<AuthLoginResponse> {
  const result = await client.mutation(AUTH_LOGIN, { username, password }).toPromise()
  if (result.error) throw result.error
  return result.data.authLogin
}

export async function _authLogout(): Promise<{ message: string }> {
  const result = await client.mutation(AUTH_LOGOUT, {}).toPromise()
  if (result.error) throw result.error
  return result.data.authLogout
}

export async function _authChangePassword(currentPassword: string, newPassword: string, newPasswordConfirmation: string): Promise<{ message: string }> {
  const result = await client.mutation(AUTH_CHANGE_PASSWORD, { currentPassword, newPassword, newPasswordConfirmation }).toPromise()
  if (result.error) throw result.error
  return result.data.authChangePassword
}

export async function _addSite(slug: string, subdomain?: string, port?: number, protocol?: string, metadataJson?: string): Promise<Site> {
  const result = await client.mutation(ADD_SITE, { slug, subdomain, port, protocol, metadataJson }).toPromise()
  if (result.error) throw result.error
  return result.data.addSite
}

export async function _updateSite(id: number, slug?: string, subdomain?: string, port?: number, protocol?: string, metadataJson?: string): Promise<Site> {
  const result = await client.mutation(UPDATE_SITE, { id, slug, subdomain, port, protocol, metadataJson }).toPromise()
  if (result.error) throw result.error
  return result.data.updateSite
}

export async function _removeSite(siteId: number): Promise<Site> {
  const result = await client.mutation(REMOVE_SITE, { siteId }).toPromise()
  if (result.error) throw result.error
  return result.data.removeSite
}