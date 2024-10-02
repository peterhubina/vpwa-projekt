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
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 900px;
}

.message-input {
  width: 100%;
}
</style>
