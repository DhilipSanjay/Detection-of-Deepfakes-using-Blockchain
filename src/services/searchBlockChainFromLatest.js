import fetchTransactionIpfsHash from "./fetchTransactionIpfsHash";
import generateIpfsOnlyHash from "./generateIpfsOnlyHash";

const searchBlockChainFromLatest = async (web3, buffer) => {
    const generatedIpfsHash = await generateIpfsOnlyHash(buffer);
    let currentBlock = await web3.eth.getBlock('latest');
    console.log("Latest/Current Block" + currentBlock.number)
    let currentBlockNumber = currentBlock.number;

    let earliestBlock = await web3.eth.getBlock('earliest');
    console.log("Earliest Block" + earliestBlock.number)
    let earliestBlockNumber = earliestBlock.number;
    
    console.log("From Latest to Earliest");
    while(currentBlockNumber >= earliestBlockNumber){
        if(currentBlock != null && currentBlock.transactions != null){
            console.log("Searching Block Number " + currentBlockNumber);
            for(let transactionHash of currentBlock.transactions){
                try{
                    const chainIpfsHash = await fetchTransactionIpfsHash(transactionHash, web3);
                    if(chainIpfsHash === generatedIpfsHash)
                    {
                        console.log(chainIpfsHash, generatedIpfsHash);
                        console.log("Matching IPFS Hash found in block " + currentBlockNumber + "\n Transaction Hash " + transactionHash);
                        return;
                    }
                }
                catch(error){
                    console.error(error);
                }
            }
        }
        currentBlockNumber--;
        currentBlock = await web3.eth.getBlock(currentBlockNumber);
    }
}

export default searchBlockChainFromLatest;