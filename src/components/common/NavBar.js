import React, { Component } from "react";
import './NavBar.css';
import {Link} from 'react-router-dom';
import getWeb3 from '../../services/getweb3';

class NavBar extends Component {
    constructor(props){
        super(props);
        this.state = {
            web3 : null,
            address: localStorage.getItem('address'),
            isConnected: localStorage.getItem('isConnected')
          }

        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    async login(){
        getWeb3().then((results)  => {
          this.setState({
            web3: results.web3,
          }, async () => {
            const accounts = await this.state.web3.eth.getAccounts();
            console.log(accounts);
            this.setState({
              address: accounts[0],
              isConnected: true
            });

            localStorage.setItem('isConnected', true);
            localStorage.setItem('address', accounts[0]);
          }); 
        })
        .catch((e) => {
          console.log(e, 'Error finding web3.')
        })
    }

    async logout(){
      this.setState({
        address: null,
        isConnected: false
      });

      localStorage.removeItem('isConnected');
      localStorage.removeItem('address');
      window.location.href = "/";
    }
    
    render(){
        return(
            <div className="nav">
            <div className="nav-header">
                <Link className="nav-title nav-links"  to="/">
                    SOURCE OF TRUTH
                </Link>
            </div>
            
            
            {this.state.isConnected?
            <div className="nav-links">
                <Link className="small-btn" to="/upload">Upload</Link>
                <Link className="small-btn" to="/detect">Detect</Link>
                <Link className="small-btn" to="/allOriginals">View all</Link>
                <Link className="small-btn" to="/">Address: {this.state.address}</Link>
                <a className="small-btn" onClick={this.logout}>Logout</a>
            </div>
            :
            <div className="nav-links">
                <a className="small-btn" onClick={this.login}>Login</a>
            </div>
            }
        </div>
      );
    }
}

export default NavBar;