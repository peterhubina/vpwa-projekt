<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside :class="{'w-64': !isMobile, 'w-40': isMobile}" class="bg-gray-800 text-white flex flex-col justify-between">
      <div class="q-pa-md" style="padding: 10px">
        <div>
          <q-fab
            v-model="fab1"
            @click="toggleChannelFab"
            label="Channels"
            label-position="left"
            vertical-actions-align="left"
            color="green"
            icon="tv"
            direction="down">
            <q-fab-action color="purple" @click="joinChannel" icon="search" label="Join" />
            <q-fab-action color="blue" @click="createChannel" icon="add" label="Create" />
          </q-fab>
        </div>
      </div>

      <ul :class="{ 'account-space': isAccountFabExpanded, 'channel-space': isChannelFabExpanded }" class="flex-1 overflow-y-auto">
        <li
          v-for="channel in channels"
          :key="channel.id"
          :class="{'bg-yellow-600': channel.isHighlighted}"
          class="p-3 border-b border-gray-600"
        >
          <!-- Channel Container -->
          <div class="relative" :class="{ 'fab-expanded': channel.isExpanded }">
            <!-- FAB for Channel -->
            <q-fab
              :color="channel.color"
              push
              :icon="channel.icon"
              direction="down"
              vertical-actions-align="left"
              @click="expandFab(channel.id)"
            >
              <q-fab-action color="blue" @click="OpenChannel(channel.id)" icon="message" label="Messages"/>
              <q-fab-action color="accent" @click="joinChannel()" icon="face" label="Associates"/>
              <q-fab-action v-if="channel.isAdmin" color="red" @click="deleteChannel(channel.id)" icon="delete" label="Delete"/>
              <q-fab-action v-if="!channel.isAdmin" color="orange" @click="leaveChannel(channel.id)" icon="exit_to_app" label="Leave"/>
            </q-fab>

            <!-- Channel Button -->
            <button v-if="!isMobile" @click="OpenChannel(channel.id)" class="text-left px-4 rounded flex-1 font-bold">
              <span>{{ channel.name }}</span>
            </button>
          </div>
        </li>
      </ul>

      <div class="q-pa-md" style="padding: 10px">
        <div>
          <q-fab
            @click="toggleAccountFab"
            v-model="fab2"
            label="Account"
            label-position="left"
            vertical-actions-align="left"
            color="blue"
            icon="account_circle"
            direction="up">
            <q-fab-action color="purple" @click="joinChannel" icon="edit" label="Edit" />
            <q-fab-action color="red" @click="joinChannel" icon="logout" label="Log Out" />
          </q-fab>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-4">
      <router-view></router-view>
    </main>

    <!-- User Popup -->
    <UserPopup v-if="showUserPopup" @close="toggleUserPopup" />
  </div>

  <!-- Message Channel -->
  <MessagePanel v-if="showMessagePanel" @close="OpenChannel" />
</template>

<script>
import UserPopup from 'components/UserPopup.vue';
import MessagePanel from 'components/MessagePanel.vue';
import { ref, onMounted, onBeforeUnmount } from 'vue'; // Import ref for reactivity

export default {
  setup() {
    const fab1 = ref(false);
    const fab2 = ref(false);

    const isMobile = ref(window.innerWidth < 600);

    const updateMobileState = () => {
      isMobile.value = window.innerWidth < 600;
    };

    // Add event listener for window resize
    onMounted(() => {
      window.addEventListener('resize', updateMobileState);
    });

    // Clean up the event listener on component unmount
    onBeforeUnmount(() => {
      window.removeEventListener('resize', updateMobileState);
    });

    return { fab1, fab2, isMobile };
  },



  data() {
    return {
      channels: [
        { id: 1, name: 'General', isHighlighted: false, isAdmin: true, color: 'red', icon: 'image', isExpanded: false },
        { id: 2, name: 'Random', isHighlighted: true, isAdmin: false, color: 'blue', icon: 'facebook', isExpanded: false },
        { id: 3, name: 'Channel4569', isHighlighted: false, isAdmin: false, color: 'green', icon: 'discord', isExpanded: false },
        { id: 4, name: 'Channel123456789', isHighlighted: false, isAdmin: false, color: 'pink', icon: 'apple', isExpanded: false },
        { id: 5, name: 'Channel123456789', isHighlighted: false, isAdmin: true, color: 'purple', icon: 'business', isExpanded: false },
      ],
      showUserPopup: false,
      showMessagePanel: true,
      showWriteMessage: true,
      isAccountFabExpanded: false,
      isChannelFabExpanded: false,
    };
  },

  methods: {
    createChannel() {},

    joinChannel() {},

    leaveChannel(channelId) {
      this.channels = this.channels.filter((channel) => channel.id !== channelId);
    },

    deleteChannel(channelId) {
      this.channels = this.channels.filter((channel) => channel.id !== channelId);
    },

    toggleUserPopup() {
      this.showUserPopup = !this.showUserPopup;
    },

    toggleAccountFab() {
      this.isAccountFabExpanded = !this.isAccountFabExpanded; // Toggle the account FAB expanded state
    },

    toggleChannelFab() {
      this.isChannelFabExpanded = !this.isChannelFabExpanded; // Toggle the account FAB expanded state
    },

    expandFab(channelId) {
      const channel = this.channels.find(c => c.id === channelId);
      if (channel) {
        channel.isExpanded = !channel.isExpanded; // Toggle this channel's expanded state
      }
    },

    OpenChannel(channelId) {
      const selectedChannel = this.channels.find((channel) => channel.id === channelId);
      if (selectedChannel && selectedChannel.isHighlighted) {
        return;
      }
      this.channels.forEach((channel) => {
        if (channel.isHighlighted) {
          channel.isHighlighted = false;
        }
      });
      if (selectedChannel) {
        selectedChannel.isHighlighted = true;
      }
      this.showMessagePanel = !this.showMessagePanel;
    }
  },

  components: {
    UserPopup,
    MessagePanel,
  },
};
</script>

<style scoped>
/* Style to ensure spacing for expanded Fab */
.fab-expanded {
  margin-bottom: 150px; /* Adjust this value depending on the height of expanded fab-actions */
}

aside {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Sidebar takes full screen height */
}

ul {
  overflow-y: auto; /* Make the channel list scrollable */
  flex: 1;          /* Ensure it takes up available space between FABs */
}

.q-pa-md:last-child {
  margin-top: auto; /* Pushes the Account section to the bottom */
}

.account-space {
  margin-bottom: 100px; /* Space for expanded account FAB */
}

.channel-space {
  margin-top: 100px; /* Adjust this value for the space needed when FAB is expanded */
}
</style>
