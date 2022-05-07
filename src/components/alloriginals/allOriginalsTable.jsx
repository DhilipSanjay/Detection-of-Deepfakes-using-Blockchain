import React, { Component } from "react";

class AllOriginalsTable extends Component{
    render() {
        return (
            <div>
                <table>
                    <thead>
                    <tr>
                        <th>Serial Number</th>
                        <th>Ipfs Hash &<br/>Transaction Hash</th>
                        <th>Account Address</th>
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
                                <td><img width="100px" src={`http://localhost:8080/ipfs/${transaction.ipfsHash}`} alt="" /></td>
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