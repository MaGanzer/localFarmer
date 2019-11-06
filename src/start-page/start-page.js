"use strict";

import stylesheet from "./start-page.css";

let _app = "";
let _db = "";

let _map;
let _layer_mapnik;
let _layer_markers;
let _marker;
let _lat;
let _lon;

class StartPage {
  constructor(app) {
    this._app = app;
    _app = this._app;
    _db = app._db;
  }

  onShow() {
    // Anzuzeigende HTML-Elemente ermitteln
    let section = document.querySelector("#start-page").cloneNode(true);

    return {
        className: "start-page",
        topbar: section.querySelectorAll("header > *"),
        main: section.querySelectorAll("main > *"),
    };
  }

  onLoad() {
    getLocation();

    document.querySelector('#search').addEventListener('click', search);
    document.querySelector("#ZuAngebot").addEventListener('click', function() {
      _app._router.navigate("/angebot");
    });
    document.querySelector('.profil').addEventListener('click', function() {
      _app._router.navigate("/profil");
    });
    document.getElementById("search_product").addEventListener("keyup", (e) => enter(e));
    document.getElementById("search_place").addEventListener("keyup", (e) => enter(e));
    console.log('Page loaded');
  }

  onLeave(goon) {
    return true;
  }

  get title() {
    return "Lokal ist locool!";
  }
}

function initMap(){
    console.log("initMap()")

    //let popuptext="<font color=\"black\"><b>Thomas Heiles<br>Stra&szlig;e 123<br>54290 Trier</b><p><img src=\"test.jpg\" width=\"180\" height=\"113\"></p></font>";

    OpenLayers.Lang.setCode('de');

    let zoom = 12;

    _map = new OpenLayers.Map('karte', {
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

    _layer_mapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik");
    _layer_markers = new OpenLayers.Layer.Markers("Address", { projection: new OpenLayers.Projection("EPSG:4326"),
        visibility: true, displayInLayerSwitcher: false });

    _map.addLayers([_layer_mapnik, _layer_markers]);
    jumpTo(zoom);
}

function jumpTo(zoom) {
    let x = Lon2Merc();
    let y = Lat2Merc();
    _map.setCenter(new OpenLayers.LonLat(x, y), zoom);
    return false;
}

function Lon2Merc() {
    return 20037508.34 * _lon / 180;
}

function Lat2Merc() {
    let PI = 3.14159265358979323846;
    let lat = Math.log(Math.tan( (90 + _lat) * PI / 360)) / (PI / 180);
    return 20037508.34 * lat / 180;
}

function addMarker(layer, lon, lat, popupContentHTML) {

    let ll = new OpenLayers.LonLat(Lon2Merc(lon), Lat2Merc(lat));
    let feature = new OpenLayers.Feature(layer, ll);
    feature.closeBox = true;
    feature.popupClass = OpenLayers.Class(OpenLayers.Popup.FramedCloud, {minSize: new OpenLayers.Size(300, 180) } );
    feature.data.popupContentHTML = popupContentHTML;
    feature.data.overflow = "hidden";

    _marker = new OpenLayers.Marker(ll);
    _marker.feature = feature;

    let markerClick = function(evt) {
        if (this.popup == null) {
            this.popup = this.createPopup(this.closeBox);
            _map.addPopup(this.popup);
            this.popup.show();
        } else {
            this.popup.toggle();
        }
        OpenLayers.Event.stop(evt);
    };
    _marker.events.register("mousedown", feature, markerClick);

    layer.addMarker(_marker);
    _map.addPopup(feature.createPopup(feature.closeBox));
}

function getLocation(){

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successGeo, errorGeo);
    } else {
        alert("GeoLocation API ist NICHT verfügbar!");
    }
}

function successGeo(position) {
    console.log("Standortabfrage erlaubt");
    _lat = position.coords.latitude;
    _lon = position.coords.longitude;
    initMap();
}

function errorGeo(msg) {
    console.log("Standortabfrage abgelehnt");
    console.log(typeof msg == 'string' ? msg : "error");
    //Karlsruhe
    _lat = 49.009194444444;
    _lon = 8.4039444444444;
    initMap();
}

function search(){
    let product = document.querySelector('#search_product').value;
    console.log(product);

    let place = document.querySelector("#search_place").value;
    console.log(place);

    if (place != "" && product != ""){
        searchPlace(place);
    }else if(place != ""){
        searchPlace(place);
    } else if(product != ""){
        searchProduct(product);
    }else{
        noInput();
    }
}

function searchPlace(place){
    let request = new XMLHttpRequest();
    let url = 'https://nominatim.openstreetmap.org/search?q='+ place + '&format=json';
    console.log(url);
    request.open('GET', url, true);

    request.onload = function() {

        let data = JSON.parse(this.response);
        console.log(data);
        _lat = parseFloat(data[0].lat);
        _lon = parseFloat(data[0].lon);

        jumpTo(12);
    }

    request.send();
}

function searchProduct(product){

}

function noInput(){
    document.getElementById("search_product").style.borderColor = "red";
    document.getElementById("search_place").style.borderColor = "red";
}

export default StartPage;
