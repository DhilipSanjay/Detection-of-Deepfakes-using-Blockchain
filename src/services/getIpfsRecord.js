const getIpfsRecord = async (ipfsHash) => {
   
    const response = await fetch("http://localhost:5000/ipfsRecord/" + ipfsHash)
    .then( async (response) => {
        response = await response.json();

        if(response){
            console.log("IpfsRecord fetched successfully", response);
            return response;
        }
        else{
            console.log("No record with the ipfsHash found", response);
            return null;
        }
    })
    .catch(error => {
        console.error(error);
        return null;
    })
    return response;      
}

export default getIpfsRecord;