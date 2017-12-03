var root = document.body.appendChild(document.createElement('div'))
var level = require('level-browserify')
var hyperdrive = require('hyperdrive')
var hyperlog = require('hyperlog')
var to = require('to2')
var pump = require('pump')
var periododb = require('periodo-db')
var readFile = require('filereader-stream')
var idb = require('random-access-idb')('pdb-drive')

var html = require('choo/html')
var app = require('choo')()

var now = typeof performance
  ? performance.now.bind(performance) : Date.now.bind(Date)

var pdb = periododb({
  archive: hyperdrive(idb),
  db: level('pdb.db'),
  log: hyperlog(level('pdb.log'), { valueEncoding: 'json' })
})
app.route('/', function (state, emit) {
  return html`<body>
    <style>
      form {
        margin-bottom: 0.5em;
      }
      .period .title {
        font-weight: bold;
      }
      .period {
        width: 100%;
        background-color: transparent;
        border-width: 0px;
        text-align: left;
        cursor: pointer;
        margin-bottom: 0.5em;
        padding-left: 10px;
        padding-top: 5px;
        padding-bottom: 5px;
      }
      .period:hover {
        background-color: #c0c0ff;
      }
      .periods {
        margin-top: 1em;
        width: 100%;
      }
      .left {
        position: absolute;
        left: 0px;
        bottom: 0px;
        top: 0px;
        width: 300px;
        height: 100%;
        overflow: scroll;
      }
      .right {
        background-color: purple;
        position: absolute;
        top: 0px;
        left: 300px;
        right: 0px;
        bottom: 0px;
        height: 100%;
      }
    </style>
    <div class="left">
      <form>
        <input type="file" onchange=${upload} />
      </form>
      <form onsubmit=${search}>
        <input type="text" name="search"
          value=${state.query} placeholder="label search">
      </form>
      <div class="periods">
        ${state.list.map(listItem)}
      </div>
    </div>
    <div class="right">
      ...
    </div>
  </body>`
  function search (ev) {
    ev.preventDefault()
    emit('search', this.elements.search.value)
  }
  function upload (ev) {
    emit('upload', ev.target.files)
  }
  function listItem (item) {
    var props = item.value.properties
    return html`<button class="period">
      <div class="title">${props.label}</div>
      <div>
        ${prop(item,'value.properties.start.label','')}
        —
        ${prop(item,'value.properties.stop.label','')}
      </div>
      ${Object.keys(props.localizedLabels || {}).map(function (key) {
        return html`<div>${props.localizedLabels[key]} (${key})</div>`
      })}
    </button>`
  }
})

function prop (obj, key, alt) {
  var parts = key.split('.')
  for (var i = 0; i < parts.length; i++) {
    obj = obj[parts[i]]
    if (obj === undefined) return alt
  }
  return obj
}

app.use(function (state, emitter) {
  state.list = []
  state.query = ''
  emitter.on('upload', function (files) {
    for (var i = 0; i < files.length; i++) load(files[i])
    function load (file) {
      var start = now()
      readFile(file).pipe(pdb.load())
        .on('finish', function () {
          emitter.emit('elapsed','upload',(now()-start))
          emitter.emit('search')
        })
    }
  })
  emitter.on('search', function (q) {
    state.list = []
    state.query = q || ''
    pump(pdb.list(q), to.obj(function (row, enc, next) {
      state.list.push(row)
      emitter.emit('render')
      next()
    }))
  })
  emitter.on('elapsed', function (type, ms) {
    console.log(type + ': ' + ms + ' ms')
  })
  emitter.emit('search')
})

app.mount('body')

/*
var regl = require('regl')()
var camera = require('regl-camera')(regl, { distance: 3 })
var proj = require('proj4')

function toMesh (geojson) {
}

function drawMesh (regl, mesh) {
  return regl({
    frag: `
      precision highp float;
      void main () {
        gl_FragColor = vec4(1,0,0,1);
      }
    `,
    vert: `
      precision highp float;
      attribute vec3 position;
      uniform mat4 projection, view;
      void main () {
        gl_Position = projection * view * vec4(position,1);
      }
    `,
    attributes: {
      position: mesh.positions
    },
    elements: mesh.cells
  })
}
*/
