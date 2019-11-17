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

const _defaultProfile = {
  name: "",
  streetNumber: "",
  postcodeTown: "",
  lat: 0.0,
  lon: 0.0,
  openHours: "",
  phone: "",
  produce: []
};

let _db;
let _auth;

class DB {
  constructor() {
    firebase.initializeApp(_firebaseConfig);
    _db = firebase.firestore();
    _auth = firebase.auth();
  }

  // ----- database functions: test collection -----
  addDBTest(testData)
  {
    return _db.collection("dbtest").add(testData);
  }

  getAllDBTests()
  {
    return _db.collection("dbtest").get();
  }

  getDBTest(id)
  {
    return _db.collection("dbtest").doc(id).get();
  }

  deleteDBTest(id)
  {
    return _db.collection("dbtest").doc(id).delete();
  }

  // ----- database functions: profile collection -----
  getAllProfiles()
  {
    return _db.collection("profiles").get();
  }

  getProfile(id)
  {
    return _db.collection("profiles").doc(id).get();
  }
  
  updateProfile(id, data)
  {
    return _db.collection("profiles").doc(id).update(data);
  }

  deleteProfile(id)
  {
    return _db.collection("profiles").doc(id).delete();
  }
  
  createProfileIfNotExists(uid) {
    console.log("checking profile for", uid);
    _db.collection("profiles").doc(uid).get().then((docSnapshot) => {
      if (!docSnapshot.exists) {
        console.log("creating profile for", uid);
        _db.collection("profiles").doc(uid).set(_defaultProfile);
      } else {
        console.log("profile exists for", uid);
      }
    });
  }
  
  
  // ----- auth functions -----
  
  registerUser(email, password)
  {
    return _auth.createUserWithEmailAndPassword(email, password);
  }
  
  loginUser(email, password) {
    return _auth.signInWithEmailAndPassword(email, password);
    // let dataRef = this._db.collection("db");
    // dataRef.get()
    //        .then(function(querySnapshot){
    //          querySnapshot.forEach(function(doc){
    //            console.log(doc.id, "=>", doc.data());
    //          });
    //        })
    //        .catch(function(error) {
    //          console.log("Error getting documents: ", error);
    //        });
    // return dataRef.get();
  }
  
  logoutUser() {
    return _auth.signOut();
  }
  
  authChangeListener(f)
  {
    return _auth.onAuthStateChanged(f);
  }
}

export default DB;