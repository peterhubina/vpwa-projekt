<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer"/>
        <q-toolbar-title>Flow</q-toolbar-title>
        <div class="q-pa-md row q-gutter-md">
          <q-btn color="primary" style="border-radius: 150px; width: 40px; height: 40px; padding: 0;" icon="notifications">
            <q-badge color="red" floating style="border-radius: 12px;">2</q-badge>
            <q-popup-proxy>
              <q-banner>
                <q-toolbar class="bg-primary text-white shadow-2">
                  <q-avatar color="primary" text-color="white">
                    <q-icon name="notifications" />
                  </q-avatar>
                  <q-toolbar-title>Notifications</q-toolbar-title>
                </q-toolbar>
                <q-item v-for="notification in notifications" :key="notification.id" class="q-my-sm" clickable v-ripple>
                  <q-item-section avatar>
                    <q-avatar color="primary" text-color="white">
                      <q-icon name="discord" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>{{ notification.name }}</q-item-label>
                    <q-item-label caption lines="1">{{ notification.description }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-banner>
            </q-popup-proxy>
          </q-btn>
          <q-btn color="primary" style="border-radius: 150px; width: 40px; height: 40px; padding: 0;" icon="discord">
            <q-popup-proxy>
              <q-banner>
                <q-toolbar class="bg-primary text-white shadow-2">
                  <q-avatar color="primary" text-color="white">
                    <q-icon name="discord" />
                  </q-avatar>
                  <q-toolbar-title>Channel Connection</q-toolbar-title>
                </q-toolbar>
                <q-item style="display: flex; flex-direction: column;">
                  <q-expansion-item
                    icon="add"
                    label="Create Channel"
                    default-closed
                    header-class="text-primary">
                    <q-card>
                      <div>
                        <q-input
                          ref="ChannelNameCreate"
                          filled
                          label="Channel Name"
                          lazy-rules
                          model-value=""
                          style="margin-bottom: 10px;"
                        />
                        <q-btn color="primary" label="Create" icon="add" push size="md" v-close-popup style="border-radius: 30px;"/>
                        <q-toggle
                          :label="`${blueModel}`"
                          false-value="Public"
                          true-value="Private"
                          color="primary"
                          keep-color
                          v-model="blueModel"
                        />
                      </div>
                    </q-card>
                  </q-expansion-item>
                </q-item>
                <q-separator />
                <q-item style="display: flex; flex-direction: column;">
                  <q-expansion-item
                    icon="search"
                    label="Join Channel"
                    default-closed
                    header-class="text-primary">
                    <q-card>
                      <q-input
                        ref="ChannelNameJoin"
                        filled
                        label="Channel Name"
                        lazy-rules
                        model-value=""
                        style="margin-bottom: 10px;"
                      />
                      <q-btn color="primary" label="Join" icon="search" push size="md" v-close-popup style="border-radius: 30px;"/>
                    </q-card>
                  </q-expansion-item>
                </q-item>

              </q-banner>
            </q-popup-proxy>
          </q-btn>
          <q-btn color="primary" style="border-radius: 150px; width: 40px; height: 40px; padding: 0;" icon="account_circle">
            <q-popup-proxy>
              <q-banner>
                <q-toolbar class="bg-primary text-white shadow-2">
                  <q-avatar color="primary" text-color="white">
                    <q-icon name="account_circle" />
                  </q-avatar>
                  <q-toolbar-title>User Info</q-toolbar-title>
                </q-toolbar>
                <div class="row no-wrap q-pa-md">
                  <div class="column">
                    <div class="text-subtitle1 q-mb-sm">Name: John Doe</div>
                    <div class="text-subtitle1 q-mb-lg">Gmail: john.doe@gmail.com</div>
                    <div>
                      <q-btn-toggle
                        v-model="model"
                        class="my-custom-toggle"
                        no-caps
                        rounded
                        unelevated
                        toggle-color="primary"
                        color="white"
                        text-color="primary"
                        :options="[
                          { label: 'Online', value: 'one' },
                          { label: 'Offline', value: 'two' },
                          { label: 'Invisible', value: 'three' }
                                  ]"/>
                    </div>
                  </div>
                  <q-separator vertical inset class="q-mx-lg" />
                  <div class="column items-center">
                    <q-avatar size="72px" class="q-mb-md">
                      <img src="https://cdn.quasar.dev/img/boy-avatar.png" alt="" />
                    </q-avatar>
                    <q-btn
                      color="warning"
                      label="Logout"
                      push
                      size="md"
                      v-close-popup
                      style="border-radius: 30px;"
                    />
                  </div>
                </div>
              </q-banner>
            </q-popup-proxy>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>

      <q-list>
        <q-item v-for="channel in channels" :key="channel.name" style="display: flex; flex-direction: column;">
          <q-item clickable v-ripple>
            <q-item-section side>
              <q-icon name="discord" class="text-blue"/> <!-- Replace with your actual left icon name -->
            </q-item-section>


            <q-item-section>
              <q-item-label>{{channel.name }}</q-item-label>
              <q-item-label caption lines="1">{{channel.description }}</q-item-label>
            </q-item-section>


            <q-btn color="primary" style="border-radius: 150px; width: 40px; height: 40px; padding: 0;" icon="notifications">
              <q-popup-proxy>
                <q-banner>
                  <q-toolbar class="bg-primary text-white shadow-2">
                    <q-toolbar-title>{{channel.name }}</q-toolbar-title>
                    <q-avatar color="primary" text-color="white">
                      <q-icon name="discord" />
                    </q-avatar>
                  </q-toolbar>
                </q-banner>
              </q-popup-proxy>
            </q-btn>
          </q-item>
          <q-separator />
        </q-item>

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>



<script lang="ts">
import { ref } from 'vue';

export default {
  setup() {
    // Define reactive properties
    const model = ref('one');
    const leftDrawerOpen = ref(false);

    // Function to toggle the left drawer state
    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    }

    // Array of channels for the list
    const channels = ref([
      { id: 1, name: 'Channel1', description: 'Hello how u doing in this rainy day, Hello how u doing in this rainy day', admin: true },
      { id: 2, name: 'Channel2', description: 'Just another day at the office!', admin: false },
      { id: 3, name: 'Channel3', description: 'Team discussion on project', admin: false },
      { id: 4, name: 'Channel4', description: 'What\'s your favorite movie?', admin: false },
      { id: 5, name: 'Channel5', description: 'Let\'s plan the weekend getaway', admin: false },
      { id: 6, name: 'Channel6', description: 'Hello how u doing in this rainy day', admin: true },
      { id: 7, name: 'Channel7', description: 'Just another day at the office!', admin: false },
      { id: 8, name: 'Channel8', description: 'Team discussion on project', admin: false },
      { id: 9, name: 'Channel9', description: 'What\'s your favorite movie?', admin: false },
      { id: 10, name: 'Channel10', description: 'Let\'s plan the weekend getaway', admin: false },
    ]);

    const notifications = ref([
      { id: 1, name: 'Channel1', description: 'Hello how u doing in this rainy day, Hello how u doing in this rainy day, Hello how u doing in this rainy day' },
      { id: 10, name: 'Channel10', description: 'Let\'s plan the weekend getaway' },
    ]);

    const blueModel = ref('server');

    // Return the properties and methods
    return {
      model,
      leftDrawerOpen,
      toggleLeftDrawer,
      channels,
      notifications,
      blueModel,
    };
  },
};
</script>



<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
