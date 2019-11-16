"use strict";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const _firebaseConfig = {
  apiKey: "AIzaSyAWrwXNjRNdVUGzEwu4Xww5QNWqUEuIJhA",
  authDomain: "localfarmer-472bb.firebaseapp.com",
  databaseURL: "https://localfarmer-472bb.firebaseio.com",
  projectId: "localfarmer-472bb",
  storageBucket: "localfarmer-472bb.appspot.com",
  messagingSenderId: "818884849098",
  appId: "1:818884849098:web:c07fccc6e7c3e8724bf333"
};

class DB {
  constructor() {
    firebase.initializeApp(_firebaseConfig);
    this._db = firebase.firestore();
    this._auth = firebase.auth();
    _db = firebase.firestore();
  }

  // ----- database functions

  //dbtest -> testDatenbank, muss vor abgabe gelöscht werden
  addDBTest(testData)
  {
    return this._db.collection("dbtest").add(testData);
  }

  getAllDBTests()
  {
    return this._db.collection("dbtest").get();
  }

  getDBTest(id)
  {
    return this._db.collection("dbtest").doc(id).get();
  }

  deleteDBTest(id)
  {
    return this._db.collection("dbtest").doc(id).delete();
  }
  
  // ----- auth functions -----
  
  registerUser(email, password)
  {
    return this._auth.createUserWithEmailAndPassword(email, password);
  }
  
  loginUser(email, password) {
    return this._auth.signInWithEmailAndPassword(email, password);
  }
  
  logoutUser() {
    return this._auth.signOut();
  }

  //db richtige Datenbank
  addDB(testData)
  {
    return _db.collection("db").add(testData);
  }

  getAllDB()
  {
    return _db.collection("db").get();
  }

  getDB(id)
  {
    return _db.collection("db").doc(id).get();
  }

  deleteDB(id)
  {
    return _db.collection("db").doc(id).delete();
  }


}

export default DB;