<template>
  <div :class="['message-panel-container flex h-screen', { 'mobile': isMobile }]">
    <ul class="flex-1 overflow-y-auto">
      <li v-for="message in messages" :key="message.id" class="p-2">
        <q-chat-message
          :name="message.from"
          :text="[message.text]"
          :stamp="formatTimeStamp(message.timestamp)"
          :sent="message.my_message"
          :bg-color="message.my_message ? 'primary' : 'violin'"
          text-color="white"
          class="white-name message-bubble"
        />
      </li>
    </ul>

    <div class="write-message-container">
      <q-input
        v-model="text"
        filled
        autogrow
        placeholder="Type a message..."
        class="message-input"
        :max-height="maxHeight"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
  data() {
    return {
      messages: [
        { id: 1, from: 'me', text: 'Hey everyone! How\'s it going?', my_message: true, timestamp: '1724857956824' },
        { id: 2, from: 'Mark.Ismail@gmail.com', text: 'Pretty good! Just got back from a hike.', my_message: false, timestamp: '1726240356824' },
        { id: 3, from: 'JaneAgnostic@dondelio.com', text: 'Doing well! Just started a new book.', my_message: false, timestamp: '1726845156824' },
        { id: 4, from: 'AlexKendrick@stuba.sk', text: 'Hey! I’m working on some art. How about you?', my_message: false, timestamp: '1727277156824' },
        { id: 5, from: 'me', text: 'Not much, just relaxing at home.', my_message: true, timestamp: '1727363556824' },
        { id: 6, from: 'Mark.Ismail@gmail.com', text: 'Nice! Any plans for the weekend?', my_message: false, timestamp: '1727406756824' },
        { id: 7, from: 'JaneAgnostic@dondelio.com', text: 'I might go to the beach if the weather is nice.', my_message: false, timestamp: '1727431956824' },
        { id: 8, from: 'AlexKendrick@stuba.sk', text: 'I’m thinking of having a small gathering at my place.', my_message: false, timestamp: '1727446356824' },
        { id: 9, from: 'me', text: 'Sounds fun! I’m in for the gathering!', my_message: true, timestamp: '1727449356824' },
        { id: 10, from: 'Mark.Ismail@gmail.com', text: 'Count me in too! I’ll bring snacks.', my_message: false, timestamp: '1727449656824' },
        { id: 11, from: 'JaneAgnostic@dondelio.com', text: 'I’ll bring drinks! What kind do you like?', my_message: false, timestamp: '1727449896824' },
        { id: 12, from: 'AlexKendrick@stuba.sk', text: 'Perfect! Let’s make it a potluck style.', my_message: false, timestamp: '1727449956824' },
        { id: 13, from: 'me', text: 'Great idea! Should we set a time?', my_message: true, timestamp: '1727450000000' },
        { id: 14, from: 'Mark.Ismail@gmail.com', text: 'How about Saturday at 5 PM?', my_message: false, timestamp: '1727450050000' },
        { id: 15, from: 'JaneAgnostic@dondelio.com', text: 'Sounds good to me!', my_message: false, timestamp: '1727450100000' },
        { id: 16, from: 'AlexKendrick@stuba.sk', text: 'Works for me! I’ll get the place ready.', my_message: false, timestamp: '1727450150000' },
        { id: 17, from: 'me', text: 'Awesome! Looking forward to it.', my_message: true, timestamp: '1727450200000' },
        { id: 18, from: 'Mark.Ismail@gmail.com', text: 'Me too! It\'s been a while since we all hung out.', my_message: false, timestamp: '1727450250000' },
        { id: 19, from: 'JaneAgnostic@dondelio.com', text: 'Can’t wait! Let’s make it memorable.', my_message: false, timestamp: '1727450300000' },
        { id: 20, from: 'AlexKendrick@stuba.sk', text: 'Definitely! See you all then!', my_message: false, timestamp: '1727450350000' }
      ]
    };
  },

  setup() {
    const text = ref('');
    const maxHeight = '3rem * 3'; // The maximum height for 3 rows of text
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

    const formatTimeStamp = (timestamp) => {
      const messageDate = new Date(parseInt(timestamp));
      const now = new Date();
      const diff = Math.floor((now - messageDate) / 1000); // difference in seconds

      if (diff < 60) return `${diff} seconds ago`;
      if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
      if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
      if (diff < 2630016) return `${Math.floor(diff / 604800)} weeks ago`;
      if (diff < 31536000) return `${Math.floor(diff / 2630016)} months ago`;
      return `${Math.floor(diff / 31536000)} years ago`;
    };

    return {
      text,
      maxHeight,
      formatTimeStamp,
      isMobile,
    };
  },
};
</script>

<style scoped>
.message-panel-container {
  position: absolute;
  top: 0;
  left: 16rem; /* Default value for desktop */
  right: 0;
  bottom: 16rem; /* Leave 100px for the input area at the bottom */
  width: calc(100% - 16rem); /* Make it responsive to fill the remaining width */
  background: black;
  border-radius: 0;
  padding: 20px;
  z-index: 10;
  display: flex;
  flex-direction: column; /* Make it a column layout */
  font-size: 1.1rem;
}

/* Mobile Styles */
.message-panel-container.mobile {
  left: 10rem; /* Adjust left position for mobile */
  width: calc(100% - 10rem); /* Adjust width for mobile */
}

ul {
  flex: 1;
}

.write-message-container {
  padding-top: 10px;
  display: flex;
}

.message-input {
  width: 100%;
  max-height: calc(1.5em * 3); /* Limit to 3 rows */
  overflow-y: auto;
  border: none;
  outline: none;
  resize: none; /* No manual resizing */
  padding: 0;
  background: white;
  border-radius: 20px;
  font-size: 1.1rem;
}

.white-name {
  color: white !important; /* Use !important to override any default styles */
}
</style>
