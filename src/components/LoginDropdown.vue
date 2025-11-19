<script setup lang="ts">
import { AlertTriangleIcon, CheckIcon, ChevronDownIcon, CopyIcon, LogOut, ShareIcon, UserCog, UserRoundXIcon, VolumeOffIcon } from 'lucide-vue-next';
import ButtonGroup from './ui/button-group/ButtonGroup.vue';
import Button from './ui/button/Button.vue';
import DropdownMenu from './ui/dropdown-menu/DropdownMenu.vue';
import DropdownMenuTrigger from './ui/dropdown-menu/DropdownMenuTrigger.vue';
import DropdownMenuContent from './ui/dropdown-menu/DropdownMenuContent.vue';
import DropdownMenuGroup from './ui/dropdown-menu/DropdownMenuGroup.vue';
import DropdownMenuItem from './ui/dropdown-menu/DropdownMenuItem.vue';
import DropdownMenuSeparator from './ui/dropdown-menu/DropdownMenuSeparator.vue';

</script>

<template>
  <div>
    <div v-if="true" class="text-right leading-none">
      <span class="text-xs text-muted-foreground">Not logged in</span><br/>
      <span class="text-muted-foreground">
        <router-link to="/sign-in" class="hover:underline text-primary">Login</router-link>
        or
        <router-link to="/sign-up" class="hover:underline text-primary">Sign up</router-link>
      </span>
    </div>
    <ButtonGroup v-else>
      <Button variant="outline">
        <UserCog/>
        <span class="hidden sm:inline">Username</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" size="icon">
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="[--radius:1rem]">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <VolumeOffIcon />
              Mute Conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CheckIcon />
              Mark as Read
            </DropdownMenuItem>
            <DropdownMenuItem>
              <AlertTriangleIcon />
              Report Conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UserRoundXIcon />
              Block User
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ShareIcon />
              Share Conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CopyIcon />
              Copy Conversation
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">
              <LogOut/>
              Log out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  </div>

</template>
