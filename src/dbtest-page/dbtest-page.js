"use strict";

import stylesheet from "./dbtest-page.css";

let _app = "";
let _db = "";

let _saveButton = "";
let _loadButton = "";
let _deleteButton = "";
let _textInput = "";
let _idInput = "";

class DBTestPage {
  constructor(app) {
    this._app = app;
    _app = this._app;
    _db = app._db;
  }

  onShow() {
    // Anzuzeigende HTML-Elemente ermitteln
    let section = document.querySelector("#dbtest-page").cloneNode(true);

    return {
        className: "dbtest-page",
        topbar: section.querySelectorAll("header > *"),
        main: section.querySelectorAll("main > *"),
    };
  }

  onLoad() {
    _saveButton = document.querySelector("#DBTest_speichern");
    _loadButton = document.querySelector("#DBTest_laden");
    _deleteButton = document.querySelector("#DBTest_loeschen");
    _textInput = document.querySelector("#DBTest_text");
    _idInput = document.querySelector("#DBTest_id");
    
    _saveButton.addEventListener('click', function() {
      if (_textInput.value == "") {
        alert("Bitte gib etwas ein!");
        return;
      }
      let testData = { "date": getNiceDate(), "message": _textInput.value};
      _db.addDBTest(testData).then(
        function(docRef) {
          alert("Erfolgreich gespeichert, die ID lautet: " + docRef.id);
        },
        function(error) {
          alert("Fehler beim Speichern: " + error);
        });
    });
    _loadButton.addEventListener('click', function() {
      if (_idInput.value == "") {
        alert("Bitte gib etwas ein!");
        return;
      }
      _db.getDBTest(_idInput.value).then(
        function(docRef) {
          if (typeof(docRef.data()) != "undefined") {
            alert("Eintrag von " + docRef.data().date + ": " + docRef.data().message);
          } else {
            alert("Fehler beim Laden: Eintrag existiert nicht!");
          }
        },
        function(error) {
          alert("Fehler beim Laden: " + error);
        });
    });
    _deleteButton.addEventListener('click', function() {
      if (_idInput.value == "") {
        alert("Bitte gib etwas ein!");
        return;
      }
      _db.deleteDBTest(_idInput.value).then(
        function() {
          alert("Eintrag erfolgreich gelöscht (sofern er existiert hat).");
        }).catch(
          function(error) {
            alert("Fehler beim Löschen: " + error)
        });
    });
    console.log('Page loaded');
  }

  onLeave(goon) {
    return true;
  }

  get title() {
    return "Datenbank-Test";
  }
}

function getNiceDate() {
  let date = new Date();
  let date_locale = date.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  let time_locale = date.toLocaleTimeString("de-DE");
  let formatted = `${date_locale} ${time_locale}`;
  return formatted;
}

export default DBTestPage;
