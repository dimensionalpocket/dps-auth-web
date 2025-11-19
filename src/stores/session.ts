import { defineStore } from "pinia";
import { ref } from "vue";

export const useSessionStore = defineStore('session', () => {
  const sessionLoading = ref(false);
  const sessionData = ref<{ username: string } | null>(null);
  const sessionLastError = ref<string | null>(null);

  // Placeholder for future authentication logic
  async function sessionAuthenticate (username: string, password: string) {
    sessionLoading.value = true;
    sessionLastError.value = null;

    // Fake 1-second delay to simulate authentication process
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (username === 'user' && password === 'pass') {
      // Authentication successful
      sessionLoading.value = false;
      sessionData.value = { username };
      return true;
    } else {
      // Authentication failed
      sessionLastError.value = 'Invalid username or password';
      sessionLoading.value = false;
      return false;
    }
  }

  // Placeholder for future logout logic
  async function sessionLogout () {
    sessionLoading.value = true;

    // Fake 500ms delay to simulate logout process
    await new Promise((resolve) => setTimeout(resolve, 500));

    sessionData.value = null;
    sessionLoading.value = false;
  }

  return {
    sessionLoading,
    sessionData,
    sessionLastError,
    sessionAuthenticate,
    sessionLogout,
  }
})
