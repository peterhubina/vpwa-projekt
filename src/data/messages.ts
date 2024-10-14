import { ref } from 'vue';

export const messages = ref([
  { id: 1, name: 'me', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['hey, how are you?'], stamp: '7 minutes ago', me: true },
  { id: 2, name: 'Joe', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['doing fine, how r you?', 'I just feel like typing a really, really, REALLY long message to annoy you...'], stamp: '4 minutes ago', me: false },
  { id: 3, name: 'Joe', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Did it work?'], stamp: '1 minute ago', me: false },
  { id: 4, name: 'me', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['nope'], stamp: '1 minute ago', me: true },
]);
