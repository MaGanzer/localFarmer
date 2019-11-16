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
        full_name: "",
        last_name: "",
        street: "",
        number: "",
        city: "",
        zip: "",
        productname: [],
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
    _app._router.navigate("/");
  });
  document.getElementById("plus").addEventListener('click', function() {
   let duplizierbareUl = document.getElementById("duplicate");
   var newUl = document.createElement("ul");
   let produktFeld = document.createElement("input");
   let preisFeld = document.createElement("input");
   produktFeld.classList.add("productname");
   preisFeld.classList.add("price");

   produktFeld.placeholder="Produkt";
   preisFeld.placeholder="Preis";

   produktFeld.id="10";
   preisFeld.id="11";

   let minus= document.createElement("button");
   minus.innerHTML="-";
   minus.id="remove";
   newUl.appendChild(produktFeld);
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
    let fullName = document.querySelector("#main-page-edit .full_name").value.trim();
    let street = document.querySelector("#main-page-edit .street").value.trim();
    let number = document.querySelector("#main-page-edit .number").value.trim();
    let city = document.querySelector("#main-page-edit .city").value.trim();
    let zip = document.querySelector("#main-page-edit .zip").value.trim();

    let produktListe = document.querySelectorAll('#main-page-edit .productname');
    let productname = [];
    for(var i=0;i< produktListe.length-1; i++){
    //alert("Dein AUfruf  " + produktListe[i].value.trim()) ;
     productname.push(produktListe[i].value.trim());
  }
  let preisListe = document.querySelectorAll('#main-page-edit .price');
  let price = [];
  for(var i=0;i< preisListe.length-1; i++){
  price.push(preisListe[i].value.trim());
  }
    let open = document.querySelector("#main-page-edit .open").value.trim();
    let phone = document.querySelector("#main-page-edit .phone").value.trim();
    let email = document.querySelector("#main-page-edit .email").value.trim();

    if (fullName === "") {
        alert("1. Geben Sie erst einen Vor und Nachnamen ein.");
        document.getElementById("1").style.borderColor = "red";
        return;
    }
    else{
        document.getElementById("1").style.borderColor = "";
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
                alert("11. Geben Sie eine gültigen Preis.");
                document.getElementById("11").style.borderColor = "red";
                return;
                        }
                        else{
                            document.getElementById("11").style.borderColor = "";
                        }
              //setCoordinates();
              this._dataset.full_name = fullName;
              this._dataset.street = street;
              this._dataset.number = number;
              this._dataset.city = city;
              this._dataset.zip = zip;
              this._dataset.productname = productname;
              this._dataset.price = price;
              this._dataset.open = open;
              this._dataset.phone = phone;
              this._dataset.email = email;

  }


}

function noInput(){
    document.getElementById("search_product").style.borderColor = "red";
    document.getElementById("search_place").style.borderColor = "red";
}

export default AngebotPage;
