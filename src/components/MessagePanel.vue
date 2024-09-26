<template>
  <div class="message-panel-container flex h-screen">
    <div class="message-list">
      <q-chat-message
        name="me"
        avatar="https://cdn.quasar.dev/img/avatar3.jpg"
        :text="['hey, how are you?']"
        stamp="7 minutes ago"
        sent
        bg-color="amber-7"
      />
      <q-chat-message
        name="Jane"
        avatar="https://cdn.quasar.dev/img/avatar5.jpg"
        :text="[ 'doing fine, how r you?',
        'I just feel like typing a really, really, REALLY long message to annoy you...' ]"
        size="4"
        stamp="4 minutes ago"
        text-color="white"
        bg-color="primary"
      />
      <q-chat-message
        name="Jane"
        avatar="https://cdn.quasar.dev/img/avatar5.jpg"
        :text="['Did it work?']"
        stamp="1 minutes ago"
        size="8"
        text-color="white"
        bg-color="primary"
      />
      <q-chat-message
        name="Jane"
        avatar="https://cdn.quasar.dev/img/avatar5.jpg"
        :text="['Did it work?']"
        stamp="1 minutes ago"
        size="10"
        text-color="white"
        bg-color="primary"
      />
    </div>
  </div>
</template>

<script>
export default {
  // Setup logic if needed
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
  max-height: 400px; /* Max height for the message panel */
}
.message-list {
  display: flex;
  flex-direction: column; /* Align messages vertically */
}
</style>
