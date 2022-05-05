import fetchTransactionDetails from "./fetchTransactionIpfsHash";

const verifyTransaction = async (response, web3) => {
    const mongoIpfsHash = response.ipfsHash;
    const chainIpfsHash = await fetchTransactionDetails(response.transactionHash, web3);
    console.log("verifyTransaction", chainIpfsHash, mongoIpfsHash);

    if(mongoIpfsHash === chainIpfsHash){
        return true;
    }
    else{
        return false;
    }
}

export default verifyTransaction;