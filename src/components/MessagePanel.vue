<template>
  <div class="q-pa-md" style="height: calc(100vh - 75px); position: relative;">
    <div class="messages-container q-pa-md" style="flex-grow: 1; overflow-y: auto; height: calc(100% - 80px);" ref="message_container">
      <q-infinite-scroll @load="onLoad" reverse style="width: 100%" :scroll-target="message_container">
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" name="dots" size="40px" />
          </div>
        </template>
        <div v-for="(message, index) in messages" :key="index" class="caption q-py-sm">
          <q-chat-message
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
        </div>
      </q-infinite-scroll>
    </div>
    <div class="input-container">
      <q-input rounded outlined v-model="text_message" bg-color="white" label="Write message..." :dense="dense">
        <template v-slot:before>
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" alt="" />
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
    const message_container = ref('');
    const messages = ref([
      { id: 96, name: 'me', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['hey, how are you?'], stamp: '7 minutes ago', me: true },
      { id: 97, name: 'Joe', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['doing fine, how r you?', 'I just feel like typing a really, really, REALLY long message to annoy you...'], stamp: '4 minutes ago', me: false },
      { id: 98, name: 'Joe', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Did it work?'], stamp: '1 minute ago', me: false },
      { id: 99, name: 'me', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['nope'], stamp: '1 minute ago', me: true }
    ]);

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

        await nextTick(); // Wait for the DOM update

        // Scroll to the bottom of the messages container
        if (message_container.value) {
          message_container.value.scrollTop = message_container.value.scrollHeight;
        }
      }
    };

    const onLoad = (index, done) => {
      setTimeout(() => {
        messages.value.splice(0, 0,
          {id: 0, name: 'me', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Just got a new message from history!'], stamp: '2 minutes ago', me: true,},
          {id: 0, name: 'me', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Yeah, it seems so!'], stamp: '1 minute ago', me: true,},
          {id: 0, name: 'Joe', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Yeah, it seems so!'], stamp: '1 minute ago', me: false,},
          {id: 0, name: 'me', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Yeah, it seems so!'], stamp: '1 minute ago', me: true,},
          {id: 0, name: 'Joe', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Yeah, it seems so!'], stamp: '1 minute ago', me: false,},
          {id: 0, name: 'Joe', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Yeah, it seems so!'], stamp: '1 minute ago', me: false,}
        );
        done(); // Notify that loading is done
      }, 1000);
    };

    return {
      text_message,
      messages,
      dense: ref(false),
      sendMessage,
      onLoad,
      message_container,
    };
  },
};
</script>

<style>
.input-container {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  padding: 5px;
  background: white;
  z-index: 10;
  width: 100%; /* Full width */
}

.messages-container {
  overflow-y: scroll; /* Allow vertical scrolling */
}
</style>
