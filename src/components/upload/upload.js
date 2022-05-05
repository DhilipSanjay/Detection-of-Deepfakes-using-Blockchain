import React, { Component } from "react";
import IpfsStorageContract from "../../abis/IpfsStorage.json"
import ipfs from "../../services/ipfs"
import getWeb3 from "../../services/getweb3";
import TransactionReceipt from "./transactionReceipt";

class UploadPage extends Component{

    constructor(props){
        super(props);

        this.state = {
            ipfsHash: '',
            web3: null,
            buffer: '',
            address: '',
            transactionReceipt: '',
            uploaded: false
        }

        this.captureFile = this.captureFile.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillMount() {
        getWeb3.then((results)  => {
          this.setState({
            web3: results.web3
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
        console.log("buffer", this.state.buffer);
        const result = await ipfs.add(this.state.buffer);
        if(result){
            console.log(result);
            this.setState({ ipfsHash: result.path }, () => {
            console.log('ifpsHash', this.state.ipfsHash);
            this.ipfsStorageInstance.sendHash(result.path, { from: this.state.address }).then((receipt) => {
                console.log(receipt);
                receipt = receipt.receipt; // JSON object
                this.setState({
                    transactionReceipt : receipt,
                    uploaded: true
                })                    
            })
        }); 
        }
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

    async instantiateContract(){
        const contract = require('@truffle/contract')
        const ipfsStorage = contract(IpfsStorageContract)
       
        ipfsStorage.setProvider(this.state.web3.currentProvider)
   
        this.state.web3.eth.getAccounts((error, accounts) => {
        ipfsStorage.deployed().then((instance) => {
            this.ipfsStorageInstance = instance
            this.setState({ address: accounts[0] })
        })
    })

    }

    render(){
        return(
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