import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

class HomePage extends Component{
    render(){
    return(
        <div>
            <div className="md:container md:mx-auto">
            <div className="bg-white h-screen flex flex-col justify-center items-center">
                <h1 className="title">
                    DEEPFAKE DETECTOR
                </h1>
                <div className="p-4 lg:text-5xl md:text-3xl sm:text-2xl text-2xl text-center text-secondary mb-10 grid gap-4">
                    <p>Detect Deepfakes using Blockchain</p> 
                    <Link to="/upload"><button>Upload Original Media</button></Link>
                    <Link to="/detect"><button>Detect Deepfakes</button></Link>
                </div>
                </div>
            </div>
        </div>
    );
    }

}

export default HomePage;