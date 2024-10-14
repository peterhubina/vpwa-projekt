<template>
  <div class="q-pa-md row justify-center" style="height: calc(100vh - 75px); position: relative;">
    <div class="messages-container" ref="messagesContainer" style="flex-grow: 1; overflow-y: auto;">
      <q-infinite-scroll @load="onLoad" reverse style="width: 100%">
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" name="dots" size="40px" />
          </div>
        </template>
        <q-chat-message
          v-for="message in messages"
          :key="message.id"
          :name="message.name"
          :avatar="message.avatar"
          :text="message.text"
          :stamp="message.stamp"
          :sent="message.me"
          :bg-color="message.me ? 'secondary' : 'primary'"
          :text-color="message.me ? 'primary' : 'white'"
          :class="{'border-primary': !message.me, 'border-white': message.me}"
        />
      </q-infinite-scroll>
    </div>
    <div class="input-container">
      <q-separator />
      <q-input rounded outlined v-model="text_message" bg-color="white" label="Write message..." counter maxlength="150" :dense="dense">
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
import { ref, nextTick } from 'vue';

export default {
  setup() {
    const text_message = ref('');
    const messagesContainer = ref(null); // Reference to the container

    const messages = ref([
      { id: 1, name: 'me', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['hey, how are you?'], stamp: '7 minutes ago', me: true },
      { id: 2, name: 'Joe', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['doing fine, how r you?', 'I just feel like typing a really, really, REALLY long message to annoy you...'], stamp: '4 minutes ago', me: false },
      { id: 3, name: 'Joe', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Did it work?'], stamp: '1 minute ago', me: false },
      { id: 4, name: 'me', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['nope'], stamp: '1 minutes ago', me: true },
      { id: 5, name: 'Joe', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Did it work?'], stamp: '1 minute ago', me: false },
      { id: 6, name: 'me', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['hey, how are you?'], stamp: '7 minutes ago', me: true },
      { id: 7, name: 'Joe', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['doing fine, how r you?', 'I just feel like typing a really, really, REALLY long message to annoy you...'], stamp: '4 minutes ago', me: false },
      { id: 8, name: 'Joe', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Did it work?'], stamp: '1 minute ago', me: false },
      { id: 9, name: 'me', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['nope'], stamp: '1 minutes ago', me: true },
      { id: 10, name: 'Joe', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Did it work?'], stamp: '1 minute ago', me: false },
      { id: 11, name: 'me', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Message1'], stamp: '1 minute ago', me: true },
      { id: 12, name: 'Joe', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Message2'], stamp: '1 minute ago', me: false },
      { id: 13, name: 'me', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Message3'], stamp: '1 minute ago', me: true },
      { id: 14, name: 'Joe', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Message4'], stamp: '1 minute ago', me: false },
      { id: 15, name: 'me', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Message5'], stamp: '1 minute ago', me: true },
      { id: 16, name: 'Joe', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Message6'], stamp: '1 minute ago', me: false },
      { id: 17, name: 'me', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Message7'], stamp: '1 minute ago', me: true },
      { id: 18, name: 'Joe', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Message8'], stamp: '1 minute ago', me: false },
      { id: 19, name: 'me', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Message9'], stamp: '1 minute ago', me: true },
      { id: 20, name: 'Joe', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Message10'], stamp: '1 minute ago', me: false },
      { id: 21, name: 'me', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Message11'], stamp: '1 minute ago', me: true },
    ]);

    const visibleMessages = ref([]);
    let currentIndex = 0; // To keep track of loaded messages

    const onLoad = (index, done) => {
      setTimeout(() => {
        // Load the next 7 messages
        const nextMessages = messages.value.slice(currentIndex, currentIndex + 7);
        visibleMessages.value.push(...nextMessages);
        currentIndex += nextMessages.length;

        done();
      }, 2000);
    };

    const sendMessage = async () => {
      if (text_message.value) {
        messages.value.push({
          id: messages.value.length + 1,
          name: 'me',
          avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
          text: [text_message.value],
          stamp: 'just now',
          me: true,
        });
        text_message.value = '';

        await nextTick(); // Wait for the DOM to update
        scrollToBottom();
      }
    };

    const scrollToBottom = () => {
      const container = messagesContainer.value;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    };

    return {
      text_message,
      messages,
      dense: ref(false),
      sendMessage,
      messagesContainer,
      onLoad,

    };
  },
};
</script>

<style scoped>
.messages-container {
  height: calc(100vh - 170px);
  overflow-y: auto;
  margin-bottom: 10px;
}

.input-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 85px;
  padding: 10px;
  background: white;
  z-index: 10;
}
</style>
