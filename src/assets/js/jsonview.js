'use strict'

import { EventBus } from './event.js';

/*function isURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

function isDate(date) {
  let regex = /^([+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24:?00)([.,]\d+(?!:))?)?(\17[0-5]\d([.,]\d+)?)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/g
  return date.match(regex)
}*/

/**
   * Create html element
   * @param {String} type html element
   * @param {Object} config
   */
function createElement (type, config) {
  const htmlElement = document.createElement(type)

  if (config === undefined) {
    return htmlElement
  }

  if (config.className) {
    htmlElement.className = config.className
  }

  if (config.content) {
    if(config.typeOf == 'string') htmlElement.textContent = '"' + config.content + '"'
    else htmlElement.textContent = config.content

    if(config.date && config.date.length > 0) htmlElement.innerHTML += '<img style="margin-left: 5px;" height="12px" title="' + config.date + '" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABOklEQVQ4T53TvUoeQBCF4Uct0qQTQRsTwXgHeg0SEGyCGLwD/yAWWgQtVLBTg8FcQFBSB0GxTqm1IEawEkQtJFUihoHdsHzuZ9Qt5+y8OzM7p8X904dB9KAVbfiNn9jFcZnS0pA/hlfp4imukt6e4m8TaCvnlYApnGCnUlUZGkI3PkcwA+Ll60ckZ1BAXmI7ANHzOyxXXp7BLdYq2jy2AhCl/8BB5VIX7nBe0QYwEIBVLBYDK+/Gb0QF+xVAB+YCsI7pJoP7iD9YaaJvBGADE88EbOYWlnBZgTxUQbQwG4DJNMTDJwL60R+ANxhBVNF4PqQZfKpoC/iaF+k9bvD9P1uY5WG8wLdylcdx9ghIJHfiS7nKmTyaWgrXhZkukhADe40w01G8XDNTjvUWdo4yw86/kgv3kuH+dfoX1wk/cpQxqEsAAAAASUVORK5CYII=" />'
  }

  if(config.className.includes('url')) {
    htmlElement.onclick = function() {
      EventBus.$emit('openURL', config.content);
    }
  }

  if (config.children) {
    config.children.forEach((el) => {
      if (el !== null) {
        htmlElement.appendChild(el)
      }
    })
  }

  return htmlElement
}

/**
   * @param {Object} node
   * @return {HTMLElement}
   */
function createExpandedElement (node) {
  const iElem = createElement('i')

  if (node.expanded) {
    iElem.className = 'fas fa-caret-down'
  } else {
    iElem.className = 'fas fa-caret-right'
  }

  const caretElem = createElement('div', {
    className: 'caret-icon',
    children: [iElem]
  })

  const handleClick = node.toggle.bind(node)
  caretElem.addEventListener('click', handleClick)

  const indexElem = createElement('div', {
    className: 'json-index',
    content: node.key
  })

  const typeElem = createElement('div', {
    className: 'json-type',
    content: node.type
  })

  const keyElem = createElement('div', {
    className: 'json-key',
    content: node.key
  })

  const sizeElem = createElement('div', {
    className: 'json-size'
  })

  if (node.type === 'array') {
    sizeElem.innerText = '[' + node.children.length + ']'
  } else if (node.type === 'object') {
    sizeElem.innerText = '{' + node.children.length + '}'
  }

  let lineChildren
  if (node.key === null) {
    lineChildren = [caretElem, typeElem, sizeElem]
  } else if (node.parent.type === 'array') {
    lineChildren = [caretElem, indexElem, sizeElem]
  } else {
    lineChildren = [caretElem, keyElem, sizeElem]
  }

  const lineElem = createElement('div', {
    className: 'line',
    children: lineChildren
  })

  if (node.depth > 0) {
    lineElem.style = 'margin-left: ' + node.depth * 24 + 'px;'
  }

  return lineElem
}

/**
   * @param {Object} node
   * @return {HTMLElement}
   */
function createNotExpandedElement (node) {
  const caretElem = createElement('div', {
    className: 'empty-icon'
  })

  const keyElem = createElement('div', {
    className: 'json-key',
    content: node.key
  })

  const separatorElement = createElement('div', {
    className: 'json-separator',
    content: ':'
  })

  const valueType = ' json-' + typeof node.value
  //const urlUnderline = (typeof node.value == 'string' && isURL(node.value)) ? ' url' : ''
  //const dateStr = (typeof node.value == 'string' && isDate(node.value)) ? new Date(node.value).toString() : ''
  let urlUnderline = ''
  let dateStr = ''
  
  
  const valueContent = String(node.value)
  const valueElement = createElement('div', {
    className: 'json-value' + valueType + urlUnderline,
    content: valueContent,
    typeOf: typeof node.value,
    date: dateStr
  })

  const lineElem = createElement('div', {
    className: 'line',
    children: [caretElem, keyElem, separatorElement, valueElement]
  })

  if (node.depth > 0) {
    lineElem.style = 'margin-left: ' + node.depth * 24 + 'px;'
  }

  return lineElem
}

/**
   * create tree node
   * @return {Object}
   */
function createNode () {
  return {
    key: null,
    parent: null,
    value: null,
    expanded: false,
    type: null,
    children: null,
    elem: null,
    depth: 0,

    setCaretIconRight () {
      const icon = this.elem.querySelector('.fas')
      icon.classList.replace('fa-caret-down', 'fa-caret-right')
    },

    setCaretIconDown () {
      const icon = this.elem.querySelector('.fas')
      icon.classList.replace('fa-caret-right', 'fa-caret-down')
    },

    hideChildren () {
      if (this.children !== null) {
        this.children.forEach((item) => {
          item.elem.classList.add('hide')
          if (item.expanded) {
            item.hideChildren()
          }
        })
      }
    },

    showChildren () {
      if (this.children !== null) {
        this.children.forEach((item) => {
          item.elem.classList.remove('hide')
          if (item.expanded) {
            item.showChildren()
          }
        })
      }
    },

    toggle: function () {
      if (this.expanded) {
        this.expanded = false
        this.hideChildren()
        this.setCaretIconRight()
      } else {
        this.expanded = true
        this.showChildren()
        this.setCaretIconDown()
      }
    }
  }
}

/**
   * Return object length
   * @param {Object} obj
   * @return {number}
   */
/* function getLength (obj) {
    let length = 0
    for (const key in obj) {
      length += 1
    };
    return length
  } */

/**
   * Return variable type
   * @param {*} val
   */
function getType (val) {
  let type = typeof val
  if (Array.isArray(val)) {
    type = 'array'
  } else if (val === null) {
    type = 'null'
  }
  return type
}

/**
   * Recursively traverse json object
   * @param {Object} obj parsed json object
   * @param {Object} parent of object tree
   */
function traverseObject (obj, parent) {
  for (const key in obj) {
    const child = createNode()
    child.parent = parent
    child.key = key
    child.type = getType(obj[key])
    child.depth = parent.depth + 1
    child.expanded = false

    if (typeof obj[key] === 'object' && obj[key] !== null) {
      child.children = []
      parent.children.push(child)
      traverseObject(obj[key], child)
      child.elem = createExpandedElement(child)
    } else {
      child.value = obj[key]
      child.elem = createNotExpandedElement(child)
      parent.children.push(child)
    }
  }
}

/**
   * Create root of a tree
   * @param {Object} obj Json object
   * @return {Object}
   */
function createTree (obj) {
  const tree = createNode()
  tree.type = getType(obj)
  tree.children = []
  tree.expanded = true

  traverseObject(obj, tree)
  tree.elem = createExpandedElement(tree)

  return tree
}

/**
   * Recursively traverse Tree object
   * @param {Object} node
   * @param {Callback} callback
   */
function traverseTree (node, callback) {
  callback(node)
  if (node.children !== null) {
    node.children.forEach((item) => {
      traverseTree(item, callback)
    })
  }
}

/**
   * Render Tree object
   * @param {Object} tree
   * @param {String} targetElem
   */
function render (tree, targetElem) {
  let rootElem
  if (targetElem) {
    rootElem = document.querySelector(targetElem)
  } else {
    rootElem = document.body
  }

  let child = rootElem.lastElementChild
  while (child) {
    rootElem.removeChild(child)
    child = rootElem.lastElementChild
  }

  traverseTree(tree, (node) => {
    if (!node.expanded) {
      node.hideChildren()
    }
    rootElem.appendChild(node.elem)
  })
}

export default {
  /**
   * Render JSON into DOM container
   * @param {String} jsonData
   * @param {String} targetElem
   */
  format: function (jsonData, targetElem) {
    let parsedData = jsonData

    if (jsonData.length === 0) {
      let rootElem = document.querySelector(targetElem)

      let child = rootElem.lastElementChild
      while (child) {
        rootElem.removeChild(child)
        child = rootElem.lastElementChild
      }

      return
    }

    try {
      if (typeof jsonData === 'string' || jsonData instanceof String) parsedData = JSON.parse(jsonData)
      const tree = createTree(parsedData)
      render(tree, targetElem)
      return tree
    } catch (e) {
      console.log('Invalid JSON Found')
    }
  },
}
