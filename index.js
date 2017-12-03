var mixtiles = require('mixmap-tiles')
var tilexhr = require('mixmap-tiles/xhr')
var createMesh = require('earth-mesh')
var zoomTo = require('mixmap-zoom')

module.exports = Map

function Map (mix, opts) {
  if (!(this instanceof Map)) return new Map(mix, opts)
  if (!opts) opts = {}
  this.map = mix.create()
  this.tiles = mixtiles(this.map, {
    layers: opts.layers || [],
    path: opts.path,
    load: tilexhr
  })
  this.draw = {}
  this.draw.triangle = this.map.createDraw({
    frag: `
      void main () {
        gl_FragColor = vec4(1,0,0,0.2);
      }
    `,
    uniforms: {
      zindex: 100
    },
    blend: {
      enable: true,
      func: { src: 'src alpha', dst: 'one minus src alpha' }
    },
    attributes: {
      position: this.map.prop('positions')
    },
    elements: this.map.prop('cells')
  })
}

Map.prototype.display = function (geometry) {
  var mesh = createMesh(geometry)
  this.draw.triangle.props = [mesh.triangle]
  this.map.draw()

  var bbox = [180,90,-180,-90]
  for (var i = 0; i < mesh.triangle.positions.length; i++) {
    bbox[0] = Math.min(bbox[0], mesh.triangle.positions[i][0])
    bbox[1] = Math.min(bbox[1], mesh.triangle.positions[i][1])
    bbox[2] = Math.max(bbox[2], mesh.triangle.positions[i][0])
    bbox[3] = Math.max(bbox[3], mesh.triangle.positions[i][1])
  }
  zoomTo(this.map, {
    viewbox: bbox,
    duration: 500,
    padding: 1
  })
}

Map.prototype.render = function (opts) {
  return this.map.render(opts)
}
