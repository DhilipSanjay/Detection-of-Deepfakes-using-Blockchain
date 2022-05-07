import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import React, { Component } from 'react';
import HomePage from './components/home/homepage';
import UploadPage from './components/upload/upload';
import DetectPage from './components/detect/detect';
import AllOriginalsPage from './components/alloriginals/allOriginals';
import NavBar from './components/common/NavBar';

class App extends Component {
  render(){
    return (
      <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" exact element={<HomePage />}/>
          <Route path="/upload" exact element={<UploadPage />}/>
          <Route path="/detect" exact element={<DetectPage />}/>
          <Route path="/allOriginals" exact element={<AllOriginalsPage />}/>
        </Routes>
      </div>
      </Router>
    );
  }
}

export default App;
