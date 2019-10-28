
document.addEventListener("DOMContentLoaded", function() {
    // this function runs when the DOM is ready, i.e. when the document has been parsed
    //EventListener Suchen Button
    document.querySelector('#search').addEventListener('click', search);

});


let map;
let layer_mapnik;
let layer_markers;
let marker;




function initMap(lon, lat){
    console.log("initMap()")

   //let popuptext="<font color=\"black\"><b>Thomas Heiles<br>Stra&szlig;e 123<br>54290 Trier</b><p><img src=\"test.jpg\" width=\"180\" height=\"113\"></p></font>";

    OpenLayers.Lang.setCode('de');

    // Position und Zoomstufe der Karte
  /*  let lon = 8.4039444444444;
    let lat = 49.009194444444;*/
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
    addMarker(layer_markers, lon, lat);
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

    marker = new OpenLayers.Marker(ll);
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

function getLocation(){

    if (navigator.geolocation) {
        // getCurrentPosition ruft die Funktion success auf und übermittelt die Position Werte
        // error wird ausgeführt wenn es einen Fehler beim ermitteln der Position gibt
        navigator.geolocation.getCurrentPosition(successGeo, errorGeo);
    } else {
        alert("GeoLocation API ist NICHT verfügbar!");
    }
}

function successGeo(position) {
    lat = position.coords.latitude;
    long = position.coords.longitude;
    initMap(long, lat);
}

function errorGeo(msg) {
    console.log(typeof msg == 'string' ? msg : "error");
    initMap(8.4039444444444, 49.009194444444);
}

function search(){
    let product = document.querySelector('#search_product').value;
    console.log(product);

    let place = document.querySelector("#search_place").value;
    console.log(place);

    if (place != ""){
        searchPlace(place);
    }

}

function searchPlace(place){
    let request = new XMLHttpRequest();
    let url = 'https://nominatim.openstreetmap.org/search?q='+ place + '&format=json';
    console.log(url);
    request.open('GET', url, true);

    request.onload = function() {
        let lat = null;
        let lon = null;

        let data = JSON.parse(this.response);
        console.log(data);
        lat = parseFloat(data[0].lat);
        lon = parseFloat(data[0].lon);

        jumpTo(lon, lat, 12);
        addMarker(layer_markers, lon, lat,);

    }

    request.send();
}
