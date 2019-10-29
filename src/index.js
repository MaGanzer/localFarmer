"use strict";
//JS File for the Main Window

import App from "./app.js";
import stylesheet from "./index.css";
import theme from "./theme.css";

//When DOM ready
window.addEventListener("load", () => {
  //start Application
  let app = new App();
  app.start();
});
