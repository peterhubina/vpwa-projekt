<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer"/>
        <q-toolbar-title>Flow</q-toolbar-title>
        <div class="q-pa-md row q-gutter-md">
          <q-btn-dropdown color="blue" label="" icon="discord" style="border-radius: 30px;">
            <div style="display: flex; flex-direction: column; gap: 5px; padding: 7px;">
              <q-btn color="blue" label="Create New Channel" icon="create" push size="md" v-close-popup style="border-radius: 30px;"/>
              <q-btn color="blue" label="Join existing Channel" icon="add" push size="md" v-close-popup style="border-radius: 30px;"/>
            </div>
          </q-btn-dropdown>
          <q-btn-dropdown color="blue" label="" icon="account_circle" style="border-radius: 30px;">
            <div class="row no-wrap q-pa-md">
              <div class="column">
                <div class="text-subtitle1 q-mb-sm">Name: John Doe</div>
                <div class="text-subtitle1 q-mb-lg">Gmail: john.doe@gmail.com</div>
                <div>
                  <q-btn-toggle v-model="model" class="my-custom-toggle" no-caps rounded unelevated toggle-color="blue" color="white" text-color="primary"
                    :options="[
                      {label: 'Online', value: 'one'},
                      {label: 'Offline', value: 'two'},
                      {label: 'Invisible', value: 'three'}
                      ]"/>
                </div>
              </div>
              <q-separator vertical inset class="q-mx-lg" />
              <div class="column items-center">
                <q-avatar size="72px" class="q-mb-md">
                  <img src="https://cdn.quasar.dev/img/boy-avatar.png" alt="">
                </q-avatar>
                <q-btn color="warning" label="Logout" icon="add" push size="md" v-close-popup style="border-radius: 30px;"/>
              </div>
            </div>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>Channels</q-item-label>

        <q-item clickable v-ripple>
          <q-item>General Channel</q-item>
          <q-item>General Channel</q-item>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">R</q-avatar>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section>Letter avatar-type</q-item-section>
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">R</q-avatar>
          </q-item-section>
        </q-item>

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Define reactive properties directly in <script setup>
const model = ref('one');
const leftDrawerOpen = ref(false);

// Function to toggle the left drawer state
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
