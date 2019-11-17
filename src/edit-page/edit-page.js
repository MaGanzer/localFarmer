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
      products: []
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
    
    const editForm = document.querySelector("#edit-form");
    editForm.addEventListener("submit", (evt) => {
      evt.preventDefault();
      this.processInput();
    });

    this._plusButton.addEventListener('click', () => {
      this.addProductRow();
    });
    
    let firstProduct = this._ul.querySelectorAll(".edit-product")[0];
    let firstMinus = firstProduct.querySelector(".minus-button");
    firstMinus.addEventListener('click', () => {
      this.removeProductRow(firstProduct);
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
  
  loadUserData() {
    if (this._app._loggedInUser) {
      this._app._db.getProfile(this._app._loggedInUser.uid).then(docRef => {
        let profile = docRef.data();
        this._name.value = profile.name;
        this._streetNumber.value = profile.streetNumber;
        this._postcodeTown.value = profile.postcodeTown;
        this._phone.value = profile.phone;
        this._openHours.value = profile.openHours;
        this.removeAllProducts();
        profile.products.forEach(product => {
          let row = this.addProductRow();
          let prodName = row.querySelector(".edit-product-name");
          let prodPrice = row.querySelector(".edit-product-price");
          let prodUnit = row.querySelector(".edit-product-unit");
          prodName.value = product.name;
          prodPrice.value = product.price;
          prodUnit.value = product.unit;
        });
        this.removeEmptyProducts();
      });
    }
  }
  
  removeAllProducts() {
    let productElements = document.querySelector("#edit-ul").querySelectorAll(".edit-product");
    if (productElements != null) {
      productElements.forEach(element => {
        element.remove();
      });
    }
  }
  
  removeEmptyProducts() {
    let productElements = document.querySelector("#edit-ul").querySelectorAll(".edit-product");
    if (productElements != null && productElements.length > 1) {
      productElements.forEach(element => {
        let prodName = element.querySelector(".edit-product-name").value.trim();
        let prodPrice = element.querySelector(".edit-product-price").value.trim();
        if ((prodName == null || prodName == "") && (prodPrice == null || prodPrice == "")) {
          element.remove();
        }
      });
    }
  }
  
  processInput() {
    console.log("edit form submit");
    let name = this._name.value.trim();
    let streetNumber = this._streetNumber.value.trim();
    let postcodeTown = this._postcodeTown.value.trim();
    let phone = this._phone.value.trim();
    let openHours = this._openHours.value.trim();
    let products = [];

    let productElements = this._ul.querySelectorAll(".edit-product");
    if (productElements != null) {
      console.log("products found");
      productElements.forEach((productElement) => {
        let prodName = productElement.querySelector(".edit-product-name").value.trim();
        let prodPrice = productElement.querySelector(".edit-product-price").value.trim();
        let prodUnit = productElement.querySelector(".edit-product-unit").value.trim();
        let product = {
          name: prodName,
          price: prodPrice,
          unit: prodUnit
        };
        products.push(product);
      });
    }
    
    console.log("products:", products);
    
    this._dataset.name = name;
    this._dataset.streetNumber = streetNumber;
    this._dataset.postcodeTown = postcodeTown;
    this._dataset.phone = phone;
    this._dataset.openHours = openHours;
    this._dataset.products = products;
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
  
  addProductRow() {
    let newLi = document.createElement("li");
    newLi.classList.add("edit-product");
    
    let nameInput = document.createElement("input");
    nameInput.type="text";
    nameInput.classList.add("edit-product-name");
    nameInput.placeholder = "Bezeichnung";
    
    let spaceNode1 = document.createTextNode(" ");
    
    let priceInput = document.createElement("input");
    priceInput.type="number";
    priceInput.placeholder = "Preis";
    priceInput.classList.add("edit-product-price");
    priceInput.min = 0;
    priceInput.step = "0.01";
    
    let unitNode = document.createTextNode(" € / ");
    
    let unitOptionKg = document.createElement("option");
    unitOptionKg.text = "kg";
    let unitOption100g = document.createElement("option");
    unitOption100g.text = "100 g";
    let unitOptionPiece = document.createElement("option");
    unitOptionPiece.text = "Stück";
    
    let unitSelect = document.createElement("select");
    unitSelect.classList.add("edit-product-unit");
    unitSelect.appendChild(unitOptionKg);
    unitSelect.appendChild(unitOption100g);
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
    this._ul.querySelectorAll(".edit-product:last-child")[0].after(this._plusButton);
    
    minusButton.addEventListener('click', () => {
      this.removeProductRow(newLi);
    });
    
    this.updateMinuses();
    
    return newLi;
  }
  
  removeProductRow(row) {
    row.remove();
    this.updateMinuses();
  }
  
  updateMinuses() {
    let products = this._ul.querySelectorAll(".edit-product");
    if (products.length == 1) {
      products[0].querySelector(".minus-button").classList.add("invisible");
    } else {
      products.forEach((product) => {
        product.querySelector(".minus-button").classList.remove("invisible");
      });
    }
  }
}



export default EditPage;
