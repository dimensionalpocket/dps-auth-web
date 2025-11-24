# Backend GraphQL Schema

This app consumes a GraphQL backend for authentication and user management.

The schema is defined in the README of the backend repository:

https://raw.githubusercontent.com/dimensionalpocket/dps-auth-api/library-conversion/README.md

When you are asked to update the schema, fetch the latest schema from the URL above and update the **Current Schema** section of this file accordingly.

## Current Schema

#### Queries

| Operation | Description | Response Fields | Auth Required |
|-----------|-------------|-----------------|---------------|
| `getServerTimestamp` | Get current server timestamp | timestamp (String) | None |
| `authMe` | Get current authenticated user profile | user_id (Int), uuid (String), username (String), role_id (Int), created_ts (Int), updated_ts (Int), session_iat (Int), session_exp (Int) | Valid session cookie |
| `sites` | List all sites in database | sites: [id (Int), slug (String), subdomain (String), port (Int), protocol (String)] | None |

#### Mutations

| Operation | Description | Input Fields | Response Fields | Auth Required |
|-----------|-------------|--------------|-----------------|---------------|
| `authRegister` | Register new user account | username (String!), password (String!), passwordConfirmation (String!) | user_id (Int), uuid (String), username (String), role_id (Int), created_ts (Int), updated_ts (Int), message (String) | None |
| `authLogin` | Authenticate user and create session | username (String!), password (String!) | token (String), user_id (Int), username (String), message (String) | None (sets cookie) |
| `authLogout` | Logout user by clearing session cookie | None | message (String) | None |
| `authChangePassword` | Change password for authenticated user | currentPassword (String!), newPassword (String!) | message (String) | Valid session cookie |
| `addSite` | Add new site to database | slug (String!), subdomain (String), port (Int), protocol (String), metadataJson (String) | id (Int), slug (String), subdomain (String), port (Int), protocol (String), metadataJson (String), created_ts (Int), updated_ts (Int) | can_create_site |
| `updateSite` | Update existing site | id (Int!), slug (String), subdomain (String), port (Int), protocol (String), metadataJson (String) | id (Int), slug (String), subdomain (String), port (Int), protocol (String), metadataJson (String), created_ts (Int), updated_ts (Int) | can_update_site |
| `removeSite` | Remove existing site | site_id (Int!) | id (Int), slug (String), subdomain (String), port (Int), protocol (String), metadataJson (String), created_ts (Int), updated_ts (Int) | can_delete_site |
