<template>
  <div class="q-pa-md" style="height: calc(100vh - 75px); position: relative;">
    <div class="messages-container q-pa-md" style="flex-grow: 1; overflow-y: auto; height: calc(100% - 80px);" ref="message_container">
      <q-infinite-scroll @load="onLoad" reverse style="width: 100%" :scroll-target="message_container">
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" name="dots" size="40px" />
          </div>
        </template>
        <div
            v-for="message in channelStore.currentMessages.slice().reverse()"
            :key="message.id"
            class="caption q-py-sm"
        >
          <q-chat-message
              :bg-color="message.content.includes('@' + authStore.user?.username) ? 'warning' : 'primary'"
              :name="message.author.username === authStore.user?.username ? 'You' : message.author.username"
              avatar="https://cdn.quasar.dev/img/boy-avatar.png"
              :text="message.content"
              text-color="white"
              :sent="message.author.username === authStore.user?.username"
          >
            <div>{{ message.content }}</div>
          </q-chat-message>
        </div>
        <div>
          <!--<q-chat-message
            bg-color="primary"
            name="Joe"
            text-color="white"
            avatar="https://cdn.quasar.dev/img/boy-avatar.png"
            @click="showMessage = true"
          >
            <q-spinner-dots size="2rem" />
          </q-chat-message>-->

          <q-popup-proxy v-model:showing="showMessage" transition-show="scale" transition-hide="scale">
            <div class="q-pa-md bg-primary text-white" style="width: auto;">
              <div class="text-subtitle2">Hello Michael I have a question for you, can y...</div>
            </div>
          </q-popup-proxy>
        </div>
      </q-infinite-scroll>
    </div>
    <div class="input-container">
      <q-input
        rounded
        outlined
        v-model="text_message"
        bg-color="white"
        placeholder="Write a message"
        :dense="dense"
        input-class="text-padding"
        @keyup.enter="sendMessage"
      >
        <template v-slot:append>
          <q-icon
            v-if="text_message !== ''"
            name="close"
            @click="text_message = ''"
            class="cursor-pointer"
          />
          <q-icon name="schedule" />
        </template>
        <template v-slot:after>
          <q-btn round dense flat icon="send" @click="sendMessage" />
        </template>
      </q-input>
    </div>
    <q-dialog v-model="showAccountList">
      <AccountListPopup :accounts="accounts" />
    </q-dialog>
  </div>
</template>

<script>
import {ref, nextTick, inject} from 'vue';
import { useQuasar } from 'quasar';
import AccountListPopup from 'components/AccountListPopup.vue';
import {useChannelStore} from 'stores/channel';
import {useAuthStore} from 'stores/auth';

export default {
  components: {
    AccountListPopup,
  },
  setup() {
    const $q = useQuasar();
    const text_message = ref('');
    const message_container = ref('');
    const showMessage = ref(true);
    const showAccountList = ref(false);
    const channelStore = useChannelStore();
    const authStore = useAuthStore();

    const messages = ref([

    ]);

    const accounts = ref([
      { id: 1, name: 'Joe', gmail: 'joe.garfield@gmail.com', admin: true, status: 'online', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', is_typing: false, kick_votes:'0'},
      { id: 2, name: 'Alex', gmail: 'alex.gordon@gmail.com', admin: false, status: 'online', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', is_typing: true, kick_votes:'2'},
      { id: 3, name: 'Marco', gmail: 'marco.polo@gmail.com', admin: false, status: 'online', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', is_typing: false, kick_votes:'0'},
      { id: 4, name: 'Clement', gmail: 'clement.gotwald@gmail.com', admin: false, status: 'offline', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', is_typing: false, kick_votes:'1'},
      { id: 5, name: 'Peter', gmail: 'peter.parker@gmail.com', admin: false, status: 'offline', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', is_typing: false, kick_votes:'0'},
    ]);

    const channels = inject('channels');

    console.log('Current messages: ', channelStore.currentMessages)

    const sendMessage = async () => {
      if (text_message.value) {
        const trimmedMessage = text_message.value.trim();


        if(trimmedMessage.startsWith('/quit')) {
          console.log('Current: ', channelStore.currentChannel)
          channelStore.leaveChannel(channelStore.currentChannel);
          text_message.value = '';
          return;
        }
        else if(trimmedMessage.startsWith('/list')) {
          showAccountList.value = true; // Open the dialog
          text_message.value = '';
          return;
        } else if(trimmedMessage.startsWith('/join')) {
          const joinMatch = text_message.value
            .trim()
            .match(/^\/join\s+([^[\]]+?)\s*(private)?$/);
          channelStore.joinChannel(joinMatch[1], joinMatch[2] === 'private')

        } else if(trimmedMessage.startsWith('/cancel')) {
          console.log('Current: ', channelStore.currentChannel)
          channelStore.sendMessage(channelStore.currentChannel, 'User has left the channel');
          channelStore.leaveChannel(channelStore.currentChannel);
        } else if (trimmedMessage.startsWith('/invite')) {
            channelStore.sendMessage(channelStore.currentChannel, 'User has been invited to the channel');
            channelStore.inviteUser(channelStore.currentChannel, trimmedMessage[2]);
          } else if (trimmedMessage.startsWith('/revoke')) {
            channelStore.removeUser(channelStore.currentChannel, trimmedMessage[2]);
        } else if (channelStore.currentChannel) {
          channelStore.sendMessage(channelStore.currentChannel, trimmedMessage);
          console.log('Message: ', trimmedMessage);
        }

        text_message.value = '';
        await nextTick();

        if (message_container.value) {
          message_container.value.scrollTop = message_container.value.scrollHeight;
        }
      }
    };

    const onLoad = (index, done) => {
      setTimeout(() => {
        messages.value.splice(0, 0,
          );
        done(); // Notify that loading is done
      }, 1);
    };

    return {
      text_message,
      channelStore,
      messages,
      dense: ref(false),
      sendMessage,
      onLoad,
      message_container,
      showMessage,
      accounts,
      authStore,
      AccountListPopup,
      showAccountList,
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
  width: 100%;
}

.messages-container {
  overflow-y: scroll;
}
</style>
