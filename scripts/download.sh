#!/bin/bash
#wget -r -A '*.mbtiles' 'http://awmc.unc.edu/awmc/map_data/mbtiles/'
#wget -r -A '*.shp,*.dbf,*.prj,*.qpj,*.sbn,*.sbx,*.shx' http://awmc.unc.edu/awmc/map_data/shapefiles/
#curl -O http://biogeo.ucdavis.edu/data/gadm2.8/gadm28.shp.zip
#mkdir gadm
#unzip gadm28.shp.zip -d gadm
#ogr2ogr -f GeoJSON gadm.json gadm/gadm28.shp -lco RFC7946=YES
curl -o geonames-links.ttl.bz2 http://downloads.dbpedia.org/2016-04/core-i18n/en/geonames_links_en.ttl.bz2
bunzip2 geonames-links.ttl.bz2
curl -o cities1000.zip http://download.geonames.org/export/dump/cities1000.zip
curl -o all-countries.zip http://download.geonames.org/export/dump/allCountries.zip
