import React, { Component } from "react";
import './NavBar.css';
import {Link} from 'react-router-dom';

class NavBar extends Component {
    
    constructor(props){
        super(props);
    }
    
    render(){
        return(
            <div className="nav">
            <div className="nav-header">
                <Link className="nav-title nav-links"  to="/">
                    DEEPFAKE DETECTOR
                </Link>
            </div>
            
            <div className="nav-links">
                <Link className="small-btn" to="/upload">Upload</Link>
                <Link className="small-btn" to="/detect">Detect</Link>
                <Link className="small-btn" to="/allOriginals">View all</Link>
                <Link className="small-btn" to="/">Address: {this.props.address}</Link>
            </div>
        </div>
        );
    }
}

export default NavBar;