import getWeb3 from "./getweb3";

const fetchTransactionDetails = async (transactionHash, web3) => {
    var chainIpfsHash;
    
    await web3.eth.getTransaction(transactionHash, async (error, transaction) => {
        if(error){
            console.log(error);
            return;
        }
        let transactionData = transaction.input;
        console.log(transactionData);
        let inputData = '0x' + transactionData.slice(10);  // get only data without function selector

        let params = await web3.eth.abi.decodeParameters(['string'], inputData);
        console.log(params);
        chainIpfsHash = params[0];
    });
    return chainIpfsHash;
}

export default fetchTransactionDetails;