<template>
  <div class="full-page-grid">
    <!--  Main Content  -->
    <div class="flex flex-center items-center full-height">
      <div class="column q-pa-xl font-weight-light signup-container">
        <h1 class="font-medium signup-title q-mb-md">Sign Up</h1>
        <q-form @submit="onSubmit" ref="form">
          <q-input
            outlined
            v-model.trim="form.name"
            label="First Name"
            type="text"
            name="firstName"
            class="q-mb-md"
          />
          <q-input
            outlined
            v-model.trim="form.surname"
            label="Last Name"
            type="text"
            name="lastName"
            class="q-mb-md"
          />
          <q-input
            outlined
            v-model.trim="form.username"
            label="Nickname"
            type="text"
            name="nickname"
            class="q-mb-md"
          />
          <q-input
            outlined
            v-model.trim="form.email"
            label="Email Address"
            type="email"
            name="email"
            class="q-mb-md"
          />
          <q-input
            outlined
            v-model="form.password"
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
            v-model="form.passwordConfirmation"
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
            @click="onSubmit"
            rounded
          />
        </q-form>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent} from 'vue';
import {RouteLocationRaw} from 'vue-router';
import {useAuthStore} from 'stores/auth';
//import { useRouter } from 'vue-router'

export default defineComponent({

  data() {
    return {
      form: {
        name: '',
        surname: '',
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
      },
      showPassword: false,
    };
  },
  computed: {
    redirectTo () {
      return { name: 'login' }
    },
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    onSubmit () {
      useAuthStore().register(this.form).then(() => {
        this.$router.push('/login');
      });
    }
  },
});
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
