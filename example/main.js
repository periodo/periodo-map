var root = document.body.appendChild(document.createElement('div'))
var level = require('level-browserify')
var hyperdrive = require('hyperdrive')
var hyperlog = require('hyperlog')
var to = require('to2')
var collect = require('collect-stream')
var pump = require('pump')
var periododb = require('periodo-db')
var readFile = require('filereader-stream')
var idb = require('random-access-idb')('pdb-drive')

var html = require('choo/html')
var app = require('choo')()

var now = typeof performance !== 'undefined'
  ? performance.now.bind(performance) : Date.now.bind(Date)

var pdb = periododb({
  archive: hyperdrive(idb),
  db: level('pdb.db'),
  log: hyperlog(level('pdb.log'), { valueEncoding: 'json' })
})
app.route('*', require('./page.js'))

var mixmap = require('mixmap')
var regl = require('regl')
var pmap = require('../')

app.use(function (state, emitter) {
  state.mix = mixmap(regl, { extensions: ['oes_element_index_uint'] })
  state.pmap = pmap(state.mix, {
    layers: require('./layers.json'),
    path: 'tiles'
  })
  emitter.on('show', function (geoid) {
    collect(pdb.geometry(geoid), function (err, body) {
      if (err) return console.error(err)
      try { var geometry = JSON.parse(body.toString()) }
      catch (err) { return console.error(err) }
      state.pmap.display({ geometry: geometry })
    })
  })
  window.addEventListener('resize', function () {
    emitter.emit('render')
  })
  window.addEventListener('keydown', function (ev) {
    if (ev.code === 'Equal') {
      state.pmap.map.setZoom(Math.min(6,Math.round(state.pmap.map.getZoom()+1)))
    } else if (ev.code === 'Minus') {
      state.pmap.map.setZoom(state.pmap.map.getZoom()-1)
    }
  })
})

app.use(function (state, emitter) {
  state.list = []
  state.query = ''
  emitter.on('upload', function (files) {
    for (var i = 0; i < files.length; i++) load(files[i])
    function load (file) {
      var start = now()
      readFile(file).pipe(pdb.load())
        .on('finish', function () {
          emitter.emit('elapsed','upload',now()-start)
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
    emitter.emit('render')
  })
  emitter.on('elapsed', function (type, ms) {
    console.log(type + ': ' + ms + ' ms')
  })
  emitter.emit('search')
})

app.mount('body')
