#!/bin/bash
curl -O http://biogeo.ucdavis.edu/data/gadm2.8/gadm28.shp.zip
mkdir gadm
unzip gadm28.shp.zip -d gadm
ogr2ogr -f GeoJSON gadm.json gadm/gadm28.shp -lco RFC7946=YES
