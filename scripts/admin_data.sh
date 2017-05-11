#!/bin/bash
curl -O http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/10m_cultural.zip
unzip 10m_cultural.zip
for x in 10m_cultural/ne_10m_admin_*.shp; do
  ogr2ogr -f GeoJSON `basename $x | sed 's/\.shp$/.json/'` $x
done
