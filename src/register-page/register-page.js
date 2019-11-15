"use strict";

import stylesheet from "./register-page.css";

let _app = "";
let _db = "";

let _saveButton = "";
let _loadButton = "";
let _deleteButton = "";
let _textInput = "";
let _idInput = "";

class RegisterPage {
  constructor(app) {
    this._app = app;
    _app = this._app;
    _db = app._db;
  }

  onShow() {
    // Anzuzeigende HTML-Elemente ermitteln
    let section = document.querySelector("#register-page").cloneNode(true);

    return {
        className: "register-page",
        topbar: section.querySelectorAll("header > *"),
        main: section.querySelectorAll("main > *"),
    };
  }

  onLoad() {
    console.log('Page loaded');
  }

  onLeave(goon) {
    return true;
  }

  get title() {
    return "Registrierung";
  }
}

export default RegisterPage;
