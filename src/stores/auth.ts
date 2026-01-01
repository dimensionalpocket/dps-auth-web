import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { _authLogin, _authRegister, _authLogout, _authMe, _authChangePassword } from '@/lib/auth-wrapper';
import type { Role, AuthMeResponse } from '@/lib/auth-wrapper';

export const useAuthStore = defineStore('auth', () => {
  const loading = ref(false);
  const sessionData = ref<AuthMeResponse | null>(null);
  const loginLastError = ref<string | null>(null);
  const registerLastError = ref<string | null>(null);
  const changePasswordLastError = ref<string | null>(null);

  const isAuthenticated = computed(() => sessionData.value !== null);
  const isAdmin = computed(() => sessionData.value?.user?.role?.permissions?.includes('is_admin') || false);
  const canAccessAdmin = computed(() => {
    if (isAdmin.value) return true;
    const permissions = sessionData.value?.user?.role?.permissions || [];
    const adminPermissions = ['can_list_users', 'can_manage_roles', 'can_create_site', 'can_update_site', 'can_delete_site'];
    return adminPermissions.some(permission => permissions.includes(permission));
  });

  // Initialize session check immediately after me() is defined
  const sessionInfoPromise = ref<Promise<void>>();
  me() // immediately sets sessionInfoPromise (no await)

  // Replace placeholder authLogin method
  async function login(username: string, password: string) {
    loading.value = true;
    loginLastError.value = null;
    
    try {
      await _authLogin(username, password);
      // Call me() to get complete user profile including role information
      await me();
      return true;
    } catch (error: any) {
      loginLastError.value = error.message || 'Login failed';
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Replace placeholder authRegister method
  async function register(username: string, password: string, passwordConfirm: string) {
    loading.value = true;
    registerLastError.value = null;
    
    try {
      const result = await _authRegister(username, password, passwordConfirm);
      console.log('Registration result:', result);
      // Call me() to get complete user profile
      await me();
      console.log('Session data after registration:', sessionData.value);
      return true;
    } catch (error: any) {
      registerLastError.value = error.message || 'Registration failed';
      return false;
    } finally {
      loading.value = false;
    }
  }

  // Replace placeholder authLogout method
  async function logout() {
    loading.value = true;
    
    try {
      await _authLogout();
      sessionData.value = null;
      // Start new session check immediately
      sessionInfoPromise.value = me()
    } catch (error: any) {
      console.error('Logout error:', error);
    } finally {
      loading.value = false;
    }
  }

  // Do not flag this function as async,
  // as it does not use await, and returns a cacheable Promise
  function me (): Promise<void> {
    console.log('Fetching current user session data...');
    sessionInfoPromise.value = _authMe()
      .then(authMe => {
        if (authMe) {
          console.log('AuthMe user data:', authMe);
          sessionData.value = authMe;
        } else {
          sessionData.value = null;
        }
      })
      .catch(error => {
        sessionData.value = null;
        throw error;
      });

    return sessionInfoPromise.value;
  }

  async function ensureSession(): Promise<void> {
    // Promise is always available, never null
    return sessionInfoPromise.value;
  }

  // Add changePassword method
  async function changePassword(currentPassword: string, newPassword: string, newPasswordConfirmation: string) {
    changePasswordLastError.value = null;
    
    try {
      await _authChangePassword(currentPassword, newPassword, newPasswordConfirmation);
      return true;
    } catch (error: any) {
      changePasswordLastError.value = error.message || 'Password change failed';
      return false;
    }
  }



  return {
    loading,
    sessionData,
    loginLastError,
    registerLastError,
    changePasswordLastError,
    isAuthenticated,
    isAdmin,
    canAccessAdmin,
    sessionInfoPromise,
    ensureSession,
    login,
    register,
    logout,
    me,
    changePassword,
  }
})
