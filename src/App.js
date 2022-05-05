import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import React, { Component } from 'react';
import Web3 from 'web3';
import HomePage from './components/home/homepage';
import UploadPage from './components/upload/upload';
import DetectPage from './components/detect/detect';
import AllOriginalsPage from './components/alloriginals/allOriginals';
import NavBar from './components/common/NavBar';
import getWeb3 from './services/getweb3';

class App extends Component {
  constructor(){
    super();

    this.state = {
      web3 : null,
      address: null
    }
  }

  async componentWillMount(){
    getWeb3.then((results)  => {
      this.setState({
        web3: results.web3,
      }, async () => {
        const accounts =  await this.state.web3.eth.getAccounts();
        console.log(accounts);
        this.setState({
          address: accounts[0]
        })
      }); 
    })
    .catch((e) => {
      console.log(e, 'Error finding web3.')
    })
    await this.checkweb3();
  }

  async checkweb3() {
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
        <NavBar address={this.state.address}/>
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
