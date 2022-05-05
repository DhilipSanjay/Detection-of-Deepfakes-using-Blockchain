import React, { Component } from "react";
import generateIpfsOnlyHash from "../../services/generateIpfsOnlyHash";
import getIpfsRecord from "../../services/getIpfsRecord";
import getWeb3 from "../../services/getweb3";
import verifyTransaction from "../../services/verifyTransaction";
import TransactionReceipt from "../upload/transactionReceipt";
import "../upload/upload.css";

class DetectPage extends Component{
    
    constructor(props){
        super(props);

        this.state = {
            web3: null,
            ipfsHash: '',
            transactionReceipt: '',
            buffer: null,
            fileLabel: 'No file selected',
            imageURL: '#',
            isLoading: false,
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
        try{
            event.preventDefault();
            const file = event.target.files[0];
            const url = URL.createObjectURL(file);

            this.setState({
                fileLabel: file.name,
                imageURL: url
            });
            const reader = new window.FileReader();
            reader.readAsArrayBuffer(file);
            reader.onloadend = () => {
                this.setState({ 
                    buffer : Buffer(reader.result),
                }, async () => {
                    this.onSubmit();
                  });
            }
        }
        catch(error){
            console.error(error);
        }
    }

    async onSubmit(){
        // Generate IPFS hash of the uploaded media - to detect deepfake
        const generatedIpfsHash = await generateIpfsOnlyHash(this.state.buffer);

        // Check if the document with the correspoding IpfsHash exists - (i.e.) returns the mongoDB Document
        const mongoResponse = await getIpfsRecord(generatedIpfsHash);
        console.log(generatedIpfsHash, mongoResponse);

        // Check if the uploaded media - deepfake / original
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
                const receipt = await this.state.web3.eth.getTransaction(mongoResponse.transactionHash);
                console.log("Dhiliop" , receipt);
                this.setState({
                    displayResult: true,
                    isDeepfake : false,
                    ipfsHash: generatedIpfsHash,
                    transactionReceipt: receipt
                })
            }
            else{
                console.error("MongoDB has been tampered! Re-index the blockchain");
                window.alert("Some error occurred. Check console");
            }
        }
    }

    render(){
        return(
            this.state.isLoading ? 
            <h2>Loading..</h2>
            :
            <div>
                <h1>Detect Deepfake</h1>
                <form>
                    <div className="file-input">                    
                    <input type='file' onChange={this.captureFile}/>
                     <span className='button'>Choose</span>
                    <span className='label'>{this.state.fileLabel}</span>
                    </div>
                </form>
                {
                    this.state.displayResult ?
                    <div> 
                        {
                            this.state.isDeepfake ?
                            <h1>Deepfake Media</h1>
                            :
                            <div>
                            <h1>Original Media</h1>
                            <TransactionReceipt 
                                ipfsHash={this.state.ipfsHash}
                                receipt={this.state.transactionReceipt} 
                                web3={this.state.web3}
                            />
                            </div>
                        }                   
                        <img src={this.state.imageURL} className="input-img"/> 

                    </div>
                    : null
                }
            </div>
        )
    }
}

export default DetectPage;