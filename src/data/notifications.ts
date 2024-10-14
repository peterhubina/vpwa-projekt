import { ref } from 'vue';

export const notifications = ref([
  { id: 1, name: 'Channel1', type: 'message', description: 'Hello how u doing in this rainy day, Hello how u doing in this rainy day, Hello how u doing in this rainy day' },
  { id: 2, name: 'Channel10', type: 'kick', description: 'You have been kicked from channel' },
  { id: 3, name: 'Channel9', type: 'invite', description: 'You have been invited to channel' },
  { id: 4, name: 'Channel11', type: 'delete', description: 'Channel has been deleted' },
]);
