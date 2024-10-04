<template>
  <div class="q-pa-md row justify-center" style="flex-direction: column; height: 100vh;">
    <div style="width: 100%; max-width: 100%; flex-grow: 1; overflow-y: auto; max-height: 80vh; height: 100%">
      <q-chat-message
        v-for="(message, index) in messages"
        :key="index"
        :name="message.name"
        :avatar="message.avatar"
        :text="message.text"
        :stamp="message.stamp"
        :sent="message.me"
        :bg-color="message.me ? 'secondary' : 'primary'"
        :text-color="message.me ? 'primary' : 'white'"
        :class="{'border-primary': !message.me, 'border-white': message.me}"
      />
    </div>
    <div class="q-pa-md" style="width: 100%; max-width: 1200px; position: relative;">
      <q-input standout bottom-slots v-model="text_message" label="Write message..." counter maxlength="150" :dense="dense">
        <template v-slot:before>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" alt="">
          </q-avatar>
        </template>

        <template v-slot:append>
          <q-icon v-if="text_message !== ''" name="close" @click="text_message = ''" class="cursor-pointer" />
          <q-icon name="schedule" />
        </template>

        <template v-slot:after>
          <q-btn round dense flat icon="send" @click="sendMessage" />
        </template>
      </q-input>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const text_message = ref('');

    // Placeholder for messages
    const messages = ref([
      {
        id: 1, name: 'me', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
        text: ['hey, how are you?'],
        stamp: '7 minutes ago', me: true,
      },
      {
        id: 2, name: 'Joe', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
        text: [
          'doing fine, how r you?',
          'I just feel like typing a really, really, REALLY long message to annoy you...',
        ],
        stamp: '4 minutes ago', me: false,
      },
      {
        id: 3, name: 'Joe', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
        text: ['Did it work?'],
        stamp: '1 minute ago', me: false,
      },

    ]);

    const sendMessage = () => {
      if (text_message.value.trim()) {
        messages.value.push({
          id: messages.value.length + 1,
          name: 'me',
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          text: [text_message.value],
          stamp: 'just now',
          me: true,
        });
        text_message.value = '';
      }
    };

    return {
      text_message,
      messages,
      dense: ref(false),
      sendMessage,
    };
  },
};
</script>

<style scoped>
/* Add any specific styles you need here */
</style>
