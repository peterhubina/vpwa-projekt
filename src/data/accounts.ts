import { ref } from 'vue';

export const accounts = ref([
  { id: 1, name: 'Joe', gmail: 'joe.garfield@gmail.com', admin: true, status: 'online', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', is_typing: false, kick_votes: '0' },
  { id: 2, name: 'Alex', gmail: 'alex.gordon@gmail.com', admin: false, status: 'online', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', is_typing: true, kick_votes: '2' },
  { id: 3, name: 'Marco', gmail: 'marco.polo@gmail.com', admin: false, status: 'online', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', is_typing: false, kick_votes: '0' },
  { id: 4, name: 'Clement', gmail: 'clement.gotwald@gmail.com', admin: false, status: 'offline', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', is_typing: false, kick_votes: '1' },
  { id: 5, name: 'Peter', gmail: 'peter.parker@gmail.com', admin: false, status: 'offline', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', is_typing: false, kick_votes: '0' },
]);
