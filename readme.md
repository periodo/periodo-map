# periodo-map

display historical maps

# example

To run the demo, first download the public domain natural earth surface relief
tiles from one of these sources:

* `ipfs get -o ne2srw /ipfs/QmV5PLazMsBk8bRhRAyDhNuJt9N19cjayUSDvw8DKxSmFz`
* `dat clone dat://db9c54fd4775da34109c9afd366cac5d3dff26c6a3902fc9c9c454193b543cbb ne2srw`
* https://ipfs.io/ipfs/QmV5PLazMsBk8bRhRAyDhNuJt9N19cjayUSDvw8DKxSmFz
* https://ne2srw-tiles-substack.hashbase.io/

Copy (or make a symlink) of that ne2srw directory into example/tiles so that
`example/tiles/tiles.json` exists.

Now you can do `npm run dev` to run a dev server with the example code in
example/main.js.
