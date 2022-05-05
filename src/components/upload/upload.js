import React, { Component } from "react";
import IpfsStorageContract from "../../abis/IpfsStorage.json"
import ipfs from "../../services/ipfs"
import getWeb3 from "../../services/getweb3";
import TransactionReceipt from "./transactionReceipt";
import insertIpfsRecord from "../../services/insertIpfsRecord";
import generateIpfsOnlyHash from "../../services/generateIpfsOnlyHash";
import getIpfsRecord from "../../services/getIpfsRecord";
import verifyTransaction from "../../services/verifyTransaction";

class UploadPage extends Component{

    constructor(props){
        super(props);

        this.state = {
            ipfsHash: '',
            web3: null,
            buffer: '',
            address: '',
            transactionReceipt: '',
            uploaded: false,
            isLoading: false
        }

        this.captureFile = this.captureFile.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillMount() {
        getWeb3.then((results)  => {
          this.setState({
            web3: results.web3,
            isLoading: true
          }, async () => {
            const accounts =  await this.state.web3.eth.getAccounts();
            console.log(accounts)
            this.instantiateContract();
          }) 
        })
        .catch((e) => {
          console.log(e, 'Error finding web3.')
        })
    }

    async onSubmit(event){
        event.preventDefault();

        // Generate IPFS hash of the uploaded media 
        const generatedIpfsHash = await generateIpfsOnlyHash(this.state.buffer);

        // Check if the document with the correspoding IpfsHash exists - (i.e.) returns the mongoDB Document
        const mongoResponse = await getIpfsRecord(generatedIpfsHash);
        console.log(generatedIpfsHash, mongoResponse);

        if(mongoResponse){
            // Document with the ipfsHash is found in MongoDB 
            // Verify if ipfsHash from Mongo is same in the blockchain transaction          
            const result = await verifyTransaction(mongoResponse, this.state.web3);
            
            if(result){
                console.log("Duplicate original media - will not be uploaded");
                return;
            }
            else{
                console.error("MongoDB has been tampered! Re-index the blockchain");
                return;
            }
        }
        else{
            // No document found in MongoDB => Upload .
            console.log("Uploading buffer", this.state.buffer);

            // Upload to IPFS
            const ipfsResult = await ipfs.add(this.state.buffer);
            this.setState({isLoading: true});        
        
            if(ipfsResult){
                console.log("Uploaded successfully", ipfsResult);

                // Fetch the IPFS hash from the result
                this.setState({ ipfsHash: ipfsResult.path }, () => {
                console.log("ifpsHash", this.state.ipfsHash);
                
                // Store the IPFS hash in blockchain
                console.log('Executing Smart contract');
                this.ipfsStorageInstance.sendHash(ipfsResult.path, { from: this.state.address })
                .then((receipt)  => {
                    console.log("Transaction Receipt", receipt);
                    receipt = receipt.receipt; 
                    
                    // Store the IpfsHash and TransactionHash in MongoDB
                    this.setState({
                        transactionReceipt : receipt,
                        uploaded: true,
                    }, async () => {
                        console.log("Storing Transaction hash & IPFS hash in Mongo DB");
                        await insertIpfsRecord(this.state.ipfsHash, this.state.transactionReceipt.transactionHash);
                        this.setState({isLoading: false});
                        });                    
                    })
                }); 
            }
        }
    }

    captureFile(event){
        try{
            event.preventDefault();
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

    async instantiateContract(){
        const contract = require('@truffle/contract')
        const ipfsStorage = contract(IpfsStorageContract)
       
        ipfsStorage.setProvider(this.state.web3.currentProvider)
   
        this.state.web3.eth.getAccounts((error, accounts) => {
        ipfsStorage.deployed().then((instance) => {
            this.ipfsStorageInstance = instance
            this.setState({ 
                address: accounts[0],
                isLoading: false
            })
        })
    })

    }

    render(){
        return(
            
            this.state.isLoading ? 
            <h2>Loading</h2>
            :
            <div>
                <h1> Upload the original Media </h1>
                <form onSubmit={this.onSubmit}>
                    <input type="file"  onChange={this.captureFile}/>
                    <input type="submit" />
                </form>

                {
                    this.state.uploaded ?
                    <div>
                        <img src={`http://localhost:8080/ipfs/${this.state.ipfsHash}`} alt=""/>
                        <TransactionReceipt 
                            ipfsHash={this.state.ipfsHash}
                            receipt={this.state.transactionReceipt} 
                            web3={this.state.web3} />
                    </div>
                    : null
                }
            </div>
        )
    }
}

export default UploadPage;