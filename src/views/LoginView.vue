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
import { useSessionStore } from '@/stores/session';

const sessionStore = useSessionStore();
const router = useRouter();

const username = ref('');
const password = ref('');

async function onSubmit () {
  const ok = await sessionStore.sessionAuthenticate(username.value, password.value);
  if (ok) {
    router.push({ name: 'sign-in-success' });
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
        <form @submit.prevent="onSubmit">
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
                :disabled="sessionStore.sessionLoading"
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
                :disabled="sessionStore.sessionLoading"
              />
            </Field>
            <Field>
              <Button :disabled="sessionStore.sessionLoading" type="submit">
                <template v-if="sessionStore.sessionLoading">
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
                Don't have an account?
                <a href="#">
                  Sign up
                </a>
              </FieldDescription>
              <FieldError v-if="sessionStore.sessionLastError" class="mt-2 text-center">
                {{ sessionStore.sessionLastError }}
              </FieldError>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
