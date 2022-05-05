import React, { Component } from "react";
import getAllIpfsRecords from "../../services/getAllIpfsRecords";
import getWeb3 from "../../services/getweb3";
import verifyTransaction from "../../services/verifyTransaction";
import AllOriginalsTable from "./allOriginalsTable"

class AllOriginalsPage extends Component{
    constructor(props){
        super(props);

        this.state = {
            web3: null,
            isLoading: true
        }
    }

    componentWillMount(){
        getWeb3.then(async (results)  => {
            this.setState({
              web3: results.web3,
              allTransactions: null,
              isLoading: true
            });

            const allMongoDocuments = await getAllIpfsRecords();
            for (let mongoResponse of allMongoDocuments){
                const result = await verifyTransaction(mongoResponse, this.state.web3);
                if(result === false)
                {
                    window.alert("Some error occurred. Check console!");
                    return;
                }
            }

            console.log(allMongoDocuments);
            this.setState({
                allTransactions: allMongoDocuments,
                isLoading: false
            });
          })
          .catch((e) => {
            console.log(e, 'Error finding web3.')
        })     
    }

    render(){
        return(            
            this.state.isLoading ? 
            <h2>Loading</h2>
            :
            <div>
                <h1>All the Uploaded Original Media</h1> 
                <AllOriginalsTable allTransactions={this.state.allTransactions} />
            </div>

        );
    }
}

export default AllOriginalsPage;