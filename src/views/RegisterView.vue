<script lang="ts" setup>
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
import Input from '@/components/ui/input/Input.vue';

</script>

<template>
  <div class="w-full max-w-md">
    <Card>
      <CardHeader class="text-center">
        <CardTitle class="text-xl">
          Create your account
        </CardTitle>
        <CardDescription>
          Complete the form below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
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
              />
              <!-- <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription> -->
            </Field>
            <Field>
              <Field class="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel for="new-password">
                    Password
                  </FieldLabel>
                  <Input id="new-password" name="new-password" type="password" required autocomplete="new-password"/>
                </Field>
                <Field>
                  <FieldLabel for="confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <Input id="confirm-password" name="confirm-password" type="password" required autocomplete="new-password"/>
                </Field>
              </Field>
              <!-- <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription> -->
            </Field>
            <Field>
              <Button type="submit">
                Create Account
              </Button>
              <FieldDescription class="text-center">
                Already have an account? <a href="#">Sign in</a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
    <!-- <FieldDescription class="px-6 text-center">
      By clicking continue, you agree to our <a href="#">Terms of Service</a>
      and <a href="#">Privacy Policy</a>.
    </FieldDescription> -->
  </div>
</template>
