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
    _profile = null;
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
    _produceTable = document.querySelector("#profile-produce-table");
    _produceTable.querySelectorAll("#profile-produce-table > .profile-produce-row").forEach(element => {
      element.parentNode.removeChild(element);
    });
    this._domLoaded = true;
    if (typeof _profile !== 'undefined' && _profile != null) {
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
    let noProduceSpan = document.querySelector('#profile-no-produce');
    
    let home = document.querySelector('#profile-home');
    home.addEventListener("click", (evt) => {
      evt.preventDefault();
      this._app._router.navigate("/");
    });
    
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
    if (typeof(_profile.produce) != "undefined" && _profile.produce.length > 0) {
      _profile.produce.forEach(prod => {
        let row = document.createElement("tr");
        row.classList.add("profile-produce-row");
        let namecol = document.createElement("td");
        let pricecol = document.createElement("td");
        namecol.textContent = prod.name;
        pricecol.textContent = _currencyFormat.format(prod.price / 100) + " / " + prod.unit;
        row.appendChild(namecol);
        row.appendChild(pricecol);
        _produceTable.appendChild(row);
        console.log(prod);
      });
      _produceTable.classList.remove("hidden");
      noProduceSpan.classList.add("hidden");
    } else {
      _produceTable.classList.add("hidden");
      noProduceSpan.classList.remove("hidden");
    }
    console.log("profile page output updated");
  }
}

export default ProfilePage;
