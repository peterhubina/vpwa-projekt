import { defineStore } from 'pinia';
import {LoginCredentials, RegisterData, User} from 'src/contracts'
import {ref} from 'vue';
//import {useRouter} from "vue-router";
import {authManager, authService} from 'src/services';

export const useAuthStore = defineStore('auth', () => {

  const user = ref<User | null>(null);
  const status = ref<'pending' | 'success' | 'error'>('pending');
  const errors = ref<Array<{ message: string; field?: string }>>([]);

  //const router = useRouter();

  const AUTH_START = () => {
    status.value = 'pending'
    errors.value = []
  }

  const AUTH_SUCCESS = (newuser: User | null) => {
    status.value = 'success'
    user.value = newuser
  }

  /*const AUTH_ERROR = (newerrors : any[]) => {
    status.value = 'error'
    errors.value = newerrors
  }*/

  const login = async ( credentials: LoginCredentials) => {
    try {
      AUTH_START()
      const apiToken = await authService.login(credentials)
      AUTH_SUCCESS(null)
      // save api token to local storage and notify listeners
      authManager.setToken(apiToken.token)
      //useChannelStore().fetchChannels()
      return apiToken
    } catch (err) {
      //AUTH_ERROR(err)
      throw err
    }
  }

  const check = async () => {
    try {
      AUTH_START()
      const user = await authService.me()
      if (user?.id !== user?.id) {
        //await useChannelStore().join('general')
      }
      AUTH_SUCCESS(user)
      //setStatus('online')
      return user !== null
    } catch (err) {
      //AUTH_ERROR(err)
      throw err
    }
  }

  const register = async (form: RegisterData) => {
    try {
      AUTH_START()
      const user = await authService.register(form)
      AUTH_SUCCESS(user)
      return user
    } catch (err) {
      //AUTH_ERROR(err)
      throw err
    }
  }

  return { login, check, register }

});
