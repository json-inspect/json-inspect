<template>
  <v-app>
    <v-app-bar
      app
      color="grey darken-3"
      dark
      dense
      extension-height="36"
    >
      <div class="d-flex align-center mr-4">
        <v-icon class="ml-3 mr-2">mdi-cloud-braces</v-icon>
        <v-toolbar-title>JSON Inspect</v-toolbar-title>
      </div>

      <template v-slot:extension>
        <v-tabs class="ml-3" v-model="tab" show-arrows>
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
          <v-btn small @click="tabAdd" class="mt-1 ml-2" icon>
            <v-icon small>mdi-plus</v-icon>
          </v-btn>
        </v-tabs>
      </template>

      <v-spacer></v-spacer>

      <v-btn small target="_blank" href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=P57DMM8WRFLWU&item_name=Help+support+the+server+costs+and+continued+development+associated+with+jsoninspect.com&currency_code=USD&source=url" text>
        <v-icon small class="mr-2">mdi-gift-outline</v-icon>  Donate
      </v-btn>

      <v-btn small target="_blank" href="https://twitter.com/messages/compose?recipient_id=1255587745" text>
        <v-icon small class="mr-2">mdi-twitter</v-icon>  Contact us
      </v-btn>

      <v-btn small @click="darkModeToggle" text>
        <v-icon small class="mr-2">mdi-theme-light-dark</v-icon>  Day/Night Mode
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-tabs-items v-model="tab">
        <v-tab-item
          v-for="(tab, i) in tabs"
          :key="i"
        >
          <v-row class="ma-4">
            <v-col cols="12" md="5" class="pb-0">
              
              <v-card class="pa-2">
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <!--<v-btn @click="load(i)" class="" small="" outlined="">Load URL</v-btn>-->                  
                  <v-btn @click="beautify(i)" class="" small="" text>Beautify</v-btn>
                  <v-btn @click="minify(i)" class="" small="" text>Minify</v-btn>
                  <v-btn @click="clear(i)" class="" small="" text>Clear</v-btn>
                  <v-menu  offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        text
                        small
                        class="ml-2"
                        v-bind="attrs"
                        v-on="on"
                      >
                        More <v-icon small>mdi-menu-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="download(i)" >
                        <v-list-item-title>Download</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="copy(i)" >
                        <v-list-item-title>Copy</v-list-item-title>
                      </v-list-item>
                      <v-divider></v-divider>
                      <v-list-item @click="loadExampleData(i)" >
                        <v-list-item-title>Load example data</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-card-actions>
                <v-divider></v-divider>
                <v-textarea
                  outlined
                  no-resize=""
                  :height="dynHeight"
                  label="Please drag/drop a JSON file or paste valid JSON here..."
                  v-model="tab.json"
                  class="mb-0 mt-3 mx-2"
                  :class="'ta' + i"
                  @drop.prevent="processFile" 
                  @dragover.prevent
                ></v-textarea>
              </v-card>
            </v-col>
            <v-col cols="12" md="5" class="pb-0" style="position: relative;">
              <v-card class="pa-2 cheightf cscroll" >
                <tree-view :index="i" :json="tab.json" />
              </v-card>
              <v-layout class="key">
                <v-icon small class="ml-3 mr-1" color="#86b25c">mdi-circle</v-icon> String
                <v-icon small class="ml-3 mr-1" color="#f9ae58">mdi-circle</v-icon> Number
                <v-icon small class="ml-3 mr-1" color="#ec5f66">mdi-circle</v-icon> Boolean
              </v-layout>
            </v-col>
            <v-col cols="12" md="2">
              <v-card class="cheightf ad pa-8" target="_blank" href="https://twitter.com/messages/compose?recipient_id=1255587745&text=I%27m%20interested%20in%20advertising%20my%20product%20or%20service%20on%20jsoninspect.com%2C%20and%20would%20love%20to%20get%20in%20touch%20with%20you.">
                <v-row style="height: 100%;" align="center"
                    justify="center">
                    <v-col>
                      <p class="text-center white--text">Your ad could be here, please contact us today!</p>
                    </v-col>
                </v-row>
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
        
        <v-list-item @click="remove(tabMenuSpawnedFromIndex)">
          <v-list-item-title>Close this tab</v-list-item-title>
        </v-list-item>
        <v-list-item @click="duplicate(tabMenuSpawnedFromIndex)">
          <v-list-item-title>Duplicate this tab</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="closeAll">
          <v-list-item-title>Close all tabs</v-list-item-title>
        </v-list-item>
        <v-list-item @click="closeOthers(tabMenuSpawnedFromIndex)">
          <v-list-item-title>Close all other tabs</v-list-item-title>
        </v-list-item>
        <v-list-item @click="closeLeft(tabMenuSpawnedFromIndex)">
          <v-list-item-title>Close all tabs to the left</v-list-item-title>
        </v-list-item>
        <v-list-item @click="closeRight(tabMenuSpawnedFromIndex)">
          <v-list-item-title>Close all tabs to the right</v-list-item-title>
        </v-list-item>
        
      </v-list>
    </v-menu>
  </v-app>
</template>

<script>
import minifyJSON from './assets/js/minify.json'

import TreeView from './components/TreeView.vue'

const exampleData = {
	"name": "Luke Skywalker",
	"height": 172,
	"mass": 77,
	"hair_color": "blond",
	"skin_color": "fair",
	"eye_color": "blue",
	"birth_year": "19BBY",
  "gender": "male",
  "cybernetics": true,
	"homeworld": "https://swapi.dev/api/planets/1/",
	"films": [
		"https://swapi.dev/api/films/2/",
		"https://swapi.dev/api/films/6/",
		"https://swapi.dev/api/films/3/",
		"https://swapi.dev/api/films/1/",
		"https://swapi.dev/api/films/7/"
	],
	"species": [
		"https://swapi.dev/api/species/1/"
	],
	"vehicles": [
		"https://swapi.dev/api/vehicles/14/",
		"https://swapi.dev/api/vehicles/30/"
	],
	"starships": [
		"https://swapi.dev/api/starships/12/",
		"https://swapi.dev/api/starships/22/"
	],
	"created": "2014-12-09T13:50:51.644000Z",
	"edited": "2014-12-20T21:17:56.891000Z",
	"url": "https://swapi.dev/api/people/1/"
}

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
    noop() {
      console.log('noop')
    },
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

      if(this.tabs.length == 0) {
        this.currentTabNumber = 1
        this.tabAdd()
      }
    },
    closeAll() {
      this.tabs.splice(0, this.tabs.length)

      this.currentTabNumber = 1
      this.tabAdd()
    },
    dynHeightCalc() {
      let vh100 = Math.round(window.innerHeight)
      this.dynHeight = (vh100 - 243) + 'px'
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
    },
    processFile(e) {
      let droppedFiles = e.dataTransfer.files;
      if(!droppedFiles) return;
      let f = droppedFiles[0]

      if (!f.type.match('application/json')) {
        return;
      }

      let context = this

      let reader = new FileReader();
      reader.onloadend = function() {
        context.tabs[context.tab].json = this.result
      };
      reader.readAsText(f);
    },
    load(i) {
      console.log(i)
    },
    download(i) {
      //console.log(i)

      var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(this.tabs[i].json);
      var downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href",     dataStr);
      downloadAnchorNode.setAttribute("download", "inspect.json");
      downloadAnchorNode.style.position = 'absolute';
      downloadAnchorNode.style.left = '-9999px';
      document.body.appendChild(downloadAnchorNode); // required for firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    },
    beautify(i) {
      this.tabs[i].json = JSON.stringify(JSON.parse(this.tabs[i].json), null, 4)
    },
    minify(i) {
      this.tabs[i].json = minifyJSON(this.tabs[i].json)
    },
    copy(i) {
      const el = document.createElement('textarea');
      el.value = this.tabs[i].json;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    },
    clear(i) {
      this.tabs[i].json = ''
    },
    loadExampleData(i) {
      this.tabs[i].json = JSON.stringify(exampleData, null, 4)
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
.ad {
  //height: 90px;
  background: linear-gradient(141deg, #9fb8ad 0%, #1fc8db 51%, #2cb5e8 75%);

  p {
    font-size: 1.2em;
  }

  &:hover {
    cursor: pointer;
  }
}

.key {
  position: absolute;
  padding: 20px;
  top: 10px;
  right: 10px;
}
</style>