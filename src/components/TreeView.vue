<template>
  <div class="root" v-bind:class="name"></div>
</template>

<script>
	import jsonView from '../assets/js/jsonview.js'

  export default {
    name: 'tree-view',
		components: {},
    props: { json: { type: String }, index: { type: Number } },
    watch: {
      json: function (current) {
        this.tree = jsonView.format(current, '.tab' + this.index)
			}
    },
    computed: {
      name: function () {
        return 'tab' + this.index
			}
		},
		methods: {
			expandCollapseAll: function () {
				this.expanded = !this.expanded
				this.expandCollapseRecursive(this.tree)
			},
			expandCollapseRecursive: function(tree) {
				//console.log(tree)
				if(tree.children == null) return

				tree.children.forEach((branch) => {
					if(branch.children != null) {
						this.expandCollapseRecursive(branch)
						if(branch.expanded != this.expanded) branch.toggle()
					}
				})

				if(tree.expanded != this.expanded) tree.toggle()
			}
		},
		data: () => ({
			tree: null,
			expanded: true
		}),
		mounted() {
			this.tree = jsonView.format(this.json, '.tab' + this.index)
		}
  }
</script>

<style>
body {
	font-family: 'Open Sans';
	font-size: 16px;
	background-color: #fff;
	color: #808080;
	box-sizing: border-box;
}

.line {
	margin: 4px 0;
	display: flex;
	justify-content: flex-start;
}

.caret-icon {
	width: 18px;
	text-align: center;
	cursor: pointer;
}

.empty-icon {
	width: 18px;
}

.json-type {
	margin-right: 4px;
	margin-left: 4px;
}

.json-key {
	color: #444;
	margin-right: 4px;
	margin-left: 4px;
}

.json-index {
	margin-right: 4px;
	margin-left: 4px;
}

.json-value {
	margin-left: 8px;
}

.json-number {
	color: #f9ae58;
}

.json-boolean {
	color: #ec5f66;
}

.json-string {
	color: #86b25c;
}

.json-size {
	margin-right: 4px;
	margin-left: 4px;
}

.hide {
	display: none;
}

.fas {
	display: inline-block;
	width: 0;
	height: 0;
	border-style: solid;
}

.fa-caret-down {
	border-width: 6px 5px 0 5px;
	border-color: #808080 transparent
}

.fa-caret-right {
	border-width: 5px 0 5px 6px;
	border-color: transparent transparent transparent #808080;
}

.url {
	text-decoration: underline;
}

.url:hover {
	cursor: pointer;
	color: #688b47;
}
</style>
