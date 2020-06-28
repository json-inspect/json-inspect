<template>
  <v-app>
    <v-app-bar
      app
      color="grey darken-3"
      dark
    >
      <div class="d-flex align-center mr-4">
        <v-icon class="mr-2">mdi-cloud-braces</v-icon>
        <v-toolbar-title>JSON Inspect</v-toolbar-title>
      </div>

      <v-tabs v-model="tab" show-arrows>
        <v-tab
          v-for="(tab, i) in tabs"
          :key="i"
          @contextmenu.prevent="showTabMenu(i, $event)"
          :class="'tabb' + i"
        >
          {{tab.name}}
          <v-btn class="ml-2" small @click.stop="remove(i)" icon>
            <v-icon x-small >mdi-close</v-icon>
          </v-btn>
        </v-tab>
        <v-btn small @click="tabAdd" class="mt-5" icon>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-tabs>

      <v-spacer></v-spacer>

      <v-btn target="_blank" href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=P57DMM8WRFLWU&item_name=Help+support+the+server+costs+and+continued+development+associated+with+jsoninspect.com&currency_code=USD&source=url" text>
        <v-icon class="mr-2">mdi-gift-outline</v-icon>  Donate
      </v-btn>

      <v-btn @click="darkModeToggle" text>
        <v-icon class="mr-2">mdi-theme-light-dark</v-icon>  Day/Night Mode
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-tabs-items v-model="tab">
        <v-tab-item
          v-for="(tab, i) in tabs"
          :key="i"
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
    <v-menu
      :position-x="tabMenuX"
      :position-y="tabMenuY"
      absolute
      offset-y
      v-model="tabMenu"
    >
      <v-list>
        <v-list-item @click="duplicate(tabMenuSpawnedFromIndex)">
          <v-list-item-title>Duplicate this tab</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="remove(tabMenuSpawnedFromIndex)">
          <v-list-item-title>Close this tab</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="closeLeft(tabMenuSpawnedFromIndex)">
          <v-list-item-title>Close all tabs to the left</v-list-item-title>
        </v-list-item>
        <v-list-item @click="closeRight(tabMenuSpawnedFromIndex)">
          <v-list-item-title>Close all tabs to the right</v-list-item-title>
        </v-list-item>
        <v-list-item @click="closeOthers(tabMenuSpawnedFromIndex)">
          <v-list-item-title>Close all other tabs</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="closeAll">
          <v-list-item-title>Close all tabs</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
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
    tabs: [{name: 'Tab 1', json: '', num: 1}],
    tab: 0,
    dynHeight: '',
    darkMode: false,
    currentTabNumber: 2,
    tabMenu: false,
    tabMenuX: 0,
    tabMenuY: 0,
    tabMenuSpawnedFromIndex: 0
  }),

  created() {
    window.addEventListener('resize', this.dynHeightCalc);
    this.dynHeightCalc();

    if(localStorage.getItem('tabs')) {
      this.tabs = JSON.parse(localStorage.getItem('tabs'))
      if(this.tabs.length != 0) this.currentTabNumber = this.tabs[this.tabs.length - 1].num + 1
      this.$nextTick(function () {
        this.$forceUpdate()
      })
    }

    if(localStorage.getItem('darkMode')) {
      if(JSON.parse(localStorage.getItem('darkMode')) != this.darkMode) {
        this.darkModeToggle()
      }
    }
  },

  mounted() {
    
  },

  watch: {
    tabs: {
      handler(updated){
        localStorage.setItem('tabs', JSON.stringify(updated))
      },
      deep: true
    }
  },

  methods: {
    tabAdd() {
      this.tabs.push({
        name: 'Tab ' + this.currentTabNumber,
        json: '',
        num: this.currentTabNumber
      })
      this.currentTabNumber++
      this.tab = this.tabs.length - 1
    },
    duplicate(i) {
      this.tabs.splice(i+1,0,{
        name: 'Tab ' + this.currentTabNumber,
        json: this.tabs[i].json,
        num: this.currentTabNumber
      })
      this.currentTabNumber++
      this.tab = i + 1
    },
    closeLeft(i) {
      this.tabs.splice(0, i)
    },
    closeRight(i) {
      this.tabs.splice(i + 1)
    },
    closeOthers(i) {
      this.closeLeft(i)
      this.closeRight(0)
    },
    remove(i) {
      if(i < this.tab) this.tab--
      this.tabs.splice(i, 1)
    },
    closeAll() {
      this.tabs.splice(0, this.tabs.length)
    },
    dynHeightCalc() {
      let vh100 = Math.round(window.innerHeight)
      this.dynHeight = (vh100 - 140) + 'px'
    },
    darkModeToggle() {
      this.darkMode = !this.darkMode
      localStorage.setItem('darkMode', JSON.stringify(this.darkMode))

      if (this.darkMode) {
        this.$vuetify.theme.dark = true
      } else {
        this.$vuetify.theme.dark = false
      }
    },
    showTabMenu(i, e) {
      e.preventDefault()
      this.tabMenu = false
      this.tabMenuSpawnedFromIndex = i
      this.tabMenuX = e.clientX
      this.tabMenuY = e.clientY
      this.$nextTick(() => {
        this.tabMenu = true
      })
    }
  },

  computed: {
    
  }
};
</script>

<style lang="scss" scoped>
.cheightf {
  height: calc(100vh - 140px);
  overflow: auto;
}
</style>