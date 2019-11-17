"use strict";

import stylesheet from "./edit-page.css";


let _app = "";
let _db = "";

class EditPage {
  constructor(app) {
    this._app = app;
    _app = this._app;
    _db = app._db;

    this._dataset = {
      name: "",
      streetNumber: "",
      postcodeTown: "",
      phone: "",
      openHours: "",
      produce: []
    };
  }

  onShow() {
    // Anzuzeigende HTML-Elemente ermitteln
    let section = document.querySelector("#edit-page").cloneNode(true);

    return {
        className: "edit-page",
        topbar: section.querySelectorAll("header > *"),
        main: section.querySelectorAll("main > *"),
    };
  }

  onLoad() {
    this._ul = document.querySelector("#edit-ul");
    this._name = this._ul.querySelector("#edit-name");
    this._streetNumber = this._ul.querySelector("#edit-street-number");
    this._postcodeTown = this._ul.querySelector("#edit-postcode-town");
    this._phone = this._ul.querySelector("#edit-phone");
    this._openHours = this._ul.querySelector("#edit-open-hours");
    this._plusButton = document.querySelector("#edit-plus-button");
    
    let home = document.querySelector('#edit-home');
    home.addEventListener("click", (evt) => {
      evt.preventDefault();
      this._app._router.navigate("/");
    });
    
    const editForm = document.querySelector("#edit-form");
    editForm.addEventListener("submit", (evt) => {
      evt.preventDefault();
      this.processInput();
    });

    this._plusButton.addEventListener("click", () => {
      this.addProduceRow();
    });
    
    let firstProduce = this._ul.querySelectorAll(".edit-produce")[0];
    let firstMinus = firstProduce.querySelector(".minus-button");
    firstMinus.addEventListener('click', () => {
      this.removeProduceRow(firstProduce);
    });
    let firstProdName = firstProduce.querySelector(".edit-produce-name");
    firstProduce.value="ASDF";
    console.log(firstProdName);
    firstProdName.addEventListener("change", () => {
      console.log("change");
      this.updateRequiredFields();
    });
    let firstProdPrice = firstProduce.querySelector(".edit-produce-price");
    firstProdPrice.addEventListener("change", () => {
      console.log("change");
      this.updateRequiredFields();
    });
    
    // load user data
    this._app._db.authChangeListener(user => {
      if (!user) {
        this._app._router.navigate("/");
      }
      this.loadUserData();
    });
    
    this.loadUserData();

    console.log('Page loaded');
  }

  onLeave(goon) {
    return true;
  }

  get title() {
    return "Profil";
  }
  
  updateRequiredFields() {
    console.log("update fields");
    let produceElements = document.querySelector("#edit-ul").querySelectorAll(".edit-produce");
    if (produceElements != null && produceElements.length > 1) {
      produceElements.forEach(element => {
        let prodName = element.querySelector(".edit-produce-name");
        let prodPrice = element.querySelector(".edit-produce-price");
        if ((prodName.value != null && prodName.value != "") || (prodPrice.value != null && prodPrice.value != "")) {
          console.log("required");
          prodName.required = true;
          prodPrice.required = true;
        } else {
          console.log("not required");
          prodName.required = false;
          prodPrice.required = false;
        }
      });
    } else if (produceElements != null && produceElements.length == 1) {
      let prodName = produceElements[0].querySelector(".edit-produce-name")
      let prodPrice = produceElements[0].querySelector(".edit-produce-price")
      prodName.required = false;
      prodPrice.required = false;
    }
  }
  
  loadUserData() {
    if (this._app._loggedInUser) {
      this._app._db.getProfile(this._app._loggedInUser.uid).then(docRef => {
        let profile = docRef.data();
        this._name.value = profile.name;
        this._streetNumber.value = profile.streetNumber;
        this._postcodeTown.value = profile.postcodeTown;
        this._phone.value = profile.phone;
        this._openHours.value = profile.openHours;
        if (profile.produce) {
          this.removeAllProduce();
          profile.produce.forEach(produce => {
            let row = this.addProduceRow();
            let prodName = row.querySelector(".edit-produce-name");
            let prodPrice = row.querySelector(".edit-produce-price");
            let prodUnit = row.querySelector(".edit-produce-unit");
            prodName.value = produce.name;
            prodPrice.value = produce.price;
            prodUnit.value = produce.unit;
          });
          this.removeEmptyProduce();
        }
      });
    }
  }
  
  removeAllProduce() {
    let produceElements = document.querySelector("#edit-ul").querySelectorAll(".edit-produce");
    if (produceElements != null) {
      produceElements.forEach(element => {
        element.remove();
      });
    }
  }
  
  removeEmptyProduce() {
    let produceElements = document.querySelector("#edit-ul").querySelectorAll(".edit-produce");
    if (produceElements != null && produceElements.length > 1) {
      produceElements.forEach(element => {
        let prodName = element.querySelector(".edit-produce-name").value.trim();
        let prodPrice = element.querySelector(".edit-produce-price").value.trim();
        if ((prodName == null || prodName == "") && (prodPrice == null || prodPrice == "")) {
          element.remove();
        }
      });
    }
  }
  
  processInput() {
    console.log("edit form submit");
    this.removeEmptyProduce();
    let name = this._name.value.trim();
    let streetNumber = this._streetNumber.value.trim();
    let postcodeTown = this._postcodeTown.value.trim();
    let phone = this._phone.value.trim();
    let openHours = this._openHours.value.trim();
    let produce = [];

    let produceElements = this._ul.querySelectorAll(".edit-produce");
    if (produceElements != null) {
      console.log("produce found");
      produceElements.forEach((produceElement) => {
        let prodName = produceElement.querySelector(".edit-produce-name").value.trim();
        let prodPrice = produceElement.querySelector(".edit-produce-price").value.trim();
        let prodUnit = produceElement.querySelector(".edit-produce-unit").value.trim();
        let newProduce = {
          name: prodName,
          price: prodPrice,
          unit: prodUnit
        };
        produce.push(newProduce);
      });
    }
    
    console.log("produce:", produce);
    
    this._dataset.name = name;
    this._dataset.streetNumber = streetNumber;
    this._dataset.postcodeTown = postcodeTown;
    this._dataset.phone = phone;
    this._dataset.openHours = openHours;
    this._dataset.produce = produce;
    this.getCoordinates(streetNumber + ", " + postcodeTown);
  }
  
  getCoordinates(place){
    let request = new XMLHttpRequest();
    let url = 'https://nominatim.openstreetmap.org/search?q='+ place + '&format=json';
    request.open('GET', url, true);
    
    request.onload = () => {
        console.log("geo data:", request.response);
        let data = JSON.parse(request.response);
        this.coordinateCallback(parseFloat(data[0].lat), parseFloat(data[0].lon));
    }
    
    request.send();
  }
  
  coordinateCallback(lat, lon) {
    this._dataset.lat = lat;
    this._dataset.lon = lon;
    this._app._db.updateProfile(this._app._loggedInUser.uid, this._dataset);
    console.log(this._dataset);
  }
  
  addProduceRow() {
    let newLi = document.createElement("li");
    newLi.classList.add("edit-produce");
    
    let nameInput = document.createElement("input");
    nameInput.type="text";
    nameInput.classList.add("edit-produce-name");
    nameInput.placeholder = "Bezeichnung";
    nameInput.addEventListener("change", () => {
      this.updateRequiredFields();
    });
    
    let spaceNode1 = document.createTextNode(" ");
    
    let priceInput = document.createElement("input");
    priceInput.type="number";
    priceInput.placeholder = "Preis";
    priceInput.classList.add("edit-produce-price");
    priceInput.min = 0;
    priceInput.step = "0.01";
    priceInput.addEventListener("change", () => {
      this.updateRequiredFields();
    });
    
    let unitNode = document.createTextNode(" € / ");
    
    let unitOptionKg = document.createElement("option");
    unitOptionKg.text = "kg";
    let unitOption100g = document.createElement("option");
    unitOption100g.text = "100 g";
    let unitOptionL = document.createElement("option");
    unitOptionL.text = "l";
    let unitOptionPiece = document.createElement("option");
    unitOptionPiece.text = "Stück";
    
    let unitSelect = document.createElement("select");
    unitSelect.classList.add("edit-produce-unit");
    unitSelect.appendChild(unitOptionKg);
    unitSelect.appendChild(unitOption100g);
    unitSelect.appendChild(unitOptionL);
    unitSelect.appendChild(unitOptionPiece);
    
    let spaceNode2 = document.createTextNode(" ");

    let minusButton = document.createElement("button");
    minusButton.classList.add("minus-button");
    minusButton.type = "button";
    minusButton.innerHTML="-";
    
    newLi.appendChild(nameInput);
    newLi.appendChild(spaceNode1);
    newLi.appendChild(priceInput);
    newLi.appendChild(unitNode);
    newLi.appendChild(unitSelect);
    newLi.appendChild(spaceNode2);
    newLi.appendChild(minusButton);
    this._ul.appendChild(newLi);
    this._ul.querySelectorAll(".edit-produce:last-child")[0].after(this._plusButton);
    
    minusButton.addEventListener('click', () => {
      this.removeProduceRow(newLi);
    });
    
    this.updateMinuses();
    
    return newLi;
  }
  
  removeProduceRow(row) {
    row.remove();
    this.updateMinuses();
  }
  
  updateMinuses() {
    let produce = this._ul.querySelectorAll(".edit-produce");
    if (produce.length == 1) {
      produce[0].querySelector(".minus-button").classList.add("invisible");
    } else {
      produce.forEach((produce) => {
        produce.querySelector(".minus-button").classList.remove("invisible");
      });
    }
  }
}



export default EditPage;
