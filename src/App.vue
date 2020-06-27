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
          <v-row class="ma-4">
            <v-col cols="12" md="6" class="pb-0">
              <v-textarea
                solo
                no-resize=""
                :height="dynHeight"
                label="Copy/paste valid JSON here"
                v-model="tab.json"
                class="mb-0"
              ></v-textarea>
            </v-col>
            <v-col cols="12" md="6" class="pb-0">
              <v-card class="pa-2 cheightf">
                <tree-view :index="i" :json="tab.json" />
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </v-main>
  </v-app>
</template>

<script>
import TreeView from './components/TreeView.vue'

export default {
  name: 'App',

  components: {
    TreeView
  },

  data: () => ({
    tabs: [{name: 'Untitled', json: ''}],
    tab: null,
    dynHeight: ''
  }),

  created() {
    window.addEventListener('resize', this.dynHeightCalc);
    this.dynHeightCalc();
  },

  methods: {
    tabAdd() {
      this.tabs.push({
        name: 'Untitled',
        json: ''
      })
      this.tab = this.tabs.length - 1
    },
    remove(i) {
      this.tabs.splice(i, 1)
    },
    dynHeightCalc() {
      let vh100 = Math.round(window.innerHeight)
      this.dynHeight = (vh100 - 140) + 'px'
    }
  }
};
</script>

<style lang="scss" scoped>
.cheightf {
  height: calc(100vh - 140px);
  overflow: auto;
}
</style>