# Backend GraphQL Schema

This app consumes a GraphQL backend for authentication and user management.

The schema is defined in the README of the backend repository:

https://raw.githubusercontent.com/dimensionalpocket/dps-auth-api/library-conversion/README.md

If you get a 404, it may mean that the `library-conversion` branch has been deleted. If that happens, switch to the `main` branch in the URL.

When you are asked to update the schema, fetch the latest schema from the URL above and update the **Current Schema** section of this file accordingly.

## Current Schema

#### Queries

| Operation | Description |
|-----------|-------------|
| `serverTimestamp` | Get current server timestamp in milliseconds since Unix epoch. Returns timestamp (String). No authentication required. |
| `authMe` | Get current authenticated user profile. Returns user { id (Int), uuid (String), name (String), role { id (String), name (String), permissions ([String]) }, createdTs (Int), updatedTs (Int) }, sessionIat (Int), sessionExp (Int). Requires valid session cookie. |
| `site` | Get complete site details by ID (admin only). Returns id (Int!), slug (String), subdomain (String), port (Int), protocol (String), metadataJson (String), createdTs (Int), updatedTs (Int). Requires can_view_site_details permission. |
| `sites` | List all sites in database. Returns array of [id (Int), slug (String), subdomain (String), port (Int), protocol (String)]. No authentication required. |
| `user` | Get complete user details by ID (admin only). Returns id (Int!), uuid (String), name (String), role { id (String), name (String), permissions ([String]) }, createdTs (Int), updatedTs (Int). Requires can_view_user_details permission. |
| `users` | List all users with role information (admin only). Returns array of [id (Int), uuid (String), name (String), role { id (String), name (String), permissions ([String]) }, createdTs (Int), updatedTs (Int)]. Requires can_list_users permission. |
| `rolePermissions` | List all available role permissions. Returns array of permission strings. Requires can_manage_roles permission. |
| `roles` | List all roles with permissions. Returns array of [id (Int), name (String), isDefault (Boolean), permissions ([String]), createdTs (Int), updatedTs (Int)]. Requires can_manage_roles OR can_edit_user_role permission. |
| `role` | Get single role by ID. Returns id (Int!), name (String), isDefault (Boolean), permissions ([String]), createdTs (Int), updatedTs (Int). Requires can_manage_roles permission. |

#### Mutations

| Operation | Description |
|-----------|-------------|
| `authRegister` | Register new user account. Input: username (String!), password (String!), passwordConfirmation (String!). Returns: user { id (Int), uuid (String), name (String), role { id (String), name (String), permissions ([String]) }, createdTs (Int), updatedTs (Int) }, message (String). No authentication required. |
| `authLogin` | Authenticate user and create session. Input: username (String!), password (String!). Returns: token (String), user { id (Int), name (String), role { id (String), name (String), permissions ([String]) } }, message (String). No authentication required (sets cookie). |
| `authLogout` | Logout user by clearing session cookie. No input required. Returns: message (String). No authentication required. |
| `authChangePassword` | Change password for authenticated user. Input: currentPassword (String!), newPassword (String!), newPasswordConfirmation (String!). Returns: message (String). Requires valid session cookie. |
| `addSite` | Add new site to database. Input: slug (String!), subdomain (String), port (Int), protocol (String), metadataJson (String). Returns: id (Int), slug (String), subdomain (String), port (Int), protocol (String), metadataJson (String), createdTs (Int), updatedTs (Int). Requires can_create_site permission. |
| `updateSite` | Update existing site. Input: id (Int!), slug (String), subdomain (String), port (Int), protocol (String), metadataJson (String). Returns: id (Int), slug (String), subdomain (String), port (Int), protocol (String), metadataJson (String), createdTs (Int), updatedTs (Int). Requires can_update_site permission. |
| `removeSite` | Remove existing site. Input: siteId (Int!). Returns: id (Int), slug (String), subdomain (String), port (Int), protocol (String), metadataJson (String), createdTs (Int), updatedTs (Int). Requires can_delete_site permission. |
| `deleteUser` | Delete existing user. Input: id (Int!). Returns: success (Boolean). Requires can_delete_user permission. |
| `updateUser` | Update existing user. Input: id (Int!), name (String), roleId (Int), password (String), passwordConfirmation (String), metadataJson (String). Returns: id (Int), uuid (String), name (String), role { id (Int), name (String), permissions ([String]) }, metadataJson (String), createdTs (Int), updatedTs (Int). Requires can_edit_user permission. |
| `addRole` | Create new role. Input: name (String!), permissions ([String]!). Returns: id (Int), name (String), isDefault (Boolean), permissions ([String]), createdTs (Int), updatedTs (Int). Requires can_manage_roles permission. |
| `updateRole` | Update existing role. Input: id (Int!), name (String), permissions ([String]). Returns: id (Int), name (String), isDefault (Boolean), permissions ([String]), createdTs (Int), updatedTs (Int). Requires can_manage_roles permission. |
| `setDefaultRole` | Set a role as the default role. Input: roleId (Int!). Returns: id (Int), name (String), isDefault (Boolean), permissions ([String]), createdTs (Int), updatedTs (Int). Requires can_manage_roles permission. |
| `removeRole` | Delete existing role. Input: id (Int!). Returns: success (Boolean), id (Int), name (String). Requires can_manage_roles permission. |
