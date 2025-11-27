<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { KeyRound, LogOut } from 'lucide-vue-next';
import Button from '@/components/ui/button/Button.vue';
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import CardHeader from '@/components/ui/card/CardHeader.vue';
import CardTitle from '@/components/ui/card/CardTitle.vue';
import Spinner from '@/components/ui/spinner/Spinner.vue';

const authStore = useAuthStore();
const router = useRouter();

function handleChangePassword() {
  router.push({ name: 'password-change' });
}

async function handleLogout() {
  await authStore.logout();
  router.push({ name: 'login' });
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
          <Button 
            @click="handleChangePassword" 
            class="flex-1"
            :disabled="authStore.loading"
          >
            <KeyRound class="w-4 h-4 mr-2" />
            Change password
          </Button>
          <Button 
            variant="destructive" 
            @click="handleLogout" 
            class="flex-1"
            :disabled="authStore.loading"
          >
            <Spinner v-if="authStore.loading" class="w-4 h-4 mr-2" />
            <LogOut v-else class="w-4 h-4 mr-2" />
            {{ authStore.loading ? 'Logging out...' : 'Log out' }}
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
