"use strict";
/*Main Class of Application*/

import stylesheet from "./app.css";

import Navigo from "navigo/lib/navigo.js";
import DB from "./database.js";

import StartPage from "./start-page/start-page.js";
import ProfilePage from "./profile-page/profile-page.js";
import EditPage from "./edit-page/edit-page.js";
import LoginPage from "./login-page/login-page.js";
import RegisterPage from "./register-page/register-page.js";
import DBTestPage from "./dbtest-page/dbtest-page.js";

class App {
  constructor() {
    this._title = "Local Farmer";
    this._currentView = null;

    //Single Page Router initialisieren
    this._router = new Navigo(null, true, '#!');
    this._currentUrl = "";
    this._navAborted = false;
    this._db = new DB();
    this._loggedInUser = null;

    this._router.on({
      "/":                    () => this.showStartPage(),
      "/profile/:uid"    :params => this.showProfilePage(params),
      "/edit":                () => this.showEditPage(),
      "/login":               () => this.showLoginPage(),
      "/register":            () => this.showRegisterPage(),
      "/dbtest":              () => this.showDBTestPage()
    });
    
    this._router.notFound(() => {this._router.navigate("/")});

    this._router.hooks({
      after: (params) => {
        if(!this._navAborted) {
          this._currentUrl = this._router.lastRouteResolved().url;
        } else {
          this._router.pause(true);
          this._router.navigate(this._currentUrl);
          this._router.pause(false);
          this._navAborted = false;
        }
      }
    });
    
    // ----- references to global elements -----
    this._loginElements = document.querySelectorAll(".require-login");
    this._logoutElements = document.querySelectorAll(".require-logout");
    
    // ----- global page elements (header/footer) -----
    let app = this;
    document.querySelector("#home-link").addEventListener('click', (evt) => {
      evt.preventDefault();
      app._router.navigate("/");
    });
    document.querySelector("#login-link").addEventListener('click', (evt) => {
      evt.preventDefault();
      app._router.navigate("/login");
    });
    document.querySelector("#register-link").addEventListener('click', (evt) => {
      evt.preventDefault();
      app._router.navigate("/register");
    });
    document.querySelector("#edit-link").addEventListener('click', (evt) => {
      evt.preventDefault();
      app._router.navigate("/edit");
    });
    document.querySelector("#logout-link").addEventListener('click', (evt) => {
      evt.preventDefault();
      app._db.logoutUser().then((rsp) => {
        // [todo] content hiding; redirection
      });
    });
    
    // auth change listener
    this._db.authChangeListener(user => {
      this._loggedInUser = user;
      this.updateMenuItems();
      if (user) {
        app._db.createProfileIfNotExists(user.uid);
      }
    });
  }

  start() {
    console.log("App started successfully :)");
    this._router.resolve();
  }

  showStartPage() {
    let view = new StartPage(this);
    this._switchVisibleView(view);
  }

  showProfilePage(params){
    let view = new ProfilePage(this, params);
    this._switchVisibleView(view);
  }

  showEditPage(){
    let view = new EditPage(this);
    this._switchVisibleView(view);
  }
  
  showLoginPage(){
    let view = new LoginPage(this);
    this._switchVisibleView(view);
  }
  
  showRegisterPage(){
    let view = new RegisterPage(this);
    this._switchVisibleView(view);
  }
  
  showDBTestPage(){
    let view = new DBTestPage(this);
    this._switchVisibleView(view);
  }

  _switchVisibleView(view) {
    let newUrl = this._router.lastRouteResolved().url;
    console.log(newUrl);
    let goon = () => {
      this._router.navigate(newUrl + "?goon");
    }

    if(this._currentView && !this._currentView.onLeave(goon)) {
      console.log("Navigation aborted");
      this._navAborted = true;
      return false;
    }

    document.title = `${this._title} - ${view.title}`;
    this._currentView = view;
    this._switchVisibleContent(view.onShow());
    view.onLoad();
    return true;
  }

  _switchVisibleContent(content) {
    // <header> und <main> des HTML-Grundgerüsts ermitteln
    let app = document.querySelector("#app");
    let header = document.querySelector("#app > header");
    let main = document.querySelector("#app > main");

    // Zuvor angezeigte Inhalte entfernen
    // Bei der Topbar nur die untere Zeile, im Hauptbereich alles!
    app.className = "";
    header.querySelectorAll(".bottom").forEach(e => e.parentNode.removeChild(e));
    main.innerHTML = "";

    // CSS-Klasse übernehmen, um die viewspezifischen CSS-Regeln zu aktivieren
    if (content && content.className) {
        app.className = content.className;
    }

    // Neue Inhalte der Topbar einfügen
    if (content && content.topbar) {
        content.topbar.forEach(element => {
            element.classList.add("bottom");
            header.appendChild(element);
        });
    }

    // Neue Inhalte des Hauptbereichs einfügen
    if (content && content.main) {
        content.main.forEach(element => {
            main.appendChild(element);
        });
    }
    // Navigo an die Links in der View binden
    this._router.updatePageLinks();
    console.log("Page Links Updated");
    //end of _switchVisibleContent
  }
  
  // dynamically update the header menu based on the logged in user
  updateMenuItems() {
    if (this._loggedInUser == null) {
      this._loginElements.forEach(element => {
        element.classList.add("hidden");
      });
      this._logoutElements.forEach(element => {
        element.classList.remove("hidden");
      });
    } else {
      this._loginElements.forEach(element => {
        element.classList.remove("hidden");
      });
      this._logoutElements.forEach(element => {
        element.classList.add("hidden");
      });
    }
  }
}

export default App;
