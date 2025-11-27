import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { _authLogin, _authRegister, _authLogout, _authMe, _authChangePassword } from '@/lib/auth-wrapper';

export const useAuthStore = defineStore('auth', () => {
  const loading = ref(false);
  const sessionData = ref<{ username: string; userId: number; token?: string; uuid?: string } | null>(null);
  const loginLastError = ref<string | null>(null);
  const registerLastError = ref<string | null>(null);
  const changePasswordLastError = ref<string | null>(null);

  const isAuthenticated = computed(() => sessionData.value !== null);

  // Initialize session check immediately after me() is defined
  const sessionInfoPromise = ref<Promise<void>>();
  me() // immediately sets sessionInfoPromise

  // Replace placeholder authLogin method
  async function login(username: string, password: string) {
    loading.value = true;
    loginLastError.value = null;
    
    try {
      const result = await _authLogin(username, password);
      sessionData.value = { 
        username: result.username,
        userId: result.userId,
        token: result.token
      };
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
      sessionData.value = { 
        username: result.username,
        userId: result.userId,
        uuid: result.uuid
      };
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

  async function me (): Promise<void> {
    sessionInfoPromise.value = _authMe()
      .then(user => {
        if (user) {
          sessionData.value = {
            username: user.username,
            userId: user.userId,
            uuid: user.uuid
          };
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
    sessionInfoPromise,
    ensureSession,
    login,
    register,
    logout,
    me,
    changePassword,
  }
})
