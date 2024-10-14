<template>
  <!--  Main Content  -->
  <div class="flex flex-center" style="min-height: 100vh;">
    <div class="column q-pa-xl font-weight-light login-container">
      <h1 class="font-medium q-mb-lg login-title">Log In</h1>
      <q-form @submit="onSubmit">
        <q-input
          outlined
          v-model="email"
          label="Email Address"
          type="email"
          name="email"
          class="q-mb-md"
        />
        <q-input
          outlined
          v-model="password"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          class="q-mb-sm"
        >
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              @click="togglePasswordVisibility"
              class="cursor-pointer"
            />
          </template>
        </q-input>
        <p class="text-caption q-mb-md">
          It must be a combination of minimum 8 letters, numbers, and symbols.
        </p>
        <div class="row items-center justify-end q-mb-md">
          <router-link to="/forgot-password" class="text-primary"
          >Forgot Password?</router-link
          >
        </div>
        <q-btn
          unelevated
          no-caps
          color="primary"
          label="Log In"
          type="submit"
          class="full-width q-py-md text-body font-medium"
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

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async onSubmit() {
    },
  },
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
