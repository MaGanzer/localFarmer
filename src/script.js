



/*
function initMap() {
    console.log("HalloWelt")
    let options = {
        center: {lat: 49.0,lng: 8.4},
        zoom: 4,
    };
    map = new google.maps.Map(document.getElementById("karte"), options);
}*/
let map;
let layer_mapnik;
let layer_markers;
let layer_tah;

function initMap(){
    console.log("initMap()")

   //let popuptext="<font color=\"black\"><b>Thomas Heiles<br>Stra&szlig;e 123<br>54290 Trier</b><p><img src=\"test.jpg\" width=\"180\" height=\"113\"></p></font>";

    OpenLayers.Lang.setCode('de');

    // Position und Zoomstufe der Karte
    let lon = 8.4039444444444;
    let lat = 49.009194444444;
    let zoom = 12;

    map = new OpenLayers.Map('karte', {
        projection: new OpenLayers.Projection("EPSG:900913"),
        displayProjection: new OpenLayers.Projection("EPSG:4326"),
        controls: [
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.LayerSwitcher(),
            new OpenLayers.Control.PanZoomBar()],
        maxExtent:
            new OpenLayers.Bounds(-20037508.34,-20037508.34,
                20037508.34, 20037508.34),
        numZoomLevels: 18,
        maxResolution: 156543,
        units: 'meters'
    });

    layer_mapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik");
    layer_markers = new OpenLayers.Layer.Markers("Address", { projection: new OpenLayers.Projection("EPSG:4326"),
        visibility: true, displayInLayerSwitcher: false });

    map.addLayers([layer_mapnik, layer_markers]);
    jumpTo(lon, lat, zoom);

    // Position des Markers
    addMarker(layer_markers, 8.4039444444444, 49.009194444444);
}

function jumpTo(lon, lat, zoom) {
    let x = Lon2Merc(lon);
    let y = Lat2Merc(lat);
    map.setCenter(new OpenLayers.LonLat(x, y), zoom);
    return false;
}

function Lon2Merc(lon) {
    return 20037508.34 * lon / 180;
}

function Lat2Merc(lat) {
    let PI = 3.14159265358979323846;
    lat = Math.log(Math.tan( (90 + lat) * PI / 360)) / (PI / 180);
    return 20037508.34 * lat / 180;
}

function addMarker(layer, lon, lat, popupContentHTML) {

    let ll = new OpenLayers.LonLat(Lon2Merc(lon), Lat2Merc(lat));
    let feature = new OpenLayers.Feature(layer, ll);
    feature.closeBox = true;
    feature.popupClass = OpenLayers.Class(OpenLayers.Popup.FramedCloud, {minSize: new OpenLayers.Size(300, 180) } );
    feature.data.popupContentHTML = popupContentHTML;
    feature.data.overflow = "hidden";

    let marker = new OpenLayers.Marker(ll);
    marker.feature = feature;

    let markerClick = function(evt) {
        if (this.popup == null) {
            this.popup = this.createPopup(this.closeBox);
            map.addPopup(this.popup);
            this.popup.show();
        } else {
            this.popup.toggle();
        }
        OpenLayers.Event.stop(evt);
    };
    marker.events.register("mousedown", feature, markerClick);

    layer.addMarker(marker);
    map.addPopup(feature.createPopup(feature.closeBox));
}