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
