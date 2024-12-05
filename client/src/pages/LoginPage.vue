<template>
  <!--  Main Content  -->
  <div class="flex flex-center" style="min-height: 100vh;">
    <div class="column q-pa-xl font-weight-light login-container">
      <h1 class="font-medium q-mb-lg login-title">Log In</h1>
      <q-form @submit="onSubmit" ref="form">
        <q-input
          outlined
          v-model.trim="credentials.email"
          label="Email Address"
          type="email"
          name="email"
          class="q-mb-md"
        />
        <q-input
          outlined
          v-model="credentials.password"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          class="q-mb-sm"
        >
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              @click="showPassword = !showPassword"
              class="cursor-pointer"
            />
          </template>
        </q-input>
        <p class="text-caption q-mb-md">
          It must be a combination of minimum 8 letters, numbers, and symbols.
        </p>
        <q-btn
          unelevated
          no-caps
          color="primary"
          label="Log In"
          type="submit"
          @click="onSubmit"
          class="full-width q-py-md text-body font-medium"
          rounded
        />
      </q-form>
      <q-separator class="q-my-lg" />
      <p class="text-grey q-mt-sm">
        No account yet?
        <router-link to="/signup" class="text-primary">Sign Up</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const router = useRouter();
const credentials = reactive({ email: '', password: '' });
const showPassword = ref(false);
const isSubmitting = ref(false); // Prevent duplicate submissions

const onSubmit = async () => {
  if (isSubmitting.value) return; // Exit if already submitting
  isSubmitting.value = true;

  const loginData = {
    email: credentials.email,
    password: credentials.password,
    remember: false,
    state: 'online'
  };

  const authStore = useAuthStore();

  try {
    await authStore.login(loginData).then(() => {
      router.push('/channels');
    })
  } catch (error) {
    console.error('Login failed:', error);
    $q.notify({
      type: 'warning',
      message: 'Login failed. Check your Gmail or password',
      position: 'top',
      timeout: 3000,
      color: 'primary',
      textColor: 'white'
    });
  } finally {
    isSubmitting.value = false; // Reset flag after submission
  }
};
</script>

<style>
.login-container {
  max-width: 560px;
  width: 100%;
}

.login-title {
  font-size: 2rem;
}

@media (min-width: 600px) {
  .login-title {
    font-size: 2.5rem;
  }
}
</style>
