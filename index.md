# QGIS 101
With a side dish of Statistics Norway


---

<small> by Lasse Gullvåg Sætre, for</small>

<img src="https://www.jernbanedirektoratet.no/globalassets/logo/jb_logo_web.png?scale=NoTransform" style="border: none; box-shadow: none;"/>

---

## This tutorial covers

* Basic usage of QGIS
  * Importing layers
  * Joining two layers
* QGIS plugins
*  Geospatial analysis

Note:
* Basic usage of QGIS
  * Importing a Web Map Server layer
  * Importing non-spatial data (.csv file)
  * Importing a vector layer (ESRI shapefile)
* Joining two layers
  * Joining tabular data with vector shapefile
* QGIS plugins *- we'll try the Quick OSM plugin*
  * Import specific features from OpenStreetMap
* Geospatial analysis
  * Buffer
  * Count features in polygon

---

First things first

## [Download QGIS](http://qgis.org/en/site/)

---

## Not so short, but sweet.. (1/2)

You'll be familiar with QGIS, the leading Free and Open Source Software (FLOSS) Geographic Information System (GIS) application.

The guide covers importing and working on several kinds of data, and join data that isn't georeferenced with data that is.

---

## Not so short, but sweet.. (2/2)

Through the usage of plugins, you are able to access the continuously expanding information in the OpenStreetMap database.

You will also have learned how to make use of SSB Grid, not just as a static image to look at, but as data to count, manipulate and play with.

---

## Install and open QGIS

* Double click installer and jam next in Windows
* Install from repository in Linux
* Drag to application folder in Mac OSX

**Open QGIS Desktop**

(we will not use QGIS Browser here)

---

image of what you should see. Let everyone catch up.

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Equus_asinus_Kadzid%C5%82owo_001.jpg/640px-Equus_asinus_Kadzid%C5%82owo_001.jpg" />

---

<!-- .slide: data-transition="zoom" -->
Part 1:

# Begone blank map

---

## Add some WFS layers (1/2)

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Equus_asinus_Kadzid%C5%82owo_001.jpg/640px-Equus_asinus_Kadzid%C5%82owo_001.jpg" />

<small>All images will be replaced with my own</small>

---

## Add some WFS layers (2/2)

Kartverket Gråtone WFS:

**http://wms.geonorge.no/skwms1/wms.topo2.graatone?request=GetCapabilities&service=WMS**

<small>Choose Norwegian standard projection: WGS 84 / UTM Zone 33 (EPSG 32633)</small>

SSB:

http://ogc.ssb.no/wms.ashx?service=wms&request=getcapabilities

<small>Whichever layer, but I recommend 5km grid for performance. This tutorial goes on with population data. EPSG 32633 should be the projection.</small>

FKB:

*Did not work when i tested it. E-mail technical contact?*

---

**Very good**. You now posses the ability to gather a display large amounts of data through Web Map Servers (WMS). Norwegian data can be found here:

## https://www.geonorge.no/

---

<!-- .slide: data-transition="zoom" -->
Part 2:
# Drawing in the data

---

Where we visit

<img src="https://www.ssb.no/_public/skins/advanced/ssb.no/images/SSB_logo_fb.png" style="border: none; box-shadow: none;" />

---

Theory:

### Grid shape

### Tabular data

---

## Just join them
<img src="https://i.imgur.com/HVD0U.png" style="border: none; box-shadow: none;" />

---

<img src="https://38.media.tumblr.com/63b19d2fa98932419fb6553a1dfd0b1f/tumblr_mk981oqrW51s8spqco1_500.gif" />

---

## Join by attribute

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Equus_asinus_Kadzid%C5%82owo_001.jpg/640px-Equus_asinus_Kadzid%C5%82owo_001.jpg" />

<small>All images will be replaced with my own</small>

---
