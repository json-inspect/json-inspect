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
            <v-btn class="ml-2" small @click.stop="remove(i)" @mousedown.stop="" @touchstart.stop="" icon>
              <v-icon x-small >mdi-close</v-icon>
            </v-btn>
          </v-tab>
          <v-btn small @click="tabAdd" class="mt-1 ml-2" icon>
            <v-icon small>mdi-plus</v-icon>
          </v-btn>
        </v-tabs>
      </template>

      <v-spacer></v-spacer>

      <v-btn small target="_blank" href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=P57DMM8WRFLWU&item_name=Help+support+the+server/maintenance+costs+and+continued+development+costs+associated+with+jsoninspect.com&currency_code=USD&source=url" text>
        <v-icon small class="mr-2">mdi-gift-outline</v-icon>  Donate
      </v-btn>

      <v-btn small target="_blank" href="https://twitter.com/messages/compose?recipient_id=1255587745" text>
        <v-icon small class="mr-2">mdi-twitter</v-icon>  Contact us
      </v-btn>

      <v-btn class="mr-1" small @click="darkModeToggle" text>
        <v-icon small class="mr-2">mdi-theme-light-dark</v-icon>  Day/Night Mode
      </v-btn>
    </v-app-bar>
    <v-main class="pb-4">
      <v-tabs-items v-model="tab">
        <v-tab-item
          v-for="(tab, i) in tabs"
          :key="i"
        >
          <v-row class="ma-4">
            <v-col cols="12" md="5" class="pb-0">
              
              <v-card class="pa-2">
                <v-card-actions>
                  <v-icon :title="validJSON().text" small class="ml-1 mr-1" :color="validJSON().color">mdi-circle</v-icon> 
                  <v-spacer></v-spacer>               
                  <v-btn :disabled="disabled" @click="beautify(i)" class="" small="" text>Beautify</v-btn>
                  <v-btn :disabled="disabled" @click="minify(i)" class="" small="" text>Minify</v-btn>
                  <v-btn :disabled="disabled" @click="clear(i)" class="" small="" text>Clear</v-btn>
                  <v-menu open-on-hover="" offset-y>
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
                      <v-list-item :disabled="disabled" @click="copy(i)" >
                        <v-list-item-title>Copy all</v-list-item-title>
                      </v-list-item>
                      <v-list-item :disabled="disabled" @click="download(i)" >
                        <v-list-item-title>Download as JSON</v-list-item-title>
                      </v-list-item>
                      <v-list-item :disabled="disabled" @click="downloadXML(i)" >
                        <v-list-item-title>Download as XML</v-list-item-title>
                      </v-list-item>
                      <v-divider></v-divider>
                      <!--<v-list-item @click="noop()" >
                        <v-list-item-title>Load from URL</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="noop()" >
                        <v-list-item-title>Load from file</v-list-item-title>
                      </v-list-item>-->
                      <v-list-item @click="loadExampleData(i)" >
                        <v-list-item-title>Load example data</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-card-actions>
                
                <v-textarea
                  outlined
                  no-resize=""
                  :height="dynHeight"
                  label="Please drag/drop a JSON file or paste valid JSON here..."
                  v-model="tab.json"
                  class="mt-0 mx-2 cscroll"
                  style="margin-bottom: -20px;"
                  :class="'ta' + i"
                  @drop.prevent="processFile" 
                  @dragover.prevent
                ></v-textarea>
              </v-card>
            </v-col>
            <v-col cols="12" md="5" class="pb-0" style="position: relative;">
              <v-card class="pa-2 cheightf cscroll" >
                <v-card-actions style="overflow: hidden;">
                  <v-menu open-on-hover="" offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        text
                        small
                        class=""
                        v-bind="attrs"
                        v-on="on"
                      >
                        View <v-icon small>mdi-menu-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item :disabled="disabled" @click="expandAll" >
                        <v-list-item-title>Expand all</v-list-item-title>
                      </v-list-item>
                      <v-list-item :disabled="disabled" @click="collapseAll" >
                        <v-list-item-title>Collapse all</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  <v-layout style="font-size: 0.9em;" class="key">
                    <v-spacer></v-spacer>
                    <v-icon small class="ml-2 mr-1" color="#86b25c">mdi-circle</v-icon> String
                    <v-icon small class="ml-2 mr-1" color="#f9ae58">mdi-circle</v-icon> Number
                    <v-icon small class="ml-2 mr-1" color="#ec5f66">mdi-circle</v-icon> Boolean
                  </v-layout>
                </v-card-actions>
                <v-divider></v-divider>
                <div class="scroll cscroll">
                  <tree-view ref="tree" :index="i" :json="tab.json" />
                </div>
                
              </v-card>
              
              <v-progress-circular
                  v-if="loadingURL"
                  indeterminate
                  style="position: absolute; right: 30px; bottom: 30px;"
                  color="primary"
                ></v-progress-circular>
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
    <v-footer absolute="" color="transparent" class="my-0 px-7" style="font-size: 0.9em;" app>
      <v-spacer></v-spacer>
      <div>Made with ❤️ by Emily Carlsen <v-btn icon target="_blank" href="https://twitter.com/emilyplusplus"><v-icon >mdi-twitter</v-icon></v-btn> <v-btn style="margin-left: -10px;" icon target="_blank" href="https://www.instagram.com/emilyplusplus/"><v-icon >mdi-instagram</v-icon></v-btn> <!--<v-btn style="margin-left: -10px;" icon target="_blank" href="https://emilyplusplus.wordpress.com/"><v-icon >mdi-wordpress</v-icon></v-btn>--> · Open source software <v-btn icon target="_blank" href="https://github.com/json-inspect"><v-icon >mdi-github</v-icon></v-btn> · <a target="_blank" href="http://json.org">json.org</a></div>
    </v-footer>
  </v-app>
</template>

<script>
import minifyJSON from './assets/js/minify.json'

import TreeView from './components/TreeView.vue'

import { EventBus } from './assets/js/event.js';

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
    tabMenuSpawnedFromIndex: 0,
    loadingURL: false
  }),

  created() {
    window.addEventListener('resize', this.dynHeightCalc);
    this.dynHeightCalc();

    if(localStorage.getItem('tabs')) {
      this.tabs = JSON.parse(localStorage.getItem('tabs'))
      if(this.tabs.length != 0) this.currentTabNumber = this.tabs[this.tabs.length - 1].num + 1
    }

    if(localStorage.getItem('darkMode')) {
      if(JSON.parse(localStorage.getItem('darkMode')) != this.darkMode) {
        this.darkModeToggle()
      }
    }
  },

  mounted() {
    EventBus.$on('openURL', (url) => {
      this.url(url)
    });
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
    json2xml(o, tab) {
      var toXml = function(v, name, ind) {
          var xml = "";
          if (v instanceof Array) {
            for (var i=0, n=v.length; i<n; i++)
                xml += ind + toXml(v[i], name, ind+"\t") + "\n";
          }
          else if (typeof(v) == "object") {
            var hasChild = false;
            xml += ind + "<" + name;
            for (let m in v) {
                if (m.charAt(0) == "@")
                  xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
                else
                  hasChild = true;
            }
            xml += hasChild ? ">" : "/>";
            if (hasChild) {
                for (let m in v) {
                  if (m == "#text")
                      xml += v[m];
                  else if (m == "#cdata")
                      xml += "<![CDATA[" + v[m] + "]]>";
                  else if (m.charAt(0) != "@")
                      xml += toXml(v[m], m, ind+"\t");
                }
                xml += (xml.charAt(xml.length-1)=="\n"?ind:"") + "</" + name + ">";
            }
          }
          else {
            xml += ind + "<" + name + ">" + v.toString() +  "</" + name + ">";
          }
          return xml;
      }, xml="";
      for (var m in o)
          xml += toXml(o[m], m, "");
      let final = tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
      return '<?xml version="1.0" encoding="UTF-8" ?><root>' + final + '</root>'
    },
    ConvertToCSV(objArray) {
      let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
      if(!Array.isArray(array))
          array = [array];

      let str = '';

      for (let i = 0; i < array.length; i++) {
        let line = '';
        for (let index in array[i]) {
          if (line != '') line += ','

          const item = array[i][index];
          line += (typeof item === 'object' && item !== null ? this.ConvertToCSV(item) : item);
        }

        str += line + '\r\n';
      }

      do{
          str = str.replace(',,',',').replace(',','\t').trim();
      }while(str.includes(',')||str.includes('\n'));

      return str;
    },
    expandAll() { 
      this.$refs.tree[this.tab].expandAll()
    },
    collapseAll() { 
      this.$refs.tree[this.tab].collapseAll()
    },
    url(url) {
      this.loadingURL = true
      url = (url.includes('http://')) ? url.replace('http://', 'https://') : url
      fetch(url).then(resp => { return resp.json() }).then((data) => {
        this.tabAddWithData(data)
        this.loadingURL = false
      }).catch((err) => {
        console.log(err)
        this.loadingURL = false
      })
    },
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

      this.$nextTick(() => {
        this.tab = this.tabs.length - 1
      });
    },
    tabAddWithData(data) {
      this.tabs.push({
        name: 'Tab ' + this.currentTabNumber,
        json: JSON.stringify(data, null, 4),
        num: this.currentTabNumber
      })
      this.currentTabNumber++

      this.$nextTick(() => {
        this.tab = this.tabs.length - 1
      });
    },
    duplicate(i) {
      this.tabs.splice(i+1,0,{
        name: 'Tab ' + this.currentTabNumber,
        json: this.tabs[i].json,
        num: this.currentTabNumber
      })
      this.currentTabNumber++

      this.$nextTick(() => {
        this.tab = i + 1
      });
    },
    closeLeft(i) {
      if(i < this.tab) this.tab--
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
      this.dynHeight = (vh100 - 235) + 'px'
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
      var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(this.tabs[i].json);
      var downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href",     dataStr);
      downloadAnchorNode.setAttribute("download", "inspect.json");
      downloadAnchorNode.style.position = 'absolute';
      downloadAnchorNode.style.left = '-9999px';
      document.body.appendChild(downloadAnchorNode); // required for firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();

      //this.topMenuVisible = false
    },
    downloadXML(i) {
      let dataRaw = this.json2xml(JSON.parse(this.tabs[i].json))
      let dataStr = "data:text/xml;charset=utf-8," + encodeURIComponent(dataRaw);

      var downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href",     dataStr);
      downloadAnchorNode.setAttribute("download", "inspect.xml");
      downloadAnchorNode.style.position = 'absolute';
      downloadAnchorNode.style.left = '-9999px';
      document.body.appendChild(downloadAnchorNode); // required for firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();

      //this.topMenuVisible = false
    },
    downloadCSV(i) {
      let dataRaw = this.ConvertToCSV(this.tabs[i].json)
      let dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(dataRaw);

      var downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href",     dataStr);
      downloadAnchorNode.setAttribute("download", "inspect.csv");
      downloadAnchorNode.style.position = 'absolute';
      downloadAnchorNode.style.left = '-9999px';
      document.body.appendChild(downloadAnchorNode); // required for firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();

      //this.topMenuVisible = false
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
    },
    validJSON: function () {
      // `this` points to the vm instance
      let source = ''
      if(this.tabs.length > 0 && this.tab < this.tabs.length) source = this.tabs[this.tab].json
      
      if(source == '') return {color: '#aaa', text: 'No input'}

      let valid = {color: '#86b25c', text: 'Valid JSON'}

      try {
        JSON.parse(source)
      } catch {
        valid = {color: '#ec5f66', text: 'Invalid JSON'}
      }

      return valid
    },
  },

  computed: {
    disabled: function() {
      if(this.tabs.length > 0 && this.tab < this.tabs.length) {
        return this.tabs[this.tab].json.length == 0
      } else {
        return true
      }
      
    }
  }
};
</script>

<style lang="scss" scoped>
.cheightf {
  height: calc(100vh - 165px);
}
.scroll {
  overflow: auto;
  height: calc(100% - 50px);
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
  
}

.cscroll {
  &::-webkit-scrollbar {
    width: 14px;
    height: 18px;
  }
  &::-webkit-scrollbar-thumb {
      height: 6px;
      border: 4px solid rgba(0, 0, 0, 0);
      background-clip: padding-box;
      -webkit-border-radius: 7px;
      background-color: rgba(0, 0, 0, 0.45);
      //-webkit-box-shadow: inset -1px -1px 0px rgba(0, 0, 0, 0.05), inset 1px 1px 0px rgba(0, 0, 0, 0.05);
  }
  &::-webkit-scrollbar-button {
      width: 0;
      height: 0;
      display: none;
  }
  &::-webkit-scrollbar-corner {
      background-color: transparent;
  }

  &::v-deep textarea {
    font-size: 0.95em;
    line-height: 1.6em;

    &::-webkit-scrollbar {
      width: 14px;
      height: 18px;
    }
    &::-webkit-scrollbar-thumb {
        height: 6px;
        border: 4px solid rgba(0, 0, 0, 0);
        background-clip: padding-box;
        -webkit-border-radius: 7px;
        background-color: rgba(0, 0, 0, 0.45);
        //-webkit-box-shadow: inset -1px -1px 0px rgba(0, 0, 0, 0.05), inset 1px 1px 0px rgba(0, 0, 0, 0.05);
    }
    &::-webkit-scrollbar-button {
        width: 0;
        height: 0;
        display: none;
    }
    &::-webkit-scrollbar-corner {
        background-color: transparent;
    }
  }
}
</style>