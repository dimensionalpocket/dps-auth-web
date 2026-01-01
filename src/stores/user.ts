import { defineStore } from "pinia";
import { ref } from "vue";
import { _users, _deleteUser, _updateUser, type User } from '@/lib/auth-wrapper';

export const useUserStore = defineStore('user', () => {
  const loading = ref(false);
  const users = ref<User[]>([]);
  const lastError = ref<string | null>(null);

  async function fetch() {
    loading.value = true;
    lastError.value = null;

    try {
      users.value = await _users();
    } catch (error: any) {
      lastError.value = error.message || 'Failed to fetch users';
    } finally {
      loading.value = false;
    }
  }

  // Load users immediately
  fetch()

  async function remove(id: number) {
    loading.value = true;
    lastError.value = null;

    try {
      const result = await _deleteUser(id);
      users.value = users.value.filter(user => user.id !== id);
      return result;
    } catch (error: any) {
      lastError.value = error.message || 'Failed to remove user';
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function update(id: number, username?: string, roleId?: number, password?: string, passwordConfirmation?: string, metadataJson?: string) {
    loading.value = true;
    lastError.value = null;

    try {
      const updatedUser = await _updateUser(id, username, roleId, password, passwordConfirmation, metadataJson);
      await fetch();
      return updatedUser;
    } catch (error: any) {
      lastError.value = error.message || 'Failed to update user';
      throw error;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    users,
    lastError,
    fetch,
    remove,
    update,
  }
})
