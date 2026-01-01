# Plan: Update getAuthApiUrl Function

## Overview
Update the `getAuthApiUrl` function to remove the deleted `VITE_DPS_API_SUBDOMAIN` variable and incorporate the new `VITE_DPS_API_PATH` variable.

## Current Function Location
`src/lib/utils/getAuthApiUrl.ts`

## Changes Required

### 1. Remove VITE_DPS_API_SUBDOMAIN
- Delete any code that references `VITE_DPS_API_SUBDOMAIN`
- Remove subdomain logic from URL construction

### 2. Add VITE_DPS_API_PATH Support
- Add logic to read `VITE_DPS_API_PATH` environment variable
- If the variable exists and is not empty, prepend "/" to create the path
- Append the path before "/graphql" in the final URL
- Handle the case where the variable is not set or empty (no additional path)

### 3. URL Construction Logic
The final URL should follow this pattern:
`{base_url}{optional_path}/graphql`

Where:
- `base_url` is constructed without the subdomain
- `optional_path` is `/${VITE_DPS_API_PATH}` if the variable is set and not empty

## Implementation Details

### Function Structure
```typescript
export function getAuthApiUrl(): string {
  // Get base URL without subdomain
  // Get path from VITE_DPS_API_PATH (if exists)
  // Construct final URL: base + optional_path + "/graphql"
  // Return the complete URL
}
```

### Environment Variable Handling
- `VITE_DPS_API_PATH`: Optional path string without leading slash
  - Example: "api" → results in "/api"
  - Example: "" or undefined → results in "" (no additional path)
- Handle edge cases where the variable might contain whitespace

### Examples
- If `VITE_DPS_API_PATH="api"`: URL ends with `/api/graphql`
- If `VITE_DPS_API_PATH=""`: URL ends with `/graphql`
- If `VITE_DPS_API_PATH` is undefined: URL ends with `/graphql`

## Files to Modify
- `src/lib/utils/getAuthApiUrl.ts`
- `src/lib/utils/getAuthApiUrl.test.ts` (new test file)

## Testing

### Test File Creation
Create `src/lib/utils/getAuthApiUrl.test.ts` with comprehensive tests using `bun:test`.

### Test Structure
```typescript
import { describe, it, expect } from 'bun:test'
import { getAuthApiUrl } from './getAuthApiUrl'

describe('getAuthApiUrl', () => {
  // Test cases here
})
```

### Test Cases
- it('returns correct URL when VITE_DPS_API_PATH is "api"')
- it('returns correct URL when VITE_DPS_API_PATH is empty string')
- it('returns correct URL when VITE_DPS_API_PATH is undefined')
- it('returns correct URL when VITE_DPS_API_PATH contains whitespace')
- it('returns correct URL when VITE_DPS_API_PATH is "v1/api"')

### Test Execution
After implementation, run tests with:
```bash
bun test src/lib/utils/getAuthApiUrl.test.ts
```

### Test Guidelines
- Use `bun:test` framework
- Use `describe`, `it`, and `expect` functions
- Do not use "should" in test descriptions
- Focus on what the function returns, not what it "should" do
- Test edge cases and different environment variable values

## AGENTS.md Update
Add testing guidelines to AGENTS.md under the Testing section to document the use of `bun:test` framework and test description standards.