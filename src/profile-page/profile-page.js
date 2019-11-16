"use strict";

import stylesheet from "./profile-page.css";

let _app;
let _db;
let _uid;
let _profile;
let _produceTable;
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
    _produceTable = document.querySelector("#produce-table");
    _produceTable.querySelectorAll("#produce-table > .produce-row").forEach(element => {
      element.parentNode.removeChild(element);
    });
    this._domLoaded = true;
    if (typeof _profile !== 'undefined') {
      // profile data has already been loaded; update the page output
      this.updatePageOutput();
    }
    document.querySelector('#BackToStart').addEventListener('click', function() {
      _app._router.navigate("/");
    });
    
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
    let nameSpan = document.querySelector('#name');
    let addressSpan = document.querySelector('#address');
    let phoneSpan = document.querySelector('#phone');
    let openHoursSpan = document.querySelector('#openHours');
    
    if (typeof _profile.name !== 'undefined' && _profile.name != "") {
      document.title = `${_app._title} - Profil von ${_profile.name}`;
    }
    nameSpan.textContent = _profile.name;
    addressSpan.textContent = _profile.address;
    phoneSpan.textContent = _profile.phone;
    openHoursSpan.textContent = _profile.openHours;
    _profile.produce.forEach(prod => {
      let row = document.createElement("tr");
      row.classList.add("produce-row");
      let namecol = document.createElement("td");
      let pricecol = document.createElement("td");
      namecol.textContent = prod.name;
      pricecol.textContent = _currencyFormat.format(prod.price / 100);
      row.appendChild(namecol);
      row.appendChild(pricecol);
      _produceTable.appendChild(row);
      console.log(prod);
    });
    console.log("profile page output updated");
  }
}

export default ProfilePage;
