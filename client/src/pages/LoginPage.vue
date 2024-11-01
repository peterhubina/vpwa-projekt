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
              @click="togglePasswordVisibility"
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
          :loading="loading"
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

<script lang="ts">
import { defineComponent } from 'vue'
import { RouteLocationRaw } from 'vue-router'

export default defineComponent({
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
    };
  },
  computed: {
    redirectTo (): RouteLocationRaw {
      return (this.$route.query.redirect as string) || { name: 'home' }
    },
    loading (): boolean {
      return this.$store.state.auth.status === 'pending'
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async onSubmit() {
      this.$router.push('/login' as RouteLocationRaw)
    },
  },
});
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
