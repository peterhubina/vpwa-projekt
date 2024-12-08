import { defineStore } from 'pinia';
import {LoginCredentials, RegisterData, User} from 'src/contracts'
import {ref} from 'vue';
//import {useRouter} from "vue-router";
import {authManager, authService, channelService} from 'src/services';
import {useChannelStore} from 'stores/channel';
import {UserStatus} from 'stores/models';
import {api} from 'boot/axios';
//import {useChannelStore} from 'stores/channel';

export const useAuthStore = defineStore('auth', () => {

  const user = ref<User | null>(null);
  const status = ref<'pending' | 'success' | 'error'>('pending');
  const errors = ref<Array<{ message: string; field?: string }>>([]);
  const tagOnly = ref(false)

  const getStatus = async () => {
    /*const user = await api.get<any>(
      `http://localhost:3333/status/${user.value?.id}`
    )

    console.log('Status: ', status)

    userStatus.value = user.data.status*/
  }

  const toggleTagOnly = (value : boolean) => {
    tagOnly.value = value;
  };

  const userStatus = ref('online');

  const AUTH_START = () => {
    status.value = 'pending'
    errors.value = []
  }

  const AUTH_SUCCESS = (newuser: User | null) => {
    status.value = 'success'
    user.value = newuser
  }

  const AUTH_ERROR = (newerrors : any) => {
    status.value = 'error'
    errors.value = newerrors
  }

  const login = async ( credentials: LoginCredentials) => {
    try {
      AUTH_START()
      const apiToken = await authService.login(credentials)
      AUTH_SUCCESS(null)
      // save api token to local storage and notify listeners
      authManager.setToken(apiToken.token)
      //userStatus.value = getStatus()
      await useChannelStore().fetchChannels()
      return apiToken
    } catch (err) {
      AUTH_ERROR(err)
      throw err
    }
  }

  const check = async () => {
    try {
      AUTH_START()
      const user = await authService.me()
      if (user?.id !== user?.id) {
        await useChannelStore().join('general')
      }
      AUTH_SUCCESS(user)
      //setStatus('online')
      return user !== null
    } catch (err) {
      AUTH_ERROR(err)
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
      AUTH_ERROR(err)
      throw err
    }
  }

  const logout = async  () => {
    try {
      AUTH_START()

      await authService.logout()
      await useChannelStore().leave(null) // leave all channels
      AUTH_ERROR(null)
      useChannelStore().channels.forEach((channel) => {
        channelService.leave(channel.name)
      })
      // remove api token and notify listeners
      authManager.removeToken()
    } catch (err) {
      AUTH_ERROR(err)
      throw err
    }
  }

  const setStatus = async (status: UserStatus) => {
    await api.post<any>(
      'http://localhost:3333/status',
      {
        status: status,
        userId: user.value?.id,
      }
    )

    userStatus.value = status
  /*
    if(status === 'offline') {
      useChannelStore().channels.forEach((channel) => {
        channelService.leave(channel.name)
      })
    } else {
      useChannelStore().channels.forEach((channel) => {
        channelService.join(channel.name)
      })
    }*/
  }

  const fetchUser = async () => {
    try {
      AUTH_START();
      const { data } = await api.get<User>('http://localhost:3333/user'); // Replace with actual endpoint
      user.value = data;
      status.value = 'success';
      console.log('User fetched successfully:', data);
    } catch (err) {
      console.error('Error fetching user:', err);
      AUTH_ERROR(err);
    }
  };

  return { login, check, register, logout, user, setStatus, userStatus, getStatus, fetchUser, toggleTagOnly, tagOnly  }

});
