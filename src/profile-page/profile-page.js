"use strict";

import stylesheet from "./profile-page.css";

let _app;
let _db;
let _uid;
let _profile;
let _productsTable;
let _currencyFormat = Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });

class ProfilePage {
  constructor(app, uid) {
    this._app = app;
    _app = this._app;
    _db = app._db;
    _uid = uid;
    this._domLoaded = false;
    this._profileUpdated = false;
    
    _db.getProfile(uid.uid).then((docSnapshot) => {
      console.log("got profile snapshot");
      if (!docSnapshot.exists) {
        _app._router.navigate("/");
      } else {
        _profile = docSnapshot.data();
        console.log("profile user:", _profile.name);
        if (this._domLoaded) {
          // the DOM has already been loaded; update the page output
          this.updatePageOutput();
        }
      }
    });
  }

  onShow() {
    // Anzuzeigende HTML-Elemente ermitteln
    let section = document.querySelector("#profile-page").cloneNode(true);

    return {
      className: "profile-page",
      topbar: section.querySelectorAll("header > *"),
      main: section.querySelectorAll("main > *"),
    };
  }

  onLoad() {
    _productsTable = document.querySelector("#profile-products-table");
    _productsTable.querySelectorAll("#profile-products-table > .profile-products-row").forEach(element => {
      element.parentNode.removeChild(element);
    });
    this._domLoaded = true;
    if (typeof _profile !== 'undefined') {
      // profile data has already been loaded; update the page output
      this.updatePageOutput();
    }
    
    console.log('Page loaded');
  }

  onLeave(goon) {
    return true;
  }

  get title() {
    return "Profil";
  }
  
  updatePageOutput() {
    if (this._profileUpdated) {
      return;
    }
    this._profileUpdated = true;
    let nameSpan = document.querySelector('#profile-name');
    let streetNumberSpan = document.querySelector('#profile-street-number');
    let postcodeTownSpan = document.querySelector('#profile-postcode-town');
    let phoneLi = document.querySelector('#profile-phone-li');
    let phoneSpan = document.querySelector('#profile-phone');
    let openHoursLi = document.querySelector('#profile-open-hours-li');
    let openHoursSpan = document.querySelector('#profile-open-hours');
    let noProductsSpan = document.querySelector('#profile-no-products');
    
    if (typeof _profile.name !== 'undefined' && _profile.name != "") {
      document.title = `${_app._title} - Profil von ${_profile.name}`;
    }
    nameSpan.textContent = _profile.name;
    streetNumberSpan.textContent = _profile.streetNumber;
    postcodeTownSpan.textContent = _profile.postcodeTown;
    if (_profile.phone == null || _profile.phone == "") {
      phoneLi.classList.add("hidden");
    } else {
      phoneSpan.textContent = _profile.phone;
    }
    if (_profile.openHours == null || _profile.openHours == "") {
      openHoursLi.classList.add("hidden");
    } else {
      openHoursSpan.textContent = _profile.openHours;
    }
    openHoursSpan.textContent = _profile.openHours;
    if (typeof(_profile.products) != "undefined" && _profile.products.length > 0) {
      console.log("products");
      _profile.products.forEach(prod => {
        let row = document.createElement("tr");
        row.classList.add("profile-products-row");
        let namecol = document.createElement("td");
        let pricecol = document.createElement("td");
        namecol.textContent = prod.name;
        pricecol.textContent = _currencyFormat.format(prod.price / 100) + " / " + prod.unit;
        row.appendChild(namecol);
        row.appendChild(pricecol);
        _productsTable.appendChild(row);
        console.log(prod);
      });
      _productsTable.classList.remove("hidden");
      noProductsSpan.classList.add("hidden");
    } else {
      console.log("no products", _profile.products.length);
      _productsTable.classList.add("hidden");
      noProductsSpan.classList.remove("hidden");
    }
    console.log("profile page output updated");
  }
}

export default ProfilePage;
