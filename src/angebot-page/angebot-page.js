"use strict";

import stylesheet from "./angebot-page.css";


let _app = "";
let _db = "";

let _map;
let _layer_mapnik;
let _layer_markers;
let _marker;
let _lat;
let _lon;

class AngebotPage {
  constructor(app) {
    this._app = app;
    _app = this._app;
    _db = app._db;

    this._dataset = {
        first_name: "",
        last_name: "",
        street: "",
        number: "",
        city: "",
        zip: "",
        productname: [],
        quantity: [],
        price: [],
        open: "",
        phone: "",
        email: "",
    };
/*
    if (this._editIndex > -1) {
        let dataset = this._app.getDataByIndex(this._editIndex);

        this._dataset.first_name = dataset.first_name;
        this._dataset.last_name = dataset.last_name;
        this._dataset.street = dataset.street;
        this._dataset.street = dataset.number;
        this._dataset.city = dataset.city;
        this._dataset.zip = dataset.zip;
        this._dataset.productname = dataset.productname;
        this._dataset.quantity = dataset.quantity;
        this._dataset.price = dataset.price;
        this._dataset.open = dataset.open;
        this._dataset.phone = dataset.phone;
        this._dataset.email = dataset.email;
    }
    */
  }

  onShow() {
    // Anzuzeigende HTML-Elemente ermitteln
    let section = document.querySelector("#angebot-page").cloneNode(true);

    return {
        className: "angebot-page",
        topbar: section.querySelectorAll("header > *"),
        main: section.querySelectorAll("main > *"),
    };
  }

  onLoad() {
    document.querySelector('#BackToStart').addEventListener('click', function() {
     _app._router.navigate("/");
   });
   var _this=this;

   document.getElementById("SpeicherButton").addEventListener("click", function() {

    _this.popupMethode();
   //  _app._router.navigate("/");
  });
  document.getElementById("plus").addEventListener('click', function() {
   let duplizierbareUl = document.getElementById("duplicate");
   var newUl = document.createElement("ul");
   let produktFeld = document.createElement("input");
   let quantitatFeld = document.createElement("input");
   let preisFeld = document.createElement("input");
   produktFeld.classList.add("productname");

   quantitatFeld.classList.add("quantity");
   preisFeld.classList.add("price");

   produktFeld.placeholder="Produkt";
   quantitatFeld.placeholder="Quantität";
   preisFeld.placeholder="Preis";

   produktFeld.id="10";
   quantitatFeld.id="11";
   preisFeld.id="12";

   let minus= document.createElement("button");
   minus.innerHTML="-";
   minus.id="remove";
   newUl.appendChild(produktFeld);
   newUl.appendChild(quantitatFeld);
   newUl.appendChild(preisFeld);
   newUl.appendChild(minus);
   duplizierbareUl.appendChild(newUl);

   minus.addEventListener('click', function() {
     newUl.remove();
  });


 });

    console.log('Page loaded');

  }

  onLeave(goon) {
    return true;
  }

  get title() {
    return "Profil";
  }

  popupMethode(){
    let firstName = document.querySelector("#main-page-edit .first_name").value.trim();
    let lastName = document.querySelector("#main-page-edit .last_name").value.trim();
    let street = document.querySelector("#main-page-edit .street").value.trim();
    let number = document.querySelector("#main-page-edit .number").value.trim();
    let city = document.querySelector("#main-page-edit .city").value.trim();
    let zip = document.querySelector("#main-page-edit .zip").value.trim();

    let produktListe = document.querySelectorAll('#main-page-edit .productname');
    let productname = [];
    for(var i=0;i< produktListe.length-1; i++){
    alert("Dein AUfruf  " + produktListe[i].value.trim()) ;
     productname.push(produktListe[i].value.trim());
  }
  let quantitatListe = document.querySelectorAll('#main-page-edit .quantity');
  let quantity = [];
  for(var i=0;i< quantitatListe.length-1; i++){
   quantity.push(quantitatListe[i].value.trim());
  }
  let preisListe = document.querySelectorAll('#main-page-edit .price');
  let price = [];
  for(var i=0;i< preisListe.length-1; i++){
  price.push(preisListe[i].value.trim());
  }
    let open = document.querySelector("#main-page-edit .open").value.trim();
    let phone = document.querySelector("#main-page-edit .phone").value.trim();
    let email = document.querySelector("#main-page-edit .email").value.trim();

    if (firstName === "") {
        alert("1. Geben Sie erst einen Vornamen ein.");
        document.getElementById("1").style.borderColor = "red";
        return;
    }
    else{
        document.getElementById("1").style.borderColor = "";
    }

    if (lastName === "") {
        alert("2. Geben Sie erst einen Nachnamen ein.");
        document.getElementById("2").style.borderColor = "red";
        return;
    }
    else{
        document.getElementById("2").style.borderColor = "";
    }
    if (street === "") {
        alert("3. Geben Sie erst eine Straße ein.");
        document.getElementById("3").style.borderColor = "red";
        return;
    }
    else{
        document.getElementById("3").style.borderColor = "";
    }
    if (number === "") {
        alert("4. Geben Sie erst eine Hausnummer ein.");
        document.getElementById("4").style.borderColor = "red";
        return;
    }
    else{
        document.getElementById("4").style.borderColor = "";
    }
    if (city === "") {
        alert("5. Geben Sie erst eine Stadt ein.");
        document.getElementById("5").style.borderColor = "red";
        return;
    }
    else{
        document.getElementById("5").style.borderColor = "";
    }
    if (zip === "") {
        alert("6. Geben Sie erst eine Postleitzahl ein.");
        document.getElementById("6").style.borderColor = "red";
        return;
    }
    else{
        document.getElementById("6").style.borderColor = "";
    }

    if (produktListe === "") {
        alert("10. Geben Sie erst einen Produktnamen ein.");
        document.getElementById("10").style.borderColor = "red";
        return;
      }
      else{
          document.getElementById("10").style.borderColor = "";
      }
    if (quantitatListe === "") {
          alert("11. Geben Sie eine gültige Quantität ein.");
          document.getElementById("11").style.borderColor = "red";
          return;
        }
        else{
            document.getElementById("11").style.borderColor = "";
        }
    if (open === "") {
            alert("7. Geben Sie eine gültige Öfnungszeit.");
            document.getElementById("7").style.borderColor = "red";
            return;
          }
          else{
              document.getElementById("7").style.borderColor = "";
          }
    if (phone === "") {
              alert("8. Geben Sie erst eine gültige Nummer.");
              document.getElementById("8").style.borderColor = "red";
              return;
            }
            else{
                document.getElementById("8").style.borderColor = "";
            }
    if (email === "") {
                alert("9. Geben Sie eine gültige E-Mail.");
                document.getElementById("9").style.borderColor = "red";
                return;
              }
              else{
                  document.getElementById("9").style.borderColor = "";
              }
    if (preisListe === "") {
                alert("12. Geben Sie eine gültigen Preis.");
                document.getElementById("12").style.borderColor = "red";
                return;
                        }
                        else{
                            document.getElementById("12").style.borderColor = "";
                        }
              this._dataset.first_name = firstName;
              this._dataset.last_name = lastName;
              this._dataset.street = street;
              this._dataset.number = number;
              this._dataset.city = city;
              this._dataset.zip = zip;
              this._dataset.productname = productname;
              this._dataset.quantity = quantity;
              this._dataset.price = price;
              this._dataset.open = open;
              this._dataset.phone = phone;
              this._dataset.email = email;

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

function setCoordinates(datensatz){

    let place = datensatz.adresse.getValue();

    let request = new XMLHttpRequest();
    let url = 'https://nominatim.openstreetmap.org/search?q='+ place + '&format=json';
    request.open('GET', url, true);

    request.onload = function() {
        let data = JSON.parse(this.response);
        datensatz.lat = parseFloat(data[0].lat);
        datensatz.lon = parseFloat(data[0].lon);
    }
}

export default AngebotPage;
