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
    const loginForm = document.querySelector("#loginForm");
    var app = this._app;
    loginForm.addEventListener("submit", (evt) => {
      evt.preventDefault();
      const email = loginForm["email"].value;
      const password = loginForm["password"].value;
      _db.loginUser(email, password).then(cred => {
        console.log(cred);
        loginForm.reset();
        app._router.navigate("/");
      });
    });
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
