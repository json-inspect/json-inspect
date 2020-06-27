<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center mr-4">
        <v-icon class="mr-2">mdi-cloud-braces</v-icon>
        <v-toolbar-title>JSON Inspect</v-toolbar-title>
      </div>

      <v-tabs v-model="tab">
        <v-tab
          v-for="(tab, i) in tabs"
          :key="tab.name + i"
        >
          {{tab.name}}
          <v-btn @click="remove(i)" icon>
            <v-icon x-small>mdi-close</v-icon>
          </v-btn>
        </v-tab>
        <v-btn @click="tabAdd" class="mt-2" icon>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-tabs>

      <v-spacer></v-spacer>

      <v-btn text>
        <v-icon class="mr-2">mdi-gift-outline</v-icon>  Donate
      </v-btn>

      <v-btn text>
        <v-icon class="mr-2">mdi-theme-light-dark</v-icon>  Day/Night Mode
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-tabs-items v-model="tab">
        <v-tab-item
          v-for="(tab, i) in tabs"
          :key="tab.name + i"
        >
          <v-card flat>
            <v-card-text>{{ tab.json }}</v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  components: {
    
  },

  data: () => ({
    tabs: [{name: 'Untitled', json: '{"test": "test"}'}],
    tab: null
  }),

  methods: {
    tabAdd() {
      this.tabs.push({
        name: 'Untitled',
        json: '"datetime": ' + Date.now()
      })
    },
    remove(i) {
      this.tabs.splice(i, 1)
    }
  }
};
</script>

<style lang="sass" scoped>

</style>