<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer"/>
        <q-toolbar-title>{{currentChannelName}}</q-toolbar-title>
        <div class="q-pa-md row q-gutter-md">
          <q-btn color="primary" style="border-radius: 150px; width: 40px; height: 40px; padding: 0;" icon="notifications">
            <q-badge color="red" floating style="border-radius: 12px;">{{ notifications.length }}</q-badge>
            <q-popup-proxy>
              <q-banner>
                <q-toolbar class="bg-primary text-white shadow-2">
                  <q-avatar color="primary" text-color="white">
                    <q-icon name="notifications" />
                  </q-avatar>
                  <q-toolbar-title>Notifications</q-toolbar-title>
                  <div class="q-pa-md q-gutter-lg">
                    <q-toggle
                      v-model="Tag_Only"
                      checked-icon="check"
                      color="white"
                      icon-color="primary"
                      unchecked-icon="clear"
                      label="Tag Only"
                      left-label
                    />
                  </div>
                </q-toolbar>
                <q-item v-for="notification in notifications" :key="notification.id" class="q-my-sm" clickable v-ripple v-close-popup>
                  <q-item-section avatar>
                    <q-avatar color="primary" text-color="white">
                      <q-icon name="discord" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ notification.name }} - {{ notification.type }} - By: Joe</q-item-label>
                    <q-item-label caption lines="1">{{ notification.description }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-banner>
            </q-popup-proxy>
          </q-btn>
          <q-btn color="primary" style="border-radius: 150px; width: 40px; height: 40px; padding: 0;" icon="discord">
            <q-popup-proxy>
              <q-banner>
                <q-toolbar class="bg-primary text-white shadow-2">
                  <q-avatar color="primary" text-color="white">
                    <q-icon name="discord" />
                  </q-avatar>
                  <q-toolbar-title class="channel-connection">Channel Connection</q-toolbar-title>
                </q-toolbar>
                <q-item style="display: flex; flex-direction: column;">
                  <q-expansion-item
                    icon="add"
                    label="Create Channel"
                    default-closed
                    header-class="text-primary">
                    <q-card>
                      <div>
                        <q-input
                          ref="ChannelNameCreate"
                          rounded outlined bg-color="white"
                          label="Channel Name"
                          lazy-rules
                          v-model="inputContent"
                          style="margin-bottom: 10px;"
                        />
                        <q-btn color="primary" label="Create" @click="createChannel" icon="add" push size="md" v-close-popup style="border-radius: 30px;"/>
                        <q-toggle
                          :label="`${blueModel}`"
                          false-value=false
                          true-value=true
                          color="primary"
                          keep-color
                          v-model="isPrivate"
                        />
                      </div>
                    </q-card>
                  </q-expansion-item>
                </q-item>
                <q-separator />
                <q-item style="display: flex; flex-direction: column;">
                  <q-expansion-item
                    icon="search"
                    label="Join Channel"
                    default-closed
                    header-class="text-primary">
                    <q-card>
                      <q-input
                        rounded outlined bg-color="white"
                        ref="ChannelNameJoin"
                        label="Channel Name"
                        lazy-rules
                        v-model="inputContent"
                        style="margin-bottom: 10px;"
                      />
                      <q-btn color="primary" @click="joinChannel" label="Join" icon="search" push size="md" v-close-popup style="border-radius: 30px;"/>
                    </q-card>
                  </q-expansion-item>
                </q-item>

              </q-banner>
            </q-popup-proxy>
          </q-btn>
          <q-btn color="primary" style="border-radius: 150px; width: 40px; height: 40px; padding: 0;" icon="account_circle">
            <q-popup-proxy>
              <q-banner>
                <q-toolbar class="bg-primary text-white shadow-2">
                  <q-avatar color="primary" text-color="white">
                    <q-icon name="account_circle" />
                  </q-avatar>
                  <q-toolbar-title>User Info</q-toolbar-title>
                </q-toolbar>
                <div class="row no-wrap q-pa-md">
                  <div class="column">
                    <div class="text-subtitle1 q-mb-sm">Name: {{ authStore.user?.username || 'N/A' }}</div>
                    <div class="text-subtitle1 q-mb-lg">Gmail: {{ authStore.user?.email || 'N/A' }}</div>
                    <div>
                      <q-btn-toggle
                        v-model="state"
                        class="my-custom-toggle"
                        no-caps
                        rounded
                        unelevated
                        toggle-color="primary"
                        color="white"
                        text-color="primary"
                        :options="[
                          { label: 'Online', value: 'online' },
                          { label: 'DND', value: 'dnd' },
                          { label: 'Offline', value: 'offline' }]"
                        @update:model-value="changeStatus"
                      />
                    </div>
                  </div>
                  <q-separator vertical inset class="q-mx-lg" />
                  <div class="column items-center">
                    <q-avatar size="72px" class="q-mb-md">
                      <img src="https://cdn.quasar.dev/img/boy-avatar.png" alt="" />
                    </q-avatar>
                    <q-btn
                      color="warning"
                      label="Logout"
                      push
                      size="md"
                      v-close-popup
                      style="border-radius: 30px;"
                      @click="logout"
                    />
                  </div>
                </div>
              </q-banner>
            </q-popup-proxy>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>

      <q-list>
        <q-item class="no-padding" v-for="channel in channelStore.channels.slice().reverse()" clickable
                :to="`/channels/${channel.id}`" :key="channel.name" style="display: flex; flex-direction: column;">
          <q-item class="q-px-md q-py-lg" clickable v-ripple>
            <q-item-section side>
              <q-icon name="discord" class="text-blue"/>
            </q-item-section>


            <q-item-section>
              <q-item-label>
                {{channel.name }}
                <!--<q-badge v-if="channel.isNew" color='warning' text-color="white" class="q-ml-sm">New Channel</q-badge>
                <q-badge v-if="channel.isMessage" color='primary' text-color="white" class="q-ml-sm">New Message</q-badge>-->
              </q-item-label>
              <!--<q-item-label caption lines="1">{{channel.description }}</q-item-label>-->
            </q-item-section>


            <q-btn color="white" text-color="primary" unelevated style="border-radius: 150px; width: 35px; height: 35px; padding: 0;" icon="more_vert">
              <q-popup-proxy>
                <q-banner>
                  <q-toolbar class="bg-primary text-white shadow-2">
                    <q-toolbar-title>{{ channel.name }} - {{ channel.isPrivate ? 'Private' : 'Public' }} Private</q-toolbar-title>
                    <q-avatar color="primary" text-color="white">
                      <q-icon name="discord" />
                    </q-avatar>
                  </q-toolbar>
                  <div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 10px; padding: 10px;">
                    <q-btn
                      color="white"
                      label="accounts"
                      text-color="primary"
                      push
                      size="md"
                      style="border-radius: 30px; flex-grow: 1; flex-shrink: 1;"
                      icon="account_circle"
                      @click="fetchUsers"
                    >
                      <q-popup-proxy>
                        <AccountListPopup :accounts="resolvedAccounts" />
                      </q-popup-proxy>
                    </q-btn>

                    <q-btn
                      v-if="channel.isPrivate == false"
                      color="white"
                      label="invite"
                      text-color="primary"
                      push
                      size="md"
                      style="border-radius: 30px; flex-grow: 1; flex-shrink: 1;"
                      icon="add">
                      <q-popup-proxy>
                        <q-banner>
                          <q-item>
                            <q-item-section>
                              <div class="row items-center">
                                <q-avatar color="primary" text-color="white" class="q-mr-sm">
                                  <q-icon name="account_circle" />
                                </q-avatar>
                                <q-input
                                  rounded outlined bg-color="white"
                                  v-model="inviteInput"
                                  ref="Invite_Account"
                                  label="username"
                                  lazy-rules
                                  style="margin-bottom: 0;" />
                              </div>
                              <q-btn
                                color="primary"
                                label="Invite"
                                icon="add"
                                push
                                size="md"
                                v-close-popup
                                style="border-radius: 30px; margin-top: 10px;"
                                @click="inviteUser(inviteInput)"
                              />
                            </q-item-section>
                          </q-item>
                        </q-banner>
                      </q-popup-proxy>
                    </q-btn>

                    <q-btn
                      color="primary"
                      label="kick"
                      text-color="white"
                      push
                      size="md"
                      style="border-radius: 30px; flex-grow: 1; flex-shrink: 1;"
                      icon="remove"
                    >
                      <q-popup-proxy>
                        <q-banner>
                          <q-item-section>
                            <q-item v-for="account in resolvedAccounts" :key="account.id" class="q-my-sm" clickable v-ripple v-close-popup @click="kickUser(account.username)">
                              <q-item-section avatar>
                                <!--<q-avatar color="primary" text-color="white" class="relative">
                                  <img :src="account.avatar" alt="User Avatar" />
                                </q-avatar>-->
                              </q-item-section>

                              <q-item-section>
                                <q-item-label>{{ account.name }}</q-item-label>
                                <q-item-label>{{ account.email }}</q-item-label>
                                <q-item-label v-if="account.role == 'user'" caption lines="1">kick votes: 1</q-item-label>
                                <q-item-label v-if="account.role == 'admin'" caption lines="1">admin</q-item-label>
                              </q-item-section>
                            </q-item>
                          </q-item-section>

                        </q-banner>
                      </q-popup-proxy>
                    </q-btn>

                    <q-btn
                      color="primary"
                      label="leave"
                      text-color="white"
                      push
                      size="md"
                      v-close-popup
                      @click="channelStore.leaveChannel(channel)"
                      style="border-radius: 30px; flex-grow: 1; flex-shrink: 1;"
                      icon="exit_to_app"
                    ></q-btn>
                    <q-btn
                      color="primary"
                      label="delete"
                      text-color="white"
                      push
                      size="md"
                      v-close-popup
                      v-if="channel.ownerId === authStore.user?.id"
                      @click="channelStore.removeChannel(channel)"
                      style="border-radius: 30px; flex-grow: 1; flex-shrink: 1;"
                      icon="delete"
                    ></q-btn>
                  </div>

                </q-banner>
              </q-popup-proxy>
            </q-btn>
          </q-item>
          <q-separator />
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>



<script lang="ts">
import {onMounted, provide, ref, watch} from 'vue';
import { useRouter } from 'vue-router';
import AccountListPopup from 'components/AccountListPopup.vue';
import {useAuthStore} from 'stores/auth';
import { useChannelStore } from 'stores/channel';
import {User} from 'src/contracts';
import {UserStatus} from 'stores/models';

export default {
  components: {
    AccountListPopup,
  },
  setup() {
    const router = useRouter();
    const Tag_Only = ref(false)
    const leftDrawerOpen = ref(false);
    const authStore = useAuthStore();
    const state = ref(authStore.user?.status || 'online');

    const inputContent = ref('');
    const isPrivate = ref(false);

    const inviteInput = ref('');
    const channelStore = useChannelStore();
    const resolvedAccounts = ref<User[]>([]);

    // Return the current channel name
    const getChannelName = () => {
      return channelStore.currentChannel?.name ?? 'Slack';
    };
    const currentChannelName = ref('');

    //console.log('Channel: ', channelStore.getMessages(channelStore.currentChannel, 10))

    watch(() => channelStore.currentChannel, (newValue) => {
      currentChannelName.value = newValue ? newValue.name : 'Slack';
      fetchUsers();
    });

    const inviteUser = async (username: string) => {
      try {
        if (channelStore.currentChannel) {
          await channelStore.inviteUser(channelStore.currentChannel, username);
          console.log(`User ${username} invited successfully.`);
          inviteInput.value = '';
          await fetchUsers();
        } else {
          console.log('No channel selected.');
        }
      } catch (error) {
        console.error('Error inviting user:', error);
      }
    };

    const fetchUsers = async () => {
      resolvedAccounts.value = await channelStore.fetchUsersInChannel(
        currentChannelName.value || 'Slack'
      );

      console.log('Fetched Accounts:', resolvedAccounts.value);
    }

    onMounted(() => {
      currentChannelName.value = getChannelName();
      console.log('Current Channel:', currentChannelName.value);
      fetchUsers();
      console.log('Fetched users: ', resolvedAccounts.value)
    });
    /*
    const getUsers = async () => {
      const users = await channelStore.fetchUsersInChannel(channelStore.currentChannel?.name || 'Slack')
      console.log('Users: ', users)
      return users;
    }*/

    // Function to toggle the left drawer state
    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    }

    function leaveChannel(channelId: number) {
      channels.value = channels.value.filter(channel => channel.id !== channelId);
    }

    const changeStatus = () => {
      console.log(state.value)
      authStore.setStatus(state.value as UserStatus);
    }

    function logout() {
      useAuthStore().logout().then(() => {
        router.push('/login');
      }).catch((error) => {
        // Handle logout errors here
        console.error('Logout failed:', error);
      });
    }

    const kickUser = async (userName: string) => {
      try {
        if (channelStore.currentChannel) {
          console.log('Kicking user: ', userName)
          await channelStore.removeUser(channelStore.currentChannel, userName);
          await fetchUsers();
        }
      } catch (error) {
        console.error('Error kicking user:', error);
      }
    };

    const joinChannel = () => {
      channelStore.joinChannel(inputContent.value, false);
      channelStore.fetchChannels();
      inputContent.value = ''
    }

    const createChannel = () => {
      console.log(inputContent.value, isPrivate.value)
      channelStore.joinChannel(inputContent.value, isPrivate.value)
      inputContent.value = ''
    }

    // Array of channels for the list
    const channels = ref([
      { id: 1, name: 'Channel1', description: 'Joe: Hello how u doing in this rainy day, Hello how u doing in this rainy day', admin: true , public: false, not: 'none', isNew: true},
      { id: 2, name: 'Channel2', description: 'Me: Just another day at the office!', admin: false, public: false, not: 'none',isMessage: true },
      { id: 3, name: 'Channel3', description: 'Joe: Team discussion on project', admin: false, public: false, not: 'message' },
      { id: 4, name: 'Channel4', description: 'Me: What\'s your favorite movie?', admin: false, public: false, not: 'none' },
      { id: 5, name: 'Channel5', description: 'Joe: Let\'s plan the weekend getaway', admin: false, public: false, not: 'none'},
      { id: 6, name: 'Channel6', description: 'Me: Hello how u doing in this rainy day', admin: true, public: false, not: 'invite' },
      { id: 7, name: 'Channel7', description: 'Joe: Just another day at the office!', admin: false, public: false, not: 'none'},
      { id: 8, name: 'Channel8', description: 'Me: Team discussion on project', admin: false, public: true, not: 'none' },
      { id: 9, name: 'Channel9', description: 'Joe: What\'s your favorite movie?', admin: false, public: true, not: 'invite' },
      { id: 10, name: 'Channel10', description: 'Me: Let\'s plan the weekend getaway', admin: false, public: true, not: 'none' },
    ]);

    const notifications = ref([
      { id: 1, name: 'Channel1', type:'message', description: 'Hello how u doing in this rainy day, Hello how u doing in this rainy day, Hello how u doing in this rainy day' },
      { id: 2, name: 'Channel10', type:'kick', description: 'You have been kicked from channel' },
      { id: 3, name: 'Channel9', type:'invite', description: 'You have been invited to channel' },
      { id: 4, name: 'Channel11', type:'delete', description: 'Channel has been deleted' },
    ]);

    const accounts = ref([
      { id: 1, name: 'Joe', gmail: 'joe.garfield@gmail.com', admin: true, status: 'online', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', is_typing: false, kick_votes:'0'},
      { id: 2, name: 'Alex', gmail: 'alex.gordon@gmail.com', admin: false, status: 'online', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', is_typing: true, kick_votes:'2'},
      { id: 3, name: 'Marco', gmail: 'marco.polo@gmail.com', admin: false, status: 'online', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', is_typing: false, kick_votes:'0'},
      { id: 4, name: 'Clement', gmail: 'clement.gotwald@gmail.com', admin: false, status: 'offline', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', is_typing: false, kick_votes:'1'},
      { id: 5, name: 'Peter', gmail: 'peter.parker@gmail.com', admin: false, status: 'offline', avatar: 'https://cdn.quasar.dev/img/boy-avatar.png', is_typing: false, kick_votes:'0'},
    ]);

    const blueModel = ref('Private');

    provide('channels', channels);

    return {
      state,
      inviteInput,
      inputContent,
      joinChannel,
      isPrivate,
      currentChannelName,
      channelStore,
      authStore,
      createChannel,
      /*getUsers,*/
      resolvedAccounts,
      leftDrawerOpen,
      toggleLeftDrawer,
      channels,
      notifications,
      blueModel,
      leaveChannel,
      logout,
      accounts,
      Tag_Only,
      inviteUser,
      changeStatus,
      fetchUsers,
      kickUser
    };
  },
};
</script>

<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3

.relative
  position: relative

.channel-connection
  font-size: 18px

.q-badge
  position: absolute
  top: 0
  right: 0

</style>
