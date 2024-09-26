<template>
  <div class="write-message-container">
    <q-input
      v-model="text"
      filled
      autogrow
      placeholder="Type a message..."
      class="message-input"
    />
  </div>
</template>

<script>
import {ref} from 'vue';

export default {
  setup() {
    const text = ref('');

    return {
      text,
    };
  },
};
</script>

<style scoped>
.write-message-container {
  position: absolute; /* Position relative to the parent */
  bottom: 10px; /* Move up from the bottom */
  left: 50%; /* Center horizontally */
  transform: translateX(-50%); /* Adjust centering */
  width: 90%; /* Responsive width */
  max-width: 900px; /* Max width for larger screens */
}

.message-input {
  width: 100%; /* Full width for input */
}
</style>
