import React, { Component } from 'react';
import './App.css';
import {Route, Link} from 'react-router-dom';
import Home from './scene/Home.js'
import * as firebase from 'firebase';
 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDU9b2q3rpSwM9x39p7mw40mTxgrbZhp4Q",
    authDomain: "bloc-chat-9b080.firebaseapp.com",
    databaseURL: "https://bloc-chat-9b080.firebaseio.com",
    projectId: "bloc-chat-9b080",
    storageBucket: "bloc-chat-9b080.appspot.com",
    messagingSenderId: "148256012013"
  };
  firebase.initializeApp(config);


class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="container fill">
          <main>
            <Home
            firebase={firebase}
            />
          </main>
        </div>
      </div>
    );
  }
}

export default App;
