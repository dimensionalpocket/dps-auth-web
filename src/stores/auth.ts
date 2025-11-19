import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore('auth', () => {
  const authLoading = ref(false);
  const authSessionData = ref<{ username: string } | null>(null);
  const authLoginLastError = ref<string | null>(null);

  // Placeholder for future authentication logic
  async function authLogin (username: string, password: string) {
    authLoading.value = true;
    authLoginLastError.value = null;

    // Fake 1-second delay to simulate authentication process
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (username === 'user' && password === 'pass') {
      // Authentication successful
      authLoading.value = false;
      authSessionData.value = { username };
      return true;
    } else {
      // Authentication failed
      authLoginLastError.value = 'Invalid username or password';
      authLoading.value = false;
      return false;
    }
  }

  // Placeholder for future logout logic
  async function authLogout () {
    authLoading.value = true;

    // Fake 500ms delay to simulate logout process
    await new Promise((resolve) => setTimeout(resolve, 500));

    authSessionData.value = null;
    authLoading.value = false;
  }

  return {
    authLoading,
    authSessionData,
    authLoginLastError,
    authLogin,
    authLogout,
  }
})
