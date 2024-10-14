import { ref } from 'vue';

export const channels = ref([
  { id: 1, name: 'Channel1', description: 'Hello how u doing in this rainy day, Hello how u doing in this rainy day', admin: true, public: false, not: 'none' },
  { id: 2, name: 'Channel2', description: 'Just another day at the office!', admin: false, public: false, not: 'none' },
  { id: 3, name: 'Channel3', description: 'Team discussion on project', admin: false, public: false, not: 'message' },
  { id: 4, name: 'Channel4', description: 'What\'s your favorite movie?', admin: false, public: false, not: 'none' },
  { id: 5, name: 'Channel5', description: 'Let\'s plan the weekend getaway', admin: false, public: false, not: 'none' },
  { id: 6, name: 'Channel6', description: 'Hello how u doing in this rainy day', admin: true, public: false, not: 'invite' },
  { id: 7, name: 'Channel7', description: 'Just another day at the office!', admin: false, public: false, not: 'none' },
  { id: 8, name: 'Channel8', description: 'Team discussion on project', admin: false, public: true, not: 'none' },
  { id: 9, name: 'Channel9', description: 'What\'s your favorite movie?', admin: false, public: true, not: 'invite' },
  { id: 10, name: 'Channel10', description: 'Let\'s plan the weekend getaway', admin: false, public: true, not: 'none' },
]);
