import React, { Component } from "react";
import config from "../../config/config.json";

class AllOriginalsTable extends Component{
    render() {
        return (
            <div>
                <table>
                    <thead>
                    <tr>
                        <th>Serial Number</th>
                        <th>Ipfs Hash &<br/>Transaction Hash</th>
                        <th>Owner Address</th>
                        <th>Preview</th>
                    </tr>
                    </thead>
                
                    <tbody>
                
                    {
                        this.props.allTransactions.length === 0?
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        :
                        this.props.allTransactions.map(
                            (transaction, i) => 
                            <tr key={i+1}>
                                <td>{i+1}</td>
                                <td>{transaction.ipfsHash}<br/>{transaction.transactionHash}</td>
                                <td>{transaction.account}</td>
                                <td>
                                {
                                    transaction.fileType === "image"?
                                    <img width="100px" src={`http://${config.ipfs_host}/ipfs/${transaction.ipfsHash}`} alt="" />
                                    :
                                    <video width="100" controls>
                                        <source src={`http://${config.ipfs_host}/ipfs/${transaction.ipfsHash}`}/>
                                    </video>
                                }
                                </td>
                            </tr>
                        )
                    }
                    </tbody>
                    </table>
            </div>
        );
    }
}

export default AllOriginalsTable;