import React, { Component } from "react";
import getIpfsRecord from "../../services/getIpfsRecord";
import getWeb3 from "../../services/getweb3";
import ipfs from "../../services/ipfs";

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
        const file = event.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
            this.setState({ buffer : Buffer(reader.result)});
        }
    }

    async onSubmit(event){
        event.preventDefault();
        console.log("buffer", this.state.buffer);
        const result = await ipfs.add(this.state.buffer, {"only-hash" : true});
        const generateIpfsHash = result.path;

        const response = await getIpfsRecord(generateIpfsHash);
        console.log(generateIpfsHash, response);

        if(!response){
            // No document found in MongoDB => Deepfake
            console.log("Deepfake");
        }
        else{
            // Document with the ipfsHash is found in MongoDB 
            // Verify the ipfsHash in blockchain
            const mongoIpfsHash = response.ipfsHash;
            const chainIpfsHash = await this.fetchTransactionDetails(response.transactionHash);
            console.log(chainIpfsHash, mongoIpfsHash)
            if(mongoIpfsHash === chainIpfsHash){
                console.log("Original");
            }
            else{
                console.error("MongoDB has been tampered! Re-index the blockchain");
            }
        }   
    }

    async fetchTransactionDetails(transactionHash){
        const web3 = this.state.web3;
        var chainIpfsHash;
        
        await web3.eth.getTransaction(transactionHash, async (error, transaction) => {
            if(error){
                console.log(error);
                return;
            }
            let transactionData = transaction.input;
            console.log(transactionData);
            let inputData = '0x' + transactionData.slice(10);  // get only data without function selector

            let params = await web3.eth.abi.decodeParameters(['string'], inputData);
            console.log(params);
            chainIpfsHash = params[0];
        });
        return chainIpfsHash;
    }

    render(){
        return(
            <div>
                <h1>Detect Deepfake</h1>
                <form onSubmit={this.onSubmit}>
                    <input type="file" onChange={this.captureFile}/>
                    <input type="submit" />
                </form>
            </div>
        )
    }
}

export default DetectPage;