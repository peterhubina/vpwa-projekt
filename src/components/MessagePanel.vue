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
  </div>
</template>

<script>
import {ref, nextTick, inject} from 'vue';
import { useQuasar } from 'quasar';
//import ChannelMembersAlert from "*.vue";

export default {
  setup() {
    const $q = useQuasar();
    const text_message = ref('');
    const message_container = ref('');
    const messages = ref([
      { id: 96, name: 'me', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['hey, how are you?'], stamp: '7 minutes ago', me: true },
      { id: 97, name: 'Joe', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['doing fine, how r you?', 'I just feel like typing a really, really, REALLY long message to annoy you...'], stamp: '4 minutes ago', me: false },
      { id: 98, name: 'Joe', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['Did it work?'], stamp: '1 minute ago', me: false },
      { id: 99, name: 'me', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: ['nope'], stamp: '1 minute ago', me: true }
    ]);

    const channels = inject('channels');
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
          }
          else {
            $q.notify({
              type: 'warning',
              message: `Channel: "${channelName}" not found.`,
              position: 'top',
              timeout: 3000,
              color: 'secondary',
              textColor: 'primary'
            });
          }
          text_message.value = '';
          return;
        }

        messages.value.push({id: messages.value.length + 1, name: 'me', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', text: [text_message.value], stamp: 'just now', me: true,});
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
    /*
    const handleSubmit = (text) => {
      const joinMatch = text.value
        .trim()
        .match(/^\/join\s+([^[\]]+?)\s*(private)?$/);
      const quitMatch = text.value.trim().match(/^\/quit$/);
      const cancelMatch = text.value.trim().match(/^\/cancel$/);
      const listMatch = text.value.trim().match(/^\/list$/);
      const inviteMatch = text.value.trim().match(/^(\/invite)\s(\w+)$/);
      const revokeMatch = text.value.trim().match(/^(\/revoke)\s(\w+)$/);
      const kickMatch = text.value.trim().match(/^(\/kick)\s(\w+)$/);

      if (joinMatch) {
        channelStore.joinChannel(joinMatch[1], joinMatch[2] === 'private');
        if (channelStore.currentChannel != null)
          channelStore.sendMessage(channelStore.currentChannel, 'User has joined the channel');
      } else if (quitMatch && channelStore.currentChannel) {
        channelStore.removeChannel(channelStore.currentChannel);
      } else if (cancelMatch && channelStore.currentChannel) {
        channelStore.sendMessage(channelStore.currentChannel, 'User has left the channel');
        channelStore.leaveChannel(channelStore.currentChannel);
      } else if (inviteMatch && channelStore.currentChannel) {
        channelStore.sendMessage(channelStore.currentChannel, 'User has been invited to the channel');
        channelStore.inviteUser(channelStore.currentChannel, inviteMatch[2]);
      } else if (revokeMatch && channelStore.currentChannel) {
        channelStore.removeUser(channelStore.currentChannel, revokeMatch[2]);
      } else if (kickMatch && channelStore.currentChannel) {
        channelStore.sendMessage(channelStore.currentChannel, 'User has been kicked from the channel');
        channelStore.removeUser(channelStore.currentChannel, kickMatch[2]);
      } else if (listMatch) {
        // channelStore.listChannels();
        $q.dialog({

          component: ChannelMembersAlert,
        });
      } else if (channelStore.currentChannel) {
        channelStore.sendMessage(channelStore.currentChannel, text.value);
      }
      text.value = '';
    };*/

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
  width: 100%;
}

.messages-container {
  overflow-y: scroll;
}

.text-padding {
  padding-left: 16px;
}
</style>
