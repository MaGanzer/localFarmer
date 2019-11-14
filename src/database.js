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

let _db = "";

class DB {
  constructor() {
    firebase.initializeApp(_firebaseConfig);
    _db = firebase.firestore();
  }

  /*registerUser(user)
  {
    return _db.collection("users").add(user);
  }*/
  
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

}

export default DB;