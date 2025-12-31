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
    fetchExchange,
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
    serverTimestamp
  }
`

const AUTH_ME = `
  query AuthMe {
    authMe {
      userId
      uuid
      username
      role {
        id
        name
        permissions
      }
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
      user {
        userId
        uuid
        username
        role {
          id
          name
          permissions
        }
      }
      message
    }
  }
`

const AUTH_LOGIN = `
  mutation AuthLogin($username: String!, $password: String!) {
    authLogin(username: $username, password: $password) {
      token
      user {
        userId
        username
        role {
          id
          name
          permissions
        }
      }
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

const ROLE_PERMISSIONS = `
  query RolePermissions {
    rolePermissions
  }
`

const ROLES = `
  query Roles {
    roles {
      id
      name
      permissions
      createdTs
      updatedTs
    }
  }
`

const ROLE = `
  query Role($id: Int!) {
    role(id: $id) {
      id
      name
      permissions
      createdTs
      updatedTs
    }
  }
`

const ADD_ROLE = `
  mutation AddRole($name: String!, $permissions: [String!]!) {
    addRole(name: $name, permissions: $permissions) {
      id
      name
      permissions
      createdTs
      updatedTs
    }
  }
`

const UPDATE_ROLE = `
  mutation UpdateRole($id: Int!, $name: String, $permissions: [String]) {
    updateRole(id: $id, name: $name, permissions: $permissions) {
      id
      name
      permissions
      createdTs
      updatedTs
    }
  }
`

const SET_DEFAULT_ROLE = `
  mutation SetDefaultRole($roleId: Int!) {
    setDefaultRole(roleId: $roleId) {
      id
      name
      isDefault
      permissions
      createdTs
      updatedTs
    }
  }
`

const REMOVE_ROLE = `
  mutation RemoveRole($id: Int!) {
    removeRole(id: $id) {
      success
    }
  }
`

// Type definitions based on schema
export interface Role {
  id: string
  name: string
  permissions: string[]
}

export interface AuthMeResponse {
  userId: number
  uuid: string
  username: string
  role: Role
}

export interface AuthRegisterResponse {
  user: {
    userId: number
    uuid: string
    username: string
    role: Role
  }
  message: string
}

export interface AuthLoginResponse {
  token: string
  user: {
    userId: number
    username: string
    role: Role
  }
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

export interface RoleWithTimestamps {
  id: number
  name: string
  permissions: string[]
  createdTs: number
  updatedTs: number
}

export interface RoleWithDefault {
  id: number
  name: string
  isDefault: boolean
  permissions: string[]
  createdTs: number
  updatedTs: number
}

// Internal wrapper functions (underscore prefix to avoid naming conflicts with store methods)
export async function _getServerTimestamp(): Promise<string> {
  const result = await client.query(GET_SERVER_TIMESTAMP, {}).toPromise()
  if (result.error) throw result.error
  return result.data.serverTimestamp
}

export async function _authMe(): Promise<AuthMeResponse | null> {
  // Force network fetch to ensure fresh session data
  const result = await client.query(AUTH_ME, {}, { requestPolicy: 'network-only' }).toPromise()
  if (result.error) throw result.error
  return result.data.authMe
}

export async function _sites(): Promise<Site[]> {
  const result = await client.query(SITES, {}, { requestPolicy: 'network-only' }).toPromise()
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

export async function _rolePermissions(): Promise<string[]> {
  const result = await client.query(ROLE_PERMISSIONS, {}).toPromise()
  if (result.error) throw result.error
  return result.data.rolePermissions
}

export async function _roles(): Promise<RoleWithTimestamps[]> {
  const result = await client.query(ROLES, {}).toPromise()
  if (result.error) throw result.error
  return result.data.roles
}

export async function _role(id: number): Promise<RoleWithTimestamps> {
  const result = await client.query(ROLE, { id }).toPromise()
  if (result.error) throw result.error
  return result.data.role
}

export async function _addRole(name: string, permissions: string[]): Promise<RoleWithTimestamps> {
  const result = await client.mutation(ADD_ROLE, { name, permissions }).toPromise()
  if (result.error) throw result.error
  return result.data.addRole
}

export async function _updateRole(id: number, name?: string, permissions?: string[]): Promise<RoleWithTimestamps> {
  const result = await client.mutation(UPDATE_ROLE, { id, name, permissions }).toPromise()
  if (result.error) throw result.error
  return result.data.updateRole
}

export async function _setDefaultRole(roleId: number): Promise<RoleWithDefault> {
  const result = await client.mutation(SET_DEFAULT_ROLE, { roleId }).toPromise()
  if (result.error) throw result.error
  return result.data.setDefaultRole
}

export async function _removeRole(id: number): Promise<{ success: boolean }> {
  const result = await client.mutation(REMOVE_ROLE, { id }).toPromise()
  if (result.error) throw result.error
  return result.data.removeRole
}
