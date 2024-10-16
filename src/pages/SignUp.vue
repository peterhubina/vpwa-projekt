<template>
  <div class="full-page-grid">
    <!--  Main Content  -->
    <div class="flex flex-center items-center full-height">
      <div class="column q-pa-xl font-weight-light signup-container">
        <h1 class="font-medium signup-title q-mb-md">Sign Up</h1>
        <q-form @submit="onSubmit">
          <q-input
            outlined
            v-model="firstName"
            label="First Name"
            type="text"
            name="firstName"
            class="q-mb-md"
          />
          <q-input
            outlined
            v-model="lastName"
            label="Last Name"
            type="text"
            name="lastName"
            class="q-mb-md"
          />
          <q-input
            outlined
            v-model="nickname"
            label="Nickname"
            type="text"
            name="nickname"
            class="q-mb-md"
          />
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
          <q-input
            outlined
            v-model="passwordRepeated"
            label="Password Repeated"
            :type="showPassword ? 'text' : 'password'"
            class="q-mb-md"
          >
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                @click="togglePasswordVisibility"
                class="cursor-pointer"
              />
            </template>
          </q-input>
          <div class="row items-center q-mb-md">
            <router-link to="/login" class="text-primary"
            >Already have an account?</router-link
            >
          </div>
          <q-btn
            unelevated
            no-caps
            color="primary"
            label="Sign Up"
            type="submit"
            class="full-width q-py-md font-weight-medium"
            rounded
          />
        </q-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      firstName: '',
      lastName: '',
      nickname: '',
      email: '',
      password: '',
      passwordRepeated: '',
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
.full-page-grid {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.full-height {
  height: 100%;
}

.signup-container {
  width: 100%;
}

.signup-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 600px) {
  .signup-container {
    max-width: 560px;
  }

  .signup-title {
    font-size: 2.25rem;
    margin-bottom: 2.5rem;
  }
}
</style>
