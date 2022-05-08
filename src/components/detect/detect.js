import React, { Component } from "react";
import generateIpfsOnlyHash from "../../services/generateIpfsOnlyHash";
import getIpfsRecord from "../../services/getIpfsRecord";
import getWeb3 from "../../services/getweb3";
import verifyTransaction from "../../services/verifyTransaction";
import TransactionReceipt from "../upload/transactionReceipt";
import "../upload/upload.css";
import searchBlockChainFromLatest from "../../services/searchBlockChainFromLatest";
import searchBlockChainFromEarliest from "../../services/searchBlockChainFromEarliest";
import clickImg from "../../img/click.png"
import uploadImg from "../../img/upload.png"
import detectImg from "../../img/detect.png"

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

    componentDidMount(){
        getWeb3().then((results)  => {
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
                    var startTime = performance.now();
                    await this.onSubmit();
                    var endTime = performance.now();
                    console.debug(`Call to onSubmit took ${endTime - startTime} milliseconds or ${(endTime - startTime)/1000} seconds`);
                    
                    startTime = performance.now();
                    await searchBlockChainFromLatest(this.state.web3, this.state.buffer);
                    endTime = performance.now();
                    console.debug(`Call to searchBlockChainFromLatest took ${endTime - startTime} milliseconds or ${(endTime - startTime)/1000} seconds`);

                    startTime = performance.now();
                    await searchBlockChainFromEarliest(this.state.web3, this.state.buffer);
                    endTime = performance.now();
                    console.debug(`Call to searchBlockChainFromEarliest took ${endTime - startTime} milliseconds or ${(endTime - startTime)/1000} seconds`);
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
                this.setState({
                    displayResult: true,
                    isDeepfake : false,
                    ipfsHash: generatedIpfsHash,
                    transactionReceipt: receipt
                });
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
            <div className="section">
                <div class="big-text">Detect Deepfake</div>
                <div class="steps">
                    <div class="single-step">
                        <img src={clickImg} alt="Click" />
                        <div class="single-step-content">
                            <div class="main-title">Click</div>
                            <p>Take or choose a media from your device</p>
                        </div>
                    </div>
                    
                    <div class="single-step">
                        <img src={uploadImg} alt="Upload" />
                        <div class="single-step-content">
                        <div class="main-title">Upload</div>
                        <p>Upload the media to <b>Source of Truth</b> DApp</p>
                        </div>
                    </div>
                    <div class="single-step">
                    <img src={detectImg} alt="Detect" />
                    <div class="single-step-content">
                        <div class="main-title">Detect</div>
                        <p>Detect if the media is original or deepfake</p>
                    </div>
                    </div>
                </div>

                <br/>
                <h1>Browse Files</h1>
                <form>
                    <div className="file-input">                    
                    <input type='file' onChange={this.captureFile}/>
                     <button>Choose</button>
                    <span className='label'>{this.state.fileLabel}</span>
                    </div>
                </form>
                <br/>
                {
                    this.state.displayResult ?
                    <div> 
                        {
                            this.state.isDeepfake ?
                            <div>
                                <h1>Deepfake Media</h1>
                                {/* <p>If this media is original, then you might not have uploaded this media to our system. Consider uploading <Link to="/upload">here</Link>.</p> */}
                            </div>
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
                        <img src={this.state.imageURL} alt="" className="input-img"/> 

                    </div>
                    : null
                }
            </div>
        )
    }
}

export default DetectPage;