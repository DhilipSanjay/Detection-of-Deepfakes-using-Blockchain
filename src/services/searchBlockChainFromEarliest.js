import fetchTransactionIpfsHash from "./fetchTransactionIpfsHash";
import generateIpfsOnlyHash from "./generateIpfsOnlyHash";

// NOTE: This will be stupidly slow in a testnet/mainnet
const searchBlockChainFromEarliest = async (web3, buffer) => {
    const generatedIpfsHash = await generateIpfsOnlyHash(buffer);
    let currentBlock = await web3.eth.getBlock('earliest');
    console.log("Earliest/current Block" + currentBlock.number)
    let currentBlockNumber = currentBlock.number;

    let latestBlock = await web3.eth.getBlock('latest');
    console.log("Latest Block" + latestBlock.number);
    let latestBlockNumber = latestBlock.number;
    
    console.log("From Earliest to Latest");
    while(currentBlockNumber <= latestBlockNumber){
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
        currentBlockNumber++;
        currentBlock = await web3.eth.getBlock(currentBlockNumber);
    }
}

export default searchBlockChainFromEarliest;