import logo from './logo.svg';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import React, { Component } from 'react';
import Web3 from 'web3';
import HomePage from './components/home/homepage';
import UploadPage from './components/upload/upload';

class App extends Component {

  async componentWillMount(){
    await this.loadWeb3();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. Install MetaMask!')
    }
  }


  render(){
    return (
      <Router>
      <div className="App">
        <Routes>
          <Route path="/" exact element={<HomePage />}/>
          <Route path="/upload" exact element={<UploadPage />}/>
        </Routes>
      </div>
      </Router>
    );
  }
}

export default App;