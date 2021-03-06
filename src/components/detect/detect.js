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
            fileType: '',
            imageURL: '#',
            isLoading: false,
            displayResult: false,
            isDeepfake: false
        }

        this.captureFile = this.captureFile.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.isValidFileUploaded = this.isValidFileUploaded.bind(this);
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

    isValidFileUploaded(file) {
        const validFileFormat = ['image', 'video'];
        const fileFormat = file.type.split('/')[0];
        return validFileFormat.includes(fileFormat);
    }

    captureFile(event){
        try{
            event.preventDefault();
            if(event.target.files.length < 1){
                window.alert("Upload media file!");
                return;
            }
            const file = event.target.files[0];
            
            if(this.isValidFileUploaded(file)){
                const url = URL.createObjectURL(file);

                this.setState({
                    fileType: file.type.split('/')[0],
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
            else{
                window.alert("Currently only image and video files can be uploaded for deepfake detection!");
                return;
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
                <div className="big-text">Detect Deepfake</div>
                <div className="steps">
                    <div className="single-step">
                        <img src={clickImg} alt="Click" />
                        <div className="single-step-content">
                            <div className="main-title">Click</div>
                            <p>Take or choose a media from your device</p>
                        </div>
                    </div>
                    
                    <div className="single-step">
                        <img src={uploadImg} alt="Upload" />
                        <div className="single-step-content">
                        <div className="main-title">Upload</div>
                        <p>Upload the media to <b>Source of Truth</b> DApp</p>
                        </div>
                    </div>
                    <div className="single-step">
                    <img src={detectImg} alt="Detect" />
                    <div className="single-step-content">
                        <div className="main-title">Detect</div>
                        <p>Detect if the media is original or deepfake</p>
                    </div>
                    </div>
                </div>

                <br/>
                <h2>Browse Media File</h2>
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
                        {
                            this.state.fileType === "image" ?
                            <img src={this.state.imageURL} alt="" className="input-img"/> 
                            :
                            <video width="320" height="240" controls>
                                <source src={this.state.imageURL}/>
                            </video>
                        }                   

                    </div>
                    : null
                }
            </div>
        )
    }
}

export default DetectPage;