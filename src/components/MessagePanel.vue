<template>
  <div class="message-panel-container flex h-screen">
    <ul class="flex-1 overflow-y-auto">
      <li v-for="message in messages" :key="message.id" class="p-3 border-b">
        <q-chat-message
          :name="message.from"
          :text="[message.text]"
          :stamp="new Date(parseInt(message.timestamp)).toLocaleTimeString()"
          :sent="message.my_message"
          :bg-color="message.my_message ? 'primary' : 'secondary'"
          text-color="white"
          class="white-name"
        />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messages: [
        { id: 1, from: 'me', text: 'hey, how are you?', my_message: true, timestamp: '1633072800000' },
        { id: 2, from: 'Mark', text: 'doing fine, how r you?', my_message: false, timestamp: '1633072800000' },
        { id: 3, from: 'Mark', text: 'I just feel like typing a really, really, REALLY long message to annoy you...', my_message: false, timestamp: '1633072800000' },
        { id: 4, from: 'Mark', text: 'Did it work my friend...', my_message: false, timestamp: '1633072800000' },
        { id: 1, from: 'me', text: 'hey, how are you?', my_message: true, timestamp: '1633072800000' },
        { id: 2, from: 'Jane', text: 'doing fine, how r you?', my_message: false, timestamp: '1633072800000' },
        { id: 3, from: 'Jane', text: 'I just feel like typing a really, really, REALLY long message to annoy you...', my_message: false, timestamp: '1633072800000' },
        { id: 4, from: 'Jane', text: 'Did it work my friend...', my_message: false, timestamp: '1633072800000' },
        { id: 1, from: 'me', text: 'hey, how are you?', my_message: true, timestamp: '1633072800000' },
        { id: 2, from: 'Jane', text: 'doing fine, how r you?', my_message: false, timestamp: '1633072800000' },
        { id: 3, from: 'Jane', text: 'I just feel like typing a really, really, REALLY long message to annoy you...', my_message: false, timestamp: '1633072800000' },
        { id: 4, from: 'Jane', text: 'Did it work my friend...', my_message: false, timestamp: '1633072800000' }
      ]
    };
  },
};
</script>

<style scoped>
.message-panel-container {
  position: absolute; /* Position relative to the parent */
  top: 50%; /* Center vertically */
  left: 20rem; /* Fixed left margin of 16rem */
  transform: translateY(-50%); /* Adjust vertical centering */
  width: 90%; /* Responsive width */
  max-width: 800px; /* Max width for larger screens */
  background: rgba(0, 0, 0, 0.7); /* Semi-transparent background */
  border-radius: 8px; /* Rounded corners */
  padding: 20px; /* Padding for content */
  z-index: 10; /* Ensure it sits above other content */
  overflow-y: auto; /* Scrollable if too many messages */
  max-height: 800px; /* Max height for the message panel */
}
.message-list {
  display: flex;
  flex-direction: column; /* Align messages vertically */
}

.white-name {
  color: white !important; /* Use !important to override any default styles */
}
</style>
