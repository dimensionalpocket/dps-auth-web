<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from '@/components/ui/button/Button.vue';
import Card from '@/components/ui/card/Card.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import CardDescription from '@/components/ui/card/CardDescription.vue';
import CardHeader from '@/components/ui/card/CardHeader.vue';
import CardTitle from '@/components/ui/card/CardTitle.vue';
import Field from '@/components/ui/field/Field.vue';
import FieldDescription from '@/components/ui/field/FieldDescription.vue';
import FieldGroup from '@/components/ui/field/FieldGroup.vue';
import FieldLabel from '@/components/ui/field/FieldLabel.vue';
import FieldError from '@/components/ui/field/FieldError.vue';
import Input from '@/components/ui/input/Input.vue';
import Spinner from '@/components/ui/spinner/Spinner.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');

async function onSubmit () {
  const ok = await authStore.authLogin(username.value, password.value);
  if (ok) {
    // Replace (not push) to trigger password manager save prompt
    router.replace({ name: 'login-success' });
  } else {
    // Empties the password field to prevent password managers from asking to save incorrect passwords
    password.value = '';
  }
}
</script>

<template>
  <div class="w-full max-w-md">
    <Card>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your credentials below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent>
          <FieldGroup>
            <Field>
              <FieldLabel for="username">
                Username
              </FieldLabel>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="username"
                required
                autocomplete="username"
                v-model="username"
                :disabled="authStore.authLoading"
                @keydown.enter.prevent="onSubmit"
              />
            </Field>
            <Field>
              <div class="flex items-center">
                <FieldLabel for="password">
                  Password
                </FieldLabel>
                <!-- <a
                  href="#"
                  class="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a> -->
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autocomplete="current-password"
                v-model="password"
                :disabled="authStore.authLoading"
                @keydown.enter.prevent="onSubmit"
              />
            </Field>
            <Field>
              <Button :disabled="authStore.authLoading" type="button" @click="onSubmit">
                <template v-if="authStore.authLoading">
                  <Spinner class="h-4 w-4 mr-2 inline-block" />
                  Logging in…
                </template>
                <template v-else>
                  Login
                </template>
              </Button>
              <!-- <Button variant="outline" type="button">
                Login with Google
              </Button> -->
              <FieldDescription class="text-center">
                Don't have an account? <router-link :to="{ name: 'register' }" class="text-primary">Sign up</router-link>
              </FieldDescription>
              <FieldError v-if="authStore.authLoginLastError" class="mt-2 text-center">
                {{ authStore.authLoginLastError }}
              </FieldError>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
