<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-800 text-white flex flex-col justify-between">
      <div>
        <div class="q-pa-md" style="padding-bottom: 20px">
          <div>
            <q-fab
              v-model="fab1"
              label="Channels"
              label-position="left"
              color="green"
              icon="keyboard_arrow_right"
              direction="right"

            >
              <q-fab-action color="purple" @click="joinChannel" icon="search" label="Join" />
              <q-fab-action color="blue" @click="createChannel" icon="add" label="Create" />
            </q-fab>
          </div>
        </div>

        <ul class="flex-1 overflow-y-auto">
          <li v-for="channel in channels" :key="channel.id" :class="{'bg-yellow-500': channel.isHighlighted}" class="p-4 border-b border-gray-700">
            <div class="flex justify-between items-center space-x-3">
              <button @click="OpenChannel" class="text-left px-4 rounded flex-1"> <span>{{ channel.name }}</span> </button>

              <div>
                <button @click="leaveChannel(channel.id)" class="text-red-500">Leave</button>
                <button v-if="channel.isAdmin" @click="deleteChannel(channel.id)" class="text-red-500 ml-2">Delete</button>
                <span v-else class="ml-12 w-[64px]"></span> <!-- Placeholder to maintain space -->
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="q-pa-md" style="padding-bottom: 20px">
        <div>
          <q-fab
            v-model="fab2"
            label="Account"
            label-position="left"
            color="blue"
            icon="keyboard_arrow_right"
            direction="right"
          >
            <q-fab-action color="purple" @click="joinChannel" icon="edit" label="Edit" />
            <q-fab-action color="red" @click="joinChannel" icon="logout" label="Log Out" />
          </q-fab>
        </div>
      </div>
    </aside>

    <aside class="left-64 bg-gray-800 text-white flex flex-col justify-between">

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
  <WriteMessage v-if="showMessagePanel" @close="OpenChannel" />
</template>

<script>
import UserPopup from 'components/UserPopup.vue';
import MessagePanel from 'components/MessagePanel.vue';
import WriteMessage from 'components/WriteMessage.vue';
import { ref } from 'vue'; // Import ref for reactivity

export default {

  setup() {
    const fab1 = ref(false);
    const fab2 = ref(false);

    const toggleFab1 = () => {
      fab1.value = !fab1.value; // Toggle fab1 state
    };

    const toggleFab2 = () => {
      fab2.value = !fab2.value; // Toggle fab2 state
    };

    return { fab1, fab2, toggleFab1, toggleFab2 };
  },

  data() {
    return {
      channels: [
        { id: 1, name: 'General', isHighlighted: false, isAdmin: true },
        { id: 2, name: 'Random', isHighlighted: true, isAdmin: false },
      ],
      showUserPopup: false,
      showMessagePanel: true,
      showWriteMessage: true,

    };
  },
  methods: {
    createChannel() {

    },
    joinChannel() {

    },
    leaveChannel(channelId) {
      this.channels = this.channels.filter(channel => channel.id !== channelId);
    },
    deleteChannel(channelId) {
      this.channels = this.channels.filter(channel => channel.id !== channelId);
    },
    toggleUserPopup() {
      this.showUserPopup = !this.showUserPopup;
    },
    OpenChannel() {
      this.showMessagePanel = !this.showMessagePanel;
      this.showWriteMessage = !this.showWriteMessage;
    },
  },
  components: {
    WriteMessage,
    UserPopup,
    MessagePanel,
  },
};
</script>

<style scoped>

</style>
