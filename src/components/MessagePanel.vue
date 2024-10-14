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
    const messagesContainer = ref(null);
    const loadingComplete = ref(false); // To control if more messages should be loaded

    const messages = ref([
      { id: 1, name: 'me', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['hey, how are you?'], stamp: '7 minutes ago', me: true },
      { id: 2, name: 'Joe', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['doing fine, how r you?', 'I just feel like typing a really, really, REALLY long message to annoy you...'], stamp: '4 minutes ago', me: false },
      { id: 3, name: 'Joe', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Did it work?'], stamp: '1 minute ago', me: false },
      { id: 4, name: 'me', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['nope'], stamp: '1 minute ago', me: true },
    ]);

    const onLoad = (index, done) => {
      if (loadingComplete.value) {
        done();
        return;
      }
      setTimeout(() => {
        const moreMessages =
          [
            {id: messages.value.length + 1, name: 'me', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Old message 1'], stamp: '10 minutes ago', me: true},
            {id: messages.value.length + 2, name: 'Joe', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Old message 2'], stamp: '12 minutes ago', me: false},
            {id: messages.value.length + 3, name: 'me', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Old message 3'], stamp: '12 minutes ago', me: true},
            {id: messages.value.length + 4, name: 'Joe', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Old message 4'], stamp: '12 minutes ago', me: false},
            {id: messages.value.length + 5, name: 'me', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Old message 5'], stamp: '12 minutes ago', me: true},
            {id: messages.value.length + 6, name: 'Joe', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Old message 6'], stamp: '12 minutes ago', me: false},
            {id: messages.value.length + 7, name: 'me', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Old message 7'], stamp: '12 minutes ago', me: true},
            {id: messages.value.length + 8, name: 'Joe', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Old message 8'], stamp: '12 minutes ago', me: false},
        ];
        if (moreMessages.length === 0) {loadingComplete.value = true;}
        else {messages.value.unshift(...moreMessages);}

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

        await nextTick();
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
      loadingComplete,
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
