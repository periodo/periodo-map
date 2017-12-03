var html = require('choo/html')

module.exports = function (state, emit) {
  return html`<body>
    <style>
      form {
        margin-bottom: 0.5em;
        padding: 10px;
      }
      form input[type="text"] {
        width: 100%;
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
        overflow: hidden;
      }
    </style>
    ${state.mix.render()}
    <div class="left">
      <form>
        <input type="file" onchange=${upload} />
      </form>
      <form onsubmit=${search}>
        <input type="text" name="search" autocomplete="off"
          value=${state.query} placeholder="label search">
      </form>
      <div class="periods">
        ${state.list.map(listItem)}
      </div>
    </div>
    <div class="right">
      ${state.pmap.render({
        width: window.innerWidth - 300,
        height: window.innerHeight
      })}
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
    return html`<button class="period" onclick=${show}>
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
    function show () { emit('show', item.value.geometry) }
  }
}

function prop (obj, key, alt) {
  var parts = key.split('.')
  for (var i = 0; i < parts.length; i++) {
    obj = obj[parts[i]]
    if (obj === undefined) return alt
  }
  return obj
}
