<template>
  <div class="q-pa-md" style="height: calc(100vh - 75px); position: relative;">
    <div class="messages-container q-pa-md" style="flex-grow: 1; overflow-y: auto; height: calc(100% - 80px);" ref="message_container" @scroll="onScroll">
      <q-infinite-scroll reverse style="width: 100%" debounce="500" :scroll-target="scrollTarget" @load="loadMessages">
        <template v-slot:loading>
          <div v-if="loading" class="row justify-center q-my-md">
            <q-spinner-dots color="primary" name="dots" size="40px" />
          </div>
        </template>
        <div v-for="message in (channelStore.currentMessages || []).slice(0, limit).reverse()" :key="message.id" class="caption q-py-sm">
          <q-chat-message
            :bg-color="message.content.includes('@'+ authStore.user?.username) ? 'warning' : 'primary'"
            :key="message.id"
            :name="message.author.username === authStore.user?.username ? 'You' : message.author.username"
            avatar="https://cdn.quasar.dev/img/boy-avatar.png"
            :text="[message.content]"
            text-color="white"
            :sent="message.author.username === authStore.user?.username">
            <div>{{message.content}}</div>
          </q-chat-message>
        </div>
        <div>
          <div v-for="typingInfo in channelStore.currentChannel?.is_typing || []" :key="typingInfo.user.id" class="caption q-py-sm">
            <q-chat-message
              :bg-color="'secondary'"
              :name="typingInfo.user.username"
              avatar="https://cdn.quasar.dev/img/boy-avatar.png"
              text-color="black"
              :text="[typingInfo.message || 'Typing...']"
            >
              <template v-if="typingInfo.message">
                <q-spinner-dots size="2rem" />
              </template>
            </q-chat-message>
            <q-popup-proxy v-model:showing="showMessage" transition-show="scale" transition-hide="scale">
              <div class="q-pa-md bg-primary text-white" style="width: auto;">
                <div class="text-subtitle2">{{typingInfo.message}}</div>
              </div>
            </q-popup-proxy>
          </div>
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
      <AccountListPopup :accounts="resolvedAccounts" />
    </q-dialog>
  </div>
</template>

<script lang="ts">
import {ref, nextTick, inject, computed, onUpdated, watch} from 'vue';
import { useQuasar } from 'quasar';
import AccountListPopup from 'components/AccountListPopup.vue';
import {useChannelStore} from 'stores/channel';
import {useAuthStore} from 'stores/auth';
import {User} from 'src/contracts';
import {UserStatus} from 'stores/models';
import activityService from 'src/services/ActivityService';
import channelService from 'src/services/ChannelService';

export default {
  components: {
    AccountListPopup,
  },
  setup() {
    const $q = useQuasar();
    const text_message = ref('');
    const message_container = ref<HTMLElement | null>(null);
    const showMessage = ref(true);
    const showAccountList = ref(false);
    const channelStore = useChannelStore();
    const authStore = useAuthStore();
    const resolvedAccounts = ref<User[]>([])
    const scrollTarget = computed(() => message_container.value || undefined);
    const messages = ref([
    ]);
    const limit = ref(10);
    const loading = ref(false);

    const state = computed(() => authStore.userStatus);

    watch(state, (newValue) => {
      console.log('state change: ', newValue)
      changeStatus()
    });

    const onScroll = async () => {
      if (message_container.value?.scrollTop === 0 && limit.value < channelStore.currentMessages.length) {
        loading.value = true;  // Show the loading spinner

        const currentScrollPosition = message_container.value.scrollTop;
        const currentHeight = message_container.value.scrollHeight;

        await new Promise(resolve => setTimeout(resolve, 1000));
        limit.value += 10;

        nextTick(() => {
          if (message_container.value) {
            const newHeight = message_container.value.scrollHeight;
            message_container.value.scrollTop = newHeight - currentHeight + currentScrollPosition;
          }
        });

        loading.value = false;  // Hide the loading spinner after function completes
      }
    };

    const fetchUsers = async () => {
      resolvedAccounts.value = await channelStore.fetchUsersInChannel(
        channelStore.currentChannel?.name || 'Slack'
      );

      console.log('Fetched Accounts:', resolvedAccounts.value);
    };
    /*
    const scrollToStart = () => {
      if (message_container.value) {
        message_container.value.scrollTop = 0;
      }
    };*/

    const changeStatus = () => {
      console.log(state.value);
      authStore.setStatus(state.value as UserStatus);

      if (state.value === 'offline' && authStore.user) {
        console.log('User is offline');
        activityService.offline(authStore.user);
        unsubscribeFromSockets();
      } else if (state.value === 'online' && authStore.user) {
        console.log('User is online');
        activityService.online(authStore.user);
        subscribeToSockets();
      }
    };

    const subscribeToSockets = async () => {
      console.log('Subscribing to sockets...');
      await channelStore.fetchChannels()
      /*
      for (const channel of channelStore.channels) {
        if (!channelService.in(channel.name)) {
          console.log('Loading messages for channel:', channel.name);

          try {
            const messages = await channelService.join(channel.name).loadMessages(); // Await the messages

            // Use the channel name as the key for currentMessages
            if (channelStore.currentChannel && channelStore.currentChannel.name === channel.name) {
              console.log('Channel:', channelStore.currentChannel, ', Messages:', messages);

              const channelName = channelStore.currentChannel.name;
              if (channelName) {
                channelStore.messages[channelName] = messages; // Assign resolved messages to the store
              }
            }

            console.log('Messages after load:', messages);
          } catch (error) {
            console.error('Error loading messages for channel:', channel.name, error);
          }
        }
      }
       */
    };


    const unsubscribeFromSockets = () => {
      console.log('Unsubscribing from sockets...');
      channelStore.channels.forEach(channel => {
        channelService.leave(channel.name);
      });
    };

    const channels = channelStore.channels;
    console.log('channels: ', channels);

    console.log('Current messages: ', channelStore.currentMessages)

    const sendMessage = async () => {
      if (text_message.value) {
        const trimmedMessage = text_message.value.trim();

        if (trimmedMessage.startsWith('/quit ')) {
          const channelName = trimmedMessage.substring(6).trim();
          const channel = channels.find(c => c.name === channelName);

          if (channel) {
            const index = channels.indexOf(channel);

            if (index !== -1) {
              channels.splice(index, 1);

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
          await fetchUsers();
          showAccountList.value = true; // Open the dialog
          text_message.value = '';
          return;
        } else if(trimmedMessage.startsWith('/join')) {
          const joinMatch = text_message.value
            .trim()
            .match(/^\/join\s+([^[\]]+?)\s*(private)?$/);
          if(joinMatch != null) {
            channelStore.joinChannel(joinMatch[1], joinMatch[2] === 'private');
            await channelStore.fetchChannels();
            console.log(channelStore.channels);
          }
        } else if(trimmedMessage.startsWith('/cancel')) {
          console.log('Current: ', channelStore.currentChannel)
          if (channelStore.currentChannel) {
            channelStore.sendMessage(channelStore.currentChannel, 'User has left the channel');
            channelStore.leaveChannel(channelStore.currentChannel);
          }
        } else if (trimmedMessage.startsWith('/invite')) {
          if (channelStore.currentChannel) {
            channelStore.sendMessage(channelStore.currentChannel, 'User has been invited to the channel');
            channelStore.inviteUser(channelStore.currentChannel, trimmedMessage[2]);
          }
        } else if (trimmedMessage.startsWith('/revoke')) {
          if (channelStore.currentChannel) {
            channelStore.removeUser(channelStore.currentChannel, trimmedMessage[2]);
          }
        } else if (channelStore.currentChannel) {
          if (channelStore.currentChannel) {
            channelStore.sendMessage(channelStore.currentChannel, trimmedMessage);
            console.log('Message: ', trimmedMessage);
          }
        }

        text_message.value = '';

        await nextTick();

        if (message_container.value) {
          limit.value += 1;
          message_container.value.scrollTop = message_container.value.scrollHeight;
        }
      }
    };

    /*const onLoad = (index, done) => {
      setTimeout(() => {
        messages.value.splice(0, 0,
          );
        done(); // Notify that loading is done
      }, 1000);
    };*/

    const n = ref(15)

    async function loadMessages(index: number, done: () => void) {
      const channelStore = useChannelStore();
      console.log('loading data')

      if (channelStore.currentChannel === null) {
        done();
        return;
      }

      n.value += 15
      await channelStore.getMessages(channelStore.currentChannel, n.value)

    }


    const initialScrollDone = ref(false);

    onUpdated(() => {
      if (!initialScrollDone.value && message_container.value) {
        setTimeout(() => {
          if (message_container.value) {
            message_container.value.scrollTop = message_container.value.scrollHeight;
            initialScrollDone.value = false; // Mark as done
          }
        }, 50); // Small delay to ensure DOM updates are fully processed
      }
    });

    return {
      text_message,
      channelStore,
      messages,
      dense: ref(false),
      sendMessage,
      message_container,
      showMessage,
      resolvedAccounts,
      authStore,
      AccountListPopup,
      showAccountList,
      fetchUsers,
      scrollTarget,
      limit,
      onScroll,
      loading,
      loadMessages,
      initialScrollDone,
      changeStatus
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
