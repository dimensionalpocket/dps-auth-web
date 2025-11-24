import { defineStore } from "pinia";
import { ref } from "vue";
import { _authLogin, _authRegister, _authLogout, _authMe, _authChangePassword } from '@/lib/auth-wrapper';

export const useAuthStore = defineStore('auth', () => {
  const loading = ref(false);
  const sessionData = ref<{ username: string; userId: number; token?: string; uuid?: string } | null>(null);
  const loginLastError = ref<string | null>(null);
  const registerLastError = ref<string | null>(null);

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
    } catch (error: any) {
      console.error('Logout error:', error);
    } finally {
      loading.value = false;
    }
  }

  // Add new me method
  async function me() {
    try {
      const user = await _authMe();
      sessionData.value = {
        username: user.username,
        userId: user.userId,
        uuid: user.uuid
      };
      return user;
    } catch (error: any) {
      sessionData.value = null;
      throw error;
    }
  }

  // Add changePassword method
  async function changePassword(currentPassword: string, newPassword: string, newPasswordConfirmation: string) {
    loading.value = true;
    
    try {
      await _authChangePassword(currentPassword, newPassword, newPasswordConfirmation);
      return true;
    } catch (error: any) {
      loginLastError.value = error.message || 'Password change failed';
      return false;
    } finally {
      loading.value = false;
    }
  }



  return {
    loading,
    sessionData,
    loginLastError,
    registerLastError,
    login,
    register,
    logout,
    me,
    changePassword,
  }
})
