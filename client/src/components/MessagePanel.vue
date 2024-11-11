<template>
  <div class="q-pa-md" style="height: calc(100vh - 75px); position: relative;">
    <div class="messages-container q-pa-md" style="flex-grow: 1; overflow-y: auto; height: calc(100% - 80px);" ref="message_container">
      <q-infinite-scroll @load="onLoad" reverse style="width: 100%" :scroll-target="message_container">
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" name="dots" size="40px" />
          </div>
        </template>
        <div v-for="message in channelStore.currentMessages" :key="message.id" class="caption q-py-sm">
          {{message.content}}
<!--          <q-chat-message-->
<!--            :key="message.id"-->
<!--            :name="message.name"-->
<!--            :avatar="message.avatar"-->
<!--            :text="message.content"-->
<!--            :stamp="message.stamp"-->
<!--            :sent="message.me"-->

<!--            :text-color="message.me ? 'primary' : 'white'"-->
<!--            :class="{'border-primary': !message.me, 'border-white': message.me}"-->
<!--          >-->
<!--          </q-chat-message>-->
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
    const messages = ref([
      { id: 96, name: 'me', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Hey, how are you?'], stamp: '7 minutes ago', me: true },
      { id: 97, name: 'Joe', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['@Michael are u doing fine, how r you?', 'I just feel like typing a really, really, REALLY long message to annoy you...'], stamp: '4 minutes ago', me: false },
      { id: 98, name: 'Joe', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Did it work?'], stamp: '1 minute ago', me: false },
      { id: 99, name: 'me', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['nope'], stamp: '1 minute ago', me: true }
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

        if (trimmedMessage.startsWith('/quit ')) {
          const channelName = trimmedMessage.substring(6).trim();
          const channel = channels.value.find((c) => c.name === channelName);

          if (channel) {
            const index = channels.value.indexOf(channel);

            if (index !== -1) {
              channels.value.splice(index, 1);

              $q.notify({
                type: 'info',
                message: `You have quit the channel "${channelName}".`,
                position: 'top',
                timeout: 3000,
                color: 'white',
                textColor: 'primary'
              });
            }

            text_message.value = '';
          }
          else {
            $q.notify({
              type: 'warning',
              message: `Channel: "${channelName}" not found.`,
              position: 'top',
              timeout: 3000,
              color: 'warning',
              textColor: 'white'
            });
          }
          return;
        }
        else if(trimmedMessage.startsWith('/quit')) {
          $q.notify({
            type: 'warning',
            message: 'Channel name missing.',
            position: 'top',
            timeout: 3000,
            color: 'warning',
            textColor: 'white'
          });
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
      channelStore,
      messages,
      dense: ref(false),
      sendMessage,
      onLoad,
      message_container,
      showMessage,
      accounts,
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
