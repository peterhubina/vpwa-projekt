<template>
  <q-banner>
    <q-item-section>
      <q-item v-for="account in accounts || []" :key="account.id" class="q-my-sm" clickable v-ripple v-close-popup>
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white" class="relative">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" alt="User Avatar" />
            <q-badge
              :color="account.status === 'online' ? 'primary' : (account.status === 'offline' ? 'grey' : 'warning')"
              rounded
              floating
            />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ account.username }}</q-item-label>
          <q-item-label caption lines="1">gmail: {{ account.email }}</q-item-label>
          <q-item-label caption lines="1">role: {{ account.id === authStore.user?.id ? 'admin' : 'guest' }}, {{ account.status }}{{ account.is_typing ? ', typing...' : '' }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-item-section>
  </q-banner>
</template>

<script lang="ts">
import {defineComponent, onMounted, PropType, watch} from 'vue';
import {useAuthStore} from 'stores/auth';

import { User } from 'src/contracts';



export default defineComponent({
  name: 'AccountListPopup',
  props: {
    accounts: {
      type: [Array, Object, null],
      required: true,
    },
    channel: {
      type: [Object, null],
      required: true,
      default: () => null,
    },
  },
  setup(props) {
    // Log accounts after the component is mounted
    onMounted(() => {
      console.log('Accounts after load:', props.accounts);
    });

    const authStore = useAuthStore();

    watch(
      () => props.accounts,
      (newValue) => {
        console.log('Accounts updated:', newValue);
      },
    );

    return {authStore}
  }})
</script>

<style scoped>
.relative {
  position: relative;
}
.q-badge {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
