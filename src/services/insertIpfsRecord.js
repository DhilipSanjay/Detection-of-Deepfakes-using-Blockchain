import getIpfsRecord from "./getIpfsRecord";

const insertIpfsRecord = async (ipfsHash, transactionHash, account) => {

    const response = await getIpfsRecord(ipfsHash);

    // Insert only if it is not present already
    if(!response){
        var object = { ipfsHash: ipfsHash,
                        transactionHash: transactionHash,
                        account: account};
        await fetch("http://localhost:5000/ipfsRecord/insert", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(object)
        })
        .then(console.log("Transaction Details inserted successfully to MongoDB"))
        .catch(error => {
            console.error(error);
            return;
        })        
    }
    else{
        console.log("Already existing file!! Duplicate!!");
    }
   
}

export default insertIpfsRecord;