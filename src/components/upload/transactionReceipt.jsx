import React, { Component } from "react";

class TransactionReceipt extends Component{

    constructor(props){
        super(props);

        this.state = {
            ipfsHash: '',
            address: '',
            blockNumber: '',
            transactionHash: '',
            gasUsed: ''
        }
    }

    componentWillMount(){
        this.setState({
            ipfsHash: this.props.ipfsHash,
            address: this.props.receipt.from,
            blockNumber: this.props.receipt.blockNumber,
            transactionHash: this.props.receipt.transactionHash,
            gasUsed: this.props.receipt.gasUsed.toString() + "Wei"
        })
    }

    render() {
        return (
            <div>
                <table>
                    <thead>
                    <tr>
                        <th>Transaction Receipt Category</th>
                        <th>Values</th>
                    </tr>
                    </thead>
                
                    <tbody>
                    <tr>
                        <td>IPFS Hash stored on Blockchain</td>
                        <td>{this.state.ipfsHash}</td>
                    </tr>
                    <tr>
                        <td>Ethereum Wallet Address</td>
                        <td>{this.state.address}</td>
                    </tr>
                    <tr>
                        <td>Transaction Hash</td>
                        <td>{this.state.transactionHash}</td>
                    </tr>
                    <tr>
                        <td>Block Number </td>
                        <td>{this.state.blockNumber}</td>
                    </tr>
                    <tr>
                        <td>Gas Used</td>
                        <td>{this.state.gasUsed}</td>
                    </tr>
                    
                    </tbody>
                    </table>
            </div>
        );
    }
}

export default TransactionReceipt;