import React, { Component } from 'react';
import home from "../../img/home.png";
import "./homepage.css";

class HomePage extends Component{
    render(){
    return(


        <div id="about" className="section main">
        
        <div>
            <img src={home} alt="home"/>
        </div>
        
        <div>
            <div className="big-text">
                Are you seeing real or fake media?
            </div>

            <p>
            Deepfake is conjoined from “deep learning” and “fake”. It describes the emergence of realistic fake videos, produced from deep learning algorithms. Deepfake algorithms can create fake images and videos that humans cannot distinguish from authentic ones.
            </p>
                
            <p>
            Deepfake Technology has been used to spread disinformation by creating fake news. It has also been used for creating malicious hoaxes, political fraud or fake adult videos. Deepfakes can influence public opinions, election results, trigger ethnic violence or escalate situations that can lead to armed conflicts.
            </p>

            <div className="main-title">
                About the project
            </div>
            
            <p>
                We have built a system based on blockchain technology for detection of the deepfakes. Decentralized blockchains are immutable, which means that the data entered is permanent and irreversible – and the hash or “fingerprint" cannot be modified and becomes a tamper-proof reference of the digital content at a specific point in time.
            </p>
            <a href="https://github.com/DhilipSanjay/Detection-of-Deepfakes-using-Blockchain" target="_blank">
            
            <button>
                View Source Code on Github
            </button>
            </a>
        </div>   
    </div>


        // <div>
        //     <div className="md:container md:mx-auto">
        //     <div className="bg-white h-screen flex flex-col justify-center items-center">
        //         <h1 className="title">
        //             SOURCE OF TRUTH
        //         </h1>
        //         <div className="p-4 lg:text-5xl md:text-3xl sm:text-2xl text-2xl text-center text-secondary mb-10 grid gap-4">
        //             <h3>Detect Deepfakes using Blockchain</h3> 
        //             <Link to="/upload"><button className='home-btn'>Upload Original Media</button></Link>
        //             <Link to="/detect"><button className='home-btn'>Detect Deepfakes</button></Link>
        //         </div>
        //         </div>
        //     </div>
        // </div>
    );
    }

}

export default HomePage;