<script setup lang="ts">
import { AlertTriangleIcon, CheckIcon, ChevronDownIcon, CopyIcon, KeyRound, LogOut, ShareIcon, Shield, UserCog, UserRoundXIcon, VolumeOffIcon } from 'lucide-vue-next';
import ButtonGroup from './ui/button-group/ButtonGroup.vue';
import Button from './ui/button/Button.vue';
import DropdownMenu from './ui/dropdown-menu/DropdownMenu.vue';
import DropdownMenuTrigger from './ui/dropdown-menu/DropdownMenuTrigger.vue';
import DropdownMenuContent from './ui/dropdown-menu/DropdownMenuContent.vue';
import DropdownMenuGroup from './ui/dropdown-menu/DropdownMenuGroup.vue';
import DropdownMenuItem from './ui/dropdown-menu/DropdownMenuItem.vue';
import DropdownMenuSeparator from './ui/dropdown-menu/DropdownMenuSeparator.vue';
import Spinner from './ui/spinner/Spinner.vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { logoutWithToast } from '@/lib/logout';
import { useToast } from '@/composables/useToast';

const authStore = useAuthStore();
const router = useRouter();
const { success } = useToast();

async function handleLogout() {
  await logoutWithToast(router, { success });
}

function handleGoHome() {
  router.push({ name: 'home' });
}

function handleChangePassword() {
  router.push({ name: 'password-change' });
}

function handleGoToAdmin() {
  router.push({ name: 'admin-home' });
}
</script>

<template>
  <div>
    <!-- Loading state -->
    <div v-if="authStore.loading" class="text-right">
      <Spinner class="w-4 h-4 inline mr-2" />
      <span class="text-sm text-muted-foreground">Loading...</span>
    </div>
    
    <!-- Normal states -->
    <div v-else>
      <div v-if="!authStore.isAuthenticated" class="text-right leading-none">
        <span class="text-xs text-muted-foreground">Not logged in</span><br/>
        <span class="text-muted-foreground">
          <router-link :to="{ name: 'login' }" class="hover:underline text-primary">Login</router-link>
          or
          <router-link :to="{ name: 'register' }" class="hover:underline text-primary">Sign up</router-link>
        </span>
      </div>
      <ButtonGroup v-else>
        <Button variant="outline" @click="handleGoHome">
          <UserCog/>
          <span class="hidden sm:inline">{{ authStore.sessionData?.user?.name }}</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline" size="icon">
              <ChevronDownIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="[--radius:1rem]">
            <DropdownMenuGroup>
              <DropdownMenuItem @click="handleChangePassword">
                <KeyRound />
                Change Password
              </DropdownMenuItem>
              <DropdownMenuItem v-if="authStore.canAccessAdmin" @click="handleGoToAdmin">
                <Shield />
                Administration
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive" @click="handleLogout" :disabled="authStore.loading">
                <Spinner v-if="authStore.loading" class="w-4 h-4 mr-2" />
                <LogOut/>
                {{ authStore.loading ? 'Logging out...' : 'Log out' }}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </div>
  </div>
</template>
