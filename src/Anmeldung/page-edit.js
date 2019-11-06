"use strict";

/**
 * Klasse PageEdit: Stellt die Seite mit dem Eingabeformular zur Verfügung.
 *
 * Diese Klasse wird von der App-Klasse zu bestimmten Zeitpunkten instantiiert
 * und aufgerufen, um die Liste mit den Adressen darzustellen.
 */
class PageEdit {
    /**
     * Konstruktor.
     *
     * @param {App} app Instanz der App-Klasse
     * @param {String} pageName Name der aufgerufenen Seite
     * @param  {Integer} editIndex Nummer des bearbeiteten Datensatzes
     */
    constructor(app, pageName, editIndex) {
        // Parameter merken
        this._app = app;
        this._editIndex = editIndex;

        // Hauptelement mit dem Inhalt der Seite ermitteln
        this._mainElement = document.getElementById("main-page-edit");

        // Bearbeiteten Datensetz einlesen
        this._dataset = {

            first_name: "",
            last_name: "",
            street: "",
            number: "",
            city: "",
            zip: "",
            type: "",
            productname: "",
            quantity: "",
            price: "",
            open: "",
            phone: "",
            email: "",
        };

        if (this._editIndex > -1) {
            let dataset = this._app.getDataByIndex(this._editIndex);

            this._dataset.first_name = dataset.first_name;
            this._dataset.last_name = dataset.last_name;
            this._dataset.street = dataset.street;
            this._dataset.street = dataset.number;
            this._dataset.city = dataset.city;
            this._dataset.zip = dataset.zip;
            this._dataset.type = dataset.type;
            this._dataset.productname = dataset.productname;
            this._dataset.quantity = dataset.quantity;
            this._dataset.price = dataset.price;
            this._dataset.open = dataset.open;
            this._dataset.phone = dataset.phone;
            this._dataset.email = dataset.email;
        }
    }

    /**
     * Seite anzeigen. Wird von der App-Klasse aufgerufen.
     */
    show() {
        this._renderForm();
        this._mainElement.classList.remove("hidden");
    }

    /**
     * Seite nicht mehr anzeigen. Wird von der App-Klasse aufgerufen.
     */
    hide() {
        this._mainElement.classList.add("hidden");
    }

    /**
     * Formularfelder in die Seite einfügen. (Interne Methode)
     */
    _renderForm() {
        // Alten Inhalt verwerfen
        this._mainElement.innerHTML = "";

        // Formularfelder einfügen
        let template = document.getElementById("template-page-edit").innerHTML;
        this._mainElement.innerHTML = template;
        this._mainElement.innerHTML = this._mainElement.innerHTML.replace("$FIRST_NAME$", this._dataset.first_name);
        this._mainElement.innerHTML = this._mainElement.innerHTML.replace("$LAST_NAME$", this._dataset.last_name);
        this._mainElement.innerHTML = this._mainElement.innerHTML.replace("$STREET$", this._dataset.street);
        this._mainElement.innerHTML = this._mainElement.innerHTML.replace("$NUMBER$", this._dataset.number);
        this._mainElement.innerHTML = this._mainElement.innerHTML.replace("$CITY$", this._dataset.city);
        this._mainElement.innerHTML = this._mainElement.innerHTML.replace("$ZIP$", this._dataset.zip);
        this._mainElement.innerHTML = this._mainElement.innerHTML.replace("$TYPE$", this._dataset.type);
        this._mainElement.innerHTML = this._mainElement.innerHTML.replace("$PRODUCT$", this._dataset.productname);
        this._mainElement.innerHTML = this._mainElement.innerHTML.replace("$QUANTITY$", this._dataset.quntity);
        this._mainElement.innerHTML = this._mainElement.innerHTML.replace("$PRICE$", this._dataset.price);
        this._mainElement.innerHTML = this._mainElement.innerHTML.replace("$OPEN$", this._dataset.open);
        this._mainElement.innerHTML = this._mainElement.innerHTML.replace("$PHONE$", this._dataset.phone);
        this._mainElement.innerHTML = this._mainElement.innerHTML.replace("$EMAIL$", this._dataset.email);

        let saveButton = this._mainElement.querySelector(".action.save");
        saveButton.addEventListener("click", () => this._saveAndExit());
    }

    /**
     * Speichert den aktuell bearbeiteten Datensatz und kehr dann wieder
     * in die Listenübersicht zurück.
     */
    _saveAndExit() {
        // Eingegebene Werte überprüfen





        let firstName = document.querySelector("#main-page-edit .first_name").value.trim();
        let lastName = document.querySelector("#main-page-edit .last_name").value.trim();
        let street = document.querySelector("#main-page-edit .street").value.trim();
        let number = document.querySelector("#main-page-edit .number").value.trim();
        let city = document.querySelector("#main-page-edit .city").value.trim();
        let zip = document.querySelector("#main-page-edit .zip").value.trim();
        let type = document.querySelector("#main-page-edit .type").value.trim();
        let productname = document.querySelector("#main-page-edit .productname").value.trim();
        let quantity = document.querySelector("#main-page-edit .quantity").value.trim();
        let price = document.querySelector("#main-page-edit .price").value.trim();
        let open = document.querySelector("#main-page-edit .open").value.trim();
        let phone = document.querySelector("#main-page-edit .phone").value.trim();
        let email = document.querySelector("#main-page-edit .email").value.trim();

        if (firstName === "") {
            alert("1. Geben Sie erst einen Vornamen ein.");
            return;
        }

        if (lastName === "") {
            alert("2. Geben Sie erst einen Nachnamen ein.");
            return;
        }
        if (street === "") {
            alert("3. Geben Sie erst eine Straße ein.");
            return;
        }
        if (number === "") {
            alert("4. Geben Sie erst eine Hausnummer ein.");
            return;
        }
        if (city === "") {
            alert("5. Geben Sie erst eine Stadt ein.");
            return;
        }
        if (zip === "") {
            alert("6. Geben Sie erst eine Postleitzahl ein.");
            return;
        }
        if (type === "" ) {
            alert("7. Dieser Eingabefeld darf nicht leer bleiben.");
            return;
        }
        if (type !== "Obst" && type!=="Gemüse" ) {
            alert("7. Dieser Eingabefeld darf als Inhalt Obst oder Gemüse beinhalten.2");
            return;
        }

        if (productname === "") {
            alert("8. Geben Sie erst einen Produktnamen ein.");
            return;
          }
        if (quantity === "") {
              alert("9. Geben Sie eine gültige Quantität ein.");
              return;
            }
        if (open === "") {
                alert("10. Geben Sie eine gültige Öfnungszeit.");
                return;
              }
        if (phone === "") {
                  alert("11. Geben Sie erst eine gültige Nummer.");
                  return;
                }
        if (email === "") {
                    alert("12. Geben Sie eine gültige E-Mail.");
                    return;
                  }




        // Datensatz speichern

        this._dataset.first_name = firstName;
        this._dataset.last_name = lastName;
        this._dataset.street = street;
        this._dataset.number = number;
        this._dataset.city = city;
        this._dataset.zip = zip;
        this._dataset.type = type;
        this._dataset.productname = productname;
        this._dataset.quantity = quantity;
        this._dataset.price = price;
        this._dataset.open = open;
        this._dataset.phone = phone;
        this._dataset.email = email;

        if (this._editIndex > -1) {
            this._app.updateDataByIndex(this._editIndex, this._dataset);
        } else {
            this._app.appendData(this._dataset);
        }

        // Zurück zur Übersicht
        this._app.showPage("page-list");
    }
}
