# 27-implement-global-toast-system.md

## Overview
Implement a global toast notification system using Shadcn-Vue's toast component to enable flash messages for user actions. The system will support stacking notifications, auto-dismissal, and manual dismissal via close button.

## Implementation Plan

### 1. Install Shadcn-Vue Toast Component
- Run command: `bunx shadcn-vue@latest add toast`
- This will install the toast component files in `src/components/ui/toast/`

### 2. Add Global Toaster to App.vue
- Import the `Toaster` component in `src/App.vue`
- Add it to the template to make toasts available globally
- Import required CSS styles
- Configure positioning to bottom-center
- Apply width constraints to match main layout width

### 3. Create Toast Composable
- Create `src/composables/useToast.ts` for a global toast interface
- Export a simplified toast API that wraps Shadcn's `useToast`
- Provide methods for success, error, info, and warning toasts
- Include default options for auto-dismissal timing

### 4. Update Main App Component
- Modify `src/App.vue` to include the Toaster component
- Ensure proper positioning and z-index for toast visibility

### 5. Integration Examples
- Update existing views to demonstrate toast usage:
  - `src/views/LoginView.vue` - Show success toast only on successful login
  - `src/views/RegisterView.vue` - No toast notifications
  - `src/views/PasswordChangeView.vue` - Show success toast on password change
  - Create logout utility with toast notification for use across multiple views

## Technical Details

### Files to Create/Modify

#### New Files:
- `src/composables/useToast.ts` - Global toast composable
- `src/lib/logout.ts` - Logout utility with toast notification

#### Modified Files:
- `src/App.vue` - Add Toaster component
- `src/views/LoginView.vue` - Add success toast on login
- `src/views/PasswordChangeView.vue` - Add success toast on password change
- Any components that call logout - Update to use new logout utility

### Toast Component Structure
The Shadcn-Vue toast system provides:
- `useToast()` hook for triggering toasts
- `Toaster` component for rendering notifications
- Built-in support for:
  - Auto-dismissal after configurable duration
  - Manual dismiss button (X button)
  - Stacking multiple notifications
  - Different variants (default, success, destructive)

### Composable API Design
```typescript
// src/composables/useToast.ts
export const useToast = () => {
  return {
    success: (message: string, options?: ToastOptions) => void,
    error: (message: string, options?: ToastOptions) => void,
    info: (message: string, options?: ToastOptions) => void,
    warning: (message: string, options?: ToastOptions) => void,
    dismiss: (id?: string) => void
  }
}
```

### Default Configuration
- Auto-dismiss after 5 seconds for success/info messages
- Auto-dismiss after 8 seconds for error/warning messages
- Position: bottom-center
- Maximum 3 toasts visible simultaneously
- Support for manual dismissal via X button
- Toast width constrained to main layout width (responsive)

### Usage Examples
```typescript
// In any component or composable
const { toast } = useToast()

// Success message
toast.success('Login successful!')

// Error message
toast.error('Invalid credentials')

// With custom options
toast.info('Processing your request...', { duration: 10000 })

// Using logout utility
import { logoutWithToast } from '@/lib/logout'
logoutWithToast() // Shows "Logged out successfully" toast
```

## Benefits
- Global access from any component without additional imports
- Consistent styling and behavior across the application
- Accessibility features built into Shadcn components
- TypeScript support for type safety
- Responsive design that works on all screen sizes
- Smooth animations and transitions
- Bottom-center positioning for better mobile UX
- Width-constrained toasts that respect layout boundaries

## Dependencies
- Uses existing Shadcn-Vue installation
- No additional packages required
- Leverages existing TailwindCSS setup
- Compatible with current Vue 3 + TypeScript setup

## Logout Utility Design
The logout utility will:
- Handle the actual logout process (clear auth state, redirect, etc.)
- Show a success toast notification: "Logged out successfully"
- Be importable from any component that needs logout functionality
- Ensure consistent logout behavior across the application