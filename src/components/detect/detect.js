import React, { Component } from "react";
import generateIpfsOnlyHash from "../../services/generateIpfsOnlyHash";
import getIpfsRecord from "../../services/getIpfsRecord";
import getWeb3 from "../../services/getweb3";
import verifyTransaction from "../../services/verifyTransaction";

class DetectPage extends Component{
    
    constructor(props){
        super(props);

        this.state = {
            web3: null,
            buffer: null,
            displayResult: false,
            isDeepfake: false
        }

        this.captureFile = this.captureFile.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillMount(){
        getWeb3.then((results)  => {
            this.setState({
              web3: results.web3
            })
          })
          .catch((e) => {
            console.log(e, 'Error finding web3.')
          })     
    }

    captureFile(event){
        event.preventDefault();
        try{
            const file = event.target.files[0];
            const reader = new window.FileReader();
            reader.readAsArrayBuffer(file);
            reader.onloadend = () => {
                this.setState({ buffer : Buffer(reader.result)});
            }
        }
        catch(error){
            console.error(error);
        }
    }

    async onSubmit(event){
        event.preventDefault();

        // Generate IPFS hash of the uploaded media - to detect deepfake
        const generatedIpfsHash = await generateIpfsOnlyHash(this.state.buffer);

        // Check if the document with the correspoding IpfsHash exists - (i.e.) returns the mongoDB Document
        const mongoResponse = await getIpfsRecord(generatedIpfsHash);
        console.log(generatedIpfsHash, mongoResponse);

        // Check if the uplaoded media - deepfake / original
        if(!mongoResponse){
            // No document found in MongoDB => Deepfake
            // (i.e.) Only original media will be stored.
            console.log("Deepfake");
            this.setState({
                displayResult: true,
                isDeepfake : true
            });
        }
        else{
            // Document with the ipfsHash is found in MongoDB 
            // Verify if ipfsHash from mongo is same in the blockchain transaction
            const result = await verifyTransaction(mongoResponse, this.state.web3);
            
            if(result){
                console.log("Original");
                this.setState({
                    displayResult: true,
                    isDeepfake : false
                })
            }
            else{
                console.error("MongoDB has been tampered! Re-index the blockchain");
                window.alert("Some error occurred. Check console")
            }
        }
    }

    render(){
        return(
            <div>
                <h1>Detect Deepfake</h1>
                <form onSubmit={this.onSubmit}>
                    <input type="file" onChange={this.captureFile}/>
                    <input type="submit" />
                </form>
                {
                    this.state.displayResult ?
                        this.state.isDeepfake ?
                        <h1>Deepfake</h1>
                        :
                        <h1>Original</h1> 
                    : null
                }
            </div>
        )
    }
}

export default DetectPage;