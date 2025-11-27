# 27-Implement HomeView Dashboard

## Overview
Implement the HomeView as a dashboard for logged-in users, displaying user information and action buttons in a card layout similar to LoginView.

## Implementation Details

### Files to Modify
- `src/views/HomeView.vue` - Complete rewrite from current placeholder

### Implementation Plan

#### 1. Component Structure
- Use composition API with `<script setup lang="ts">` syntax
- Import required UI components (Card, Button, etc.)
- Import auth store to access user session data
- Follow the same layout pattern as LoginView with centered card

#### 2. User Information Display
- Show professional welcome message with username
- Use `sessionData.username` from auth store
- Display format: "Welcome back, {username}" or "Logged in as: {username}"
- Add subtle styling to make it visually distinct from buttons

#### 3. Action Buttons
Create two buttons with appropriate styling:
- **Change password** - Default variant, does nothing (placeholder)  
- **Log out** - Destructive variant (red/warning style), does nothing (placeholder)

#### 4. Layout and Styling
- Wrap everything in a Card component like LoginView
- Use CardHeader for the user information display
- Use CardContent for the action buttons
- Stack buttons vertically with proper spacing
- Center the card container with max-width constraint
- Use consistent TailwindCSS styling

#### 5. Code Structure
```vue
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import Button from '@/components/ui/button/Button.vue';
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import CardHeader from '@/components/ui/card/CardHeader.vue';
import CardTitle from '@/components/ui/card/CardTitle.vue';

const authStore = useAuthStore();

// Placeholder functions for buttons
function handleChangePassword() {
  // TODO: Implement change password functionality
}

function handleLogout() {
  // TODO: Implement logout functionality
}
</script>

<template>
  <div class="w-full max-w-md">
    <Card>
      <CardHeader>
        <CardTitle>Welcome back, {{ authStore.sessionData?.username }}</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex flex-col sm:flex-row gap-2">
          <Button @click="handleChangePassword" class="flex-1">
            Change password
          </Button>
          <Button variant="destructive" @click="handleLogout" class="flex-1">
            Log out
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
```

## Notes
- All button functionality is intentionally left as placeholders per requirements
- Change username button removed as backend does not support this feature
- Using `destructive` variant for logout button to provide visual warning
- Responsive button layout: vertical stack on mobile, horizontal row on larger screens (`sm:` breakpoint)
- Card layout maintains consistency with LoginView design
- Responsive design with max-width constraint
- Uses existing UI components from the project's Shadcn-Vue setup