import React, { Component } from 'react';
import './App.css';
import {Route, Link} from 'react-router-dom';
import Home from './scene/Home.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <nav>
            <Link to='/'>Home</Link>
          </nav>
        </header>
        <main>
          <Route exact path='/' component={Home}/>
        </main>
      </div>
    );
  }
}

export default App;
