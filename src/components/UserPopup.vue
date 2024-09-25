<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div class="bg-white p-6 rounded shadow-lg">
      <h2 class="text-xl font-bold mb-4">User Settings</h2>
      <button @click="logout" class="bg-red-500 text-white py-2 px-4 rounded mb-4">Logout</button>
      <button @click="$emit('close')" class="bg-gray-500 text-white py-2 px-4 rounded">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {

    },
  },
};
</script>

<style scoped>

</style>
