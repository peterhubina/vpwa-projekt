<template>
  <div class="popup ">
    <h2 class="text-lg font-bold text-white text-center bg-gray-900">Private Server</h2>
    <ul class="popup-list">
      <li
        v-for="associate in associates"
        :key="associate.id"
        class="p-1 border-b bg-gray-700 text-white"
      >
        <div class="relative" :class="{ 'fab-expanded': associate.isExpanded }">
          <q-fab
            icon="account_circle"
            icon-color="black"
            label-position="left"
            vertical-actions-align="left"
            color="transparent"
            direction="right"
            :style="{ border: '1px solid white', 'box-shadow': 'inset 0 0 0 1px white' }"
          >
            <q-fab-action color="red" @click="joinChannel" icon="remove" label="Kick" />
          </q-fab>
          <div class="ml-0 m-3 flex flex-col">
            <span :style="{ color: associate.role === 'admin' ? 'violet' : 'pink' }">{{ 'Role ' }}: {{ associate.role }}</span>
            <span>{{ 'Name ' }}: {{ associate.name }}</span>
            <span v-if="associate.kick_votes > 0" style="color: red;"> {{ 'Kick votes ' }}: {{ associate.kick_votes }} </span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'AssociateList',
  data() {
    return {
      associates: [
        {id: 1, name: 'John Doe', role: 'admin', isExpanded: false, kick_votes: 0},
        {id: 2, name: 'Jane Smith', role: 'user', isExpanded: false, kick_votes: 0},
        {id: 3, name: 'Michael Johnson', role: 'user', isExpanded: false, kick_votes: 0},
        {id: 4, name: 'Emily Davis', role: 'user', isExpanded: false, kick_votes: 2},
        {id: 5, name: 'John Doe', role: 'user', isExpanded: false, kick_votes: 0},
        {id: 6, name: 'Jane Smith', role: 'user', isExpanded: false, kick_votes: 0},
        {id: 7, name: 'Michael Johnson', role: 'user', isExpanded: false, kick_votes: 1},
        {id: 8, name: 'Emily Davis', role: 'user', isExpanded: false, kick_votes: 0},

      ]
    };
  },

  methods: {
    joinChannel() {

    }

  }
}
</script>

<style scoped>
.popup {
  position: fixed;
  top: 50%;
  left: 16rem;
  width: 16rem;
  height: 400px;
  transform: translateY(-50%);
  background-color: gray;
  z-index: 2;
  border: 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  border-radius: 0 40px 40px 0;
}
/* Optional: Custom scrollbar styles */
.popup::-webkit-scrollbar {
  width: 8px; /* Set scrollbar width */
}

.popup::-webkit-scrollbar-thumb {
  background: lightgrey; /* Change scrollbar color */
  border-radius: 4px; /* Make scrollbar rounded */
}

.popup::-webkit-scrollbar-thumb:hover {
  background: grey; /* Change color on hover */
}
</style>
