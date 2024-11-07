<template>
  <div class="WAL position-relative bg-grey-4" :style="{ height: $q.screen.height + 'px' }">
    <q-layout view="lHh Lpr lFf" class="WAL__layout shadow-3" container>
      <q-header elevated>
        <q-toolbar class="bg-grey-3 text-black">
          <q-btn
            round
            flat
            icon="keyboard_arrow_left"
            class="WAL__drawer-open q-mr-sm"
            @click="leftDrawerOpen = !leftDrawerOpen"
          />

          <q-btn round flat>
            <q-avatar color="primary" text-color="white">G</q-avatar>
          </q-btn>

          <span class="q-subtitle-1 q-pl-md">
            {{ activeChannel }}
          </span>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        bordered
        :breakpoint="690"
      >
        <q-toolbar class="bg-grey-3">
          <q-avatar class="cursor-pointer">
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" />
          </q-avatar>

          <q-space />

          <q-btn round flat icon="more_vert">
            <q-menu auto-close :offset="[110, 8]">
              <q-list style="min-width: 150px">
                <q-item clickable @click="logout">
                  <q-item-section>Logout</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <q-btn
            round
            flat
            icon="close"
            class="WAL__drawer-close"
            @click="leftDrawerOpen = !leftDrawerOpen"
          />
        </q-toolbar>

        <q-scroll-area style="height: calc(100% - 100px)">
          <q-list>
            <q-item
              v-for="(channel, index) in channels"
              :key="index"
              clickable
              v-ripple
              @click="setActiveChannel(channel)"
            >
              <q-item-section>
                <q-item-label lines="1">
                  {{ channel }}
                </q-item-label>
                <q-item-label class="conversation__summary" caption>
                  {{ lastMessageOf(channel)?.content || '' }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <!--q-item-label caption>
                  {{ channel }}
                </q-item-label-->
                <q-icon name="keyboard_arrow_down" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container class="bg-grey-2">
        <router-view />
      </q-page-container>

      <q-footer>
        <q-toolbar class="bg-grey-3 text-black row">
          <q-input v-model="message" :disable="loading" @keydown.enter.prevent="send" rounded outlined dense class="WAL__field col-grow q-mr-sm" bg-color="white" placeholder="Type a message" />
          <q-btn :disable="loading" @click="send" round flat icon="send" />
        </q-toolbar>
      </q-footer>
    </q-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useChannelsStore } from '@/stores/channels'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

export default defineComponent({
  name: 'ChatLayout',
  setup() {
    // Local reactive data
    const leftDrawerOpen = ref(false)
    const message = ref('')
    const loading = ref(false)

    // Access stores
    const channelsStore = useChannelsStore()
    const authStore = useAuthStore()

    // Extract reactive properties from the channels store
    const { joinedChannels: channels, lastMessageOf, active: activeChannel } = storeToRefs(channelsStore)

    // Methods
    const send = async () => {
      loading.value = true
      await channelsStore.addMessage({ channel: activeChannel.value, message: message.value })
      message.value = ''
      loading.value = false
    }

    const setActiveChannel = (channel) => {
      channelsStore.SET_ACTIVE(channel)
    }

    const logout = () => {
      authStore.logout()
    }

    return {
      leftDrawerOpen,
      message,
      loading,
      channels,
      lastMessageOf,
      activeChannel,
      send,
      setActiveChannel,
      logout,
    }
  }
})
</script>
