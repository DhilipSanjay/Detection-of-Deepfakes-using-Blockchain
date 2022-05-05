import React, { Component } from "react";

class AllOriginalsTable extends Component{

    constructor(props){
        super(props);
    }

    render() {
        return (
            <div>
                <table>
                    <thead>
                    <tr>
                        <th>Serial Number</th>
                        <th>Ipfs Hash</th>
                        <th>Transaction Hash</th>
                        {/* <th>Account Address</th> */}
                        <th>Preview</th>
                    </tr>
                    </thead>
                
                    <tbody>
                
                    {
                        this.props.allTransactions.map(
                            (transaction, i) => 
                            <tr>
                                <td>{i}</td>
                                <td>{transaction.ipfsHash}</td>
                                <td>{transaction.transactionHash}</td>
                                {/* <td>{transaction.from}</td> */}
                                <td><img width="50px" src={`http://localhost:8080/ipfs/${transaction.ipfsHash}`} alt="" /></td>
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