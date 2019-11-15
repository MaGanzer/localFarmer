"use strict";

import stylesheet from "./login-page.css";

let _app = "";
let _db = "";

let _saveButton = "";
let _loadButton = "";
let _deleteButton = "";
let _textInput = "";
let _idInput = "";

class LoginPage {
  constructor(app) {
    this._app = app;
    _app = this._app;
    _db = app._db;
  }

  onShow() {
    // Anzuzeigende HTML-Elemente ermitteln
    let section = document.querySelector("#login-page").cloneNode(true);

    return {
        className: "login-page",
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
    return "Login";
  }
}

export default LoginPage;
