"use strict";

import stylesheet from "./start-page.css";

let _app = "";
let _db = "";

let _map;
let _layer_mapnik;
let _layer_markers;
let _lat;
let _lon;
let _allQuery;

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
    document.getElementById("search_product").addEventListener("keyup", (e) => enter(e));
    document.getElementById("search_place").addEventListener("keyup", (e) => enter(e));
    //document.querySelector('.profil').addEventListener('click', function() {
    //  _app._router.navigate("/profile/B5XVhr9QWJa5T2NvSsAyg46awAg1");
    //});
    console.log('Page loaded');
  }


  onLeave(goon) {
    return true;
  }

  get title() {
    return "Kaufe von Landwirten in deiner Region!";
  }
}

function initMap(){
    console.log("initMap()")

    //let popuptext="<font color=\"black\"><b>Thomas Heiles<br>Stra&szlig;e 123<br>54290 Trier</b><p><img src=\"test.jpg\" width=\"180\" height=\"113\"></p></font>";

    //Karte initialisieren
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

    _allQuery = _db.getAllProfiles(); //lokale Kopie der DB
    console.log(_allQuery);

    //Marker
    _layer_markers = new OpenLayers.Layer.Markers("Address", { projection: new OpenLayers.Projection("EPSG:4326"),
        visibility: true, displayInLayerSwitcher: false });
    _layer_mapnik = new OpenLayers.Layer.OSM.Mapnik("Mapnik");
    _map.addLayers([_layer_mapnik, _layer_markers]);

    _allQuery.then(function(querySnapshot){
        querySnapshot.forEach(function(doc) {
            //if (typeof querySnapshot !== "undefined"){
                console.log(doc.id, "=>", doc.data());
                addMarker( doc.data().lon, doc.data().lat);
                setDiv(doc.id, doc.data());
            //}

        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        })
    });

    jumpTo(zoom);
}

function jumpTo(zoom) {
    let x = Lon2Merc(_lon);
    let y = Lat2Merc(_lat);
    _map.setCenter(new OpenLayers.LonLat(x, y), zoom);
    return false;
}

/*function setELProfiles(){

    let profilesArray = document.querySelectorAll(".profil");
    console.log(profilesArray);

    profilesArray.forEach(function(element){
        element.addEventListener('click', function() {
            _app._router.navigate("/profile/B5XVhr9QWJa5T2NvSsAyg46awAg1");
        });
    });
}*/

function Lon2Merc(lon) {
    return 20037508.34 * lon / 180;
}

function Lat2Merc(lat) {
    let PI = 3.14159265358979323846;
    let lat_neu = Math.log(Math.tan( (90 + lat) * PI / 360)) / (PI / 180);
    return 20037508.34 * lat_neu / 180;
}

function addMarker(lon, lat) {
    console.log(lon, lat);
    let lonLat = new OpenLayers.LonLat(Lon2Merc(lon), Lat2Merc(lat));
    _layer_markers.addMarker(new OpenLayers.Marker(lonLat));
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
    let place = document.querySelector("#search_place").value;

    document.getElementById("search_product").style.borderColor = "white";
    document.getElementById("search_place").style.borderColor = "white";

    console.log(product);
    console.log(place);

    if (place != "" && product != ""){
       // searchBoth(product, place);
        searchPlace(place);
        searchProduct(product);
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

        //Divs zur Auswahl
        deleteProfiles();

        _allQuery.then(function(querySnapshot){
            querySnapshot.forEach(function(doc){
                //if (typeof querySnapshot !== "undefined") {
                    console.log(doc.id, "=>", doc.data());
                    setDiv(doc.id, doc.data());
               // }
            });
        })
            .catch(function(error) {
                console.log("Error setting Divs: " , error);
            });

    }
    request.send();

}

function searchProduct(product){
    console.log(product);

    deleteProfiles();

    _allQuery.then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            if (typeof doc.data().produce !== "undefined") {
                doc.data().produce.forEach(function (element) {
                    if (element.name == product){
                        setDiv(doc.id, doc.data());
                    }
                })
            }
        });
    })
        .catch(function(error) {
            console.log("Error getting Products: " , error);
        });
}

function searchBoth(product, place){

}

function noInput(){
    document.getElementById("search_product").style.borderColor = "red";
    document.getElementById("search_place").style.borderColor = "red";
}

function enter(event){
    if (event.keyCode === 13) {
        search()
    }
}

function getDistance(lon1, lat1,){
    //entfernung zum Kartenmittelpunkt in km, Quelle: https://www.kompf.de/gps/distcalc.html
    console.log("Bauer: ", parseFloat(lon1), parseFloat(lat1), " Zentrum: ", _lon, _lat);

    let lat = (parseFloat(lat1) + _lat) / 2 * 0.01745; //Umrechnung in Bogenmaß
    let dx = 111.3 * Math.cos(lat) * (parseFloat(lon1) - _lon);
    let dy = 111.3 * (parseFloat(lat1) - _lat);

    console.log( lat, dx, dy);
    let distance = Math.sqrt(dx * dx + dy * dy);
    console.log(distance);
    return distance;
}

function setDiv(id, daten){
    let distance = getDistance(daten.lon, daten.lat);
    console.log(distance);
    if (distance <=  50){                                       //zeigt nur Datensätze an die näher als 50 km zum Kartenmittelpunkt sind
        let child = document.createElement("div");
        let parent = document.getElementById("liste");
        child.className = "profil";
        parent.appendChild(child);
        let adresse = daten.name + "<br />";
        if (typeof(daten.postcodeTown) != "undefined") {
          adresse += daten.postcodeTown + "<br />";
        }
        adresse += parseInt(distance) + " km entfernt"
        
        child.innerHTML = adresse;
            parseInt(distance) + " km entfernt";
        child.addEventListener('click', function() {
            _app._router.navigate("/profile/" + id);
        });
    }
}

function deleteProfiles() {
    let parent = document.getElementById("liste");
    if (parent.hasChildNodes()){
        while(parent.firstChild){
            parent.firstChild.remove()
        }
    }
}

export default StartPage;
