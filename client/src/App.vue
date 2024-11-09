<template>
  <router-view />
</template>

<script setup lang="ts">
import { useChannelStore } from 'stores/channel';

const channelStore = useChannelStore();
channelStore.fetchChannels();

defineOptions({
  name: 'App'
});
</script>
