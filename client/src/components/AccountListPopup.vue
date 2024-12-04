<template>
  <q-banner>
    <q-item-section>
      <q-item v-for="account in accounts || []" :key="account.id" class="q-my-sm" clickable v-ripple v-close-popup>
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white" class="relative">
            <!--<img :src="account.avatar" alt="User Avatar" />-->
            <q-badge :color="account.status === 'online' ? 'primary' : 'warning'" rounded floating />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ account.name }}</q-item-label>
          <q-item-label caption lines="1">gmail: {{ account.email }}</q-item-label>
          <q-item-label caption lines="1">status: {{ account.role ? 'admin' : 'guest' }}, {{ account.status }}{{ account.is_typing ? ', typing...' : '' }}</q-item-label>
          <!--<q-item-label caption lines="1">{{ account.is_typing ? ' hello chat i am online' : '' }}</q-item-label>-->
        </q-item-section>
      </q-item>
    </q-item-section>
  </q-banner>
</template>

<script lang="ts">
import {defineComponent, onMounted, PropType, watch} from 'vue';

import { User } from 'src/contracts';

export default defineComponent({
  name: 'AccountListPopup',
  props: {
    accounts:
      {
      type: [Array, Object, null],
      required: true,
    },
  },
  setup(props) {
    // Log accounts after the component is mounted
    onMounted(() => {
      console.log('Accounts after load:', props.accounts);
    });

    watch(
      () => props.accounts,
      (newValue) => {
        console.log('Accounts updated:', newValue);
      },
    );
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
