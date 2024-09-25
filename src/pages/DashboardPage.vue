<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-800 text-white flex flex-col justify-between">
      <div>
        <div class="p-4">
          <h2 class="text-xl font-bold">Channels</h2>
          <button @click="createChannel" class="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Create Channel</button>
        </div>
        <ul class="flex-1 overflow-y-auto">
          <li v-for="channel in channels" :key="channel.id" :class="{'bg-yellow-500': channel.isHighlighted}" class="p-4 border-b border-gray-700">
            <div class="flex justify-between items-center">
              <span>{{ channel.name }}</span>
              <div>
                <button @click="leaveChannel(channel.id)" class="text-red-500">Leave</button>
                <button v-if="channel.isAdmin" @click="deleteChannel(channel.id)" class="text-red-500 ml-2">Delete</button>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="p-4">
        <button @click="toggleUserPopup" class="bg-blue-500 text-white py-2 px-4 rounded">User</button>
      </div>
    </aside>
    <!-- Main Content -->
    <main class="flex-1 p-4">
      <router-view></router-view>
    </main>
    <!-- User Popup -->
    <UserPopup v-if="showUserPopup" @close="toggleUserPopup" />
  </div>
</template>

<script>
import UserPopup from 'components/UserPopup.vue';

export default {
  data() {
    return {
      channels: [
        { id: 1, name: 'General', isHighlighted: false, isAdmin: true },
        { id: 2, name: 'Random', isHighlighted: true, isAdmin: false },
      ],
      showUserPopup: false,
    };
  },
  methods: {
    createChannel() {

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
  },
  components: {
    UserPopup,
  },
};
</script>

<style scoped>

</style>
