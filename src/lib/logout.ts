import { useAuthStore } from '@/stores/auth'

export const logoutWithToast = async (router: any, toast: any) => {
  const authStore = useAuthStore()
  
  try {
    await authStore.logout()
    toast.success('Logged out successfully')
    
    // Redirect to login page after logout
    router.push({ name: 'login' })
  } catch (error) {
    console.error('Logout failed:', error)
    // Still redirect even if logout fails on the backend
    router.push({ name: 'login' })
  }
}