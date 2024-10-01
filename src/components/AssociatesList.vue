<template>
  <div class="popup ">
    <h2 class="text-lg font-bold text-white text-center bg-gray-900">Public Server</h2>
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
          <div class="ml-2 flex flex-col">
            <span>{{ 'Role ' }}: {{ associate.role }}</span>
            <span>{{ 'Name ' }}: {{ associate.name }}</span>
            <span>{{ 'Kick votes ' }}: {{ '0' }}</span>
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
        {id: 1, name: 'John Doe', role: 'admin', isExpanded: false},
        {id: 2, name: 'Jane Smith', role: 'user', isExpanded: false},
        {id: 3, name: 'Michael Johnson', role: 'user', isExpanded: false},
        {id: 4, name: 'Emily Davis', role: 'user', isExpanded: false},
        {id: 5, name: 'John Doe', role: 'user', isExpanded: false},
        {id: 6, name: 'Jane Smith', role: 'user', isExpanded: false},
        {id: 7, name: 'Michael Johnson', role: 'user', isExpanded: false},
        {id: 8, name: 'Emily Davis', role: 'user', isExpanded: false},
        // Duplicate entries removed for clarity
      ]
    };
  },

  methods: {
    joinChannel() {
      // Define what should happen when the "Kick" button is clicked
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
  border: 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}
</style>
