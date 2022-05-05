const getAllIpfsRecords = async (ipfsHash) => {
   
    const response = await fetch("http://localhost:5000/ipfsRecord/")
    .then( async (response) => {
        response = await response.json();

        if(response){
            console.log("All Documents in the collection fetched successfully", response);
            return response;
        }
        else{
            console.log("No Document found in the collection", response);
            return null;
        }
    })
    .catch(error => {
        console.error(error);
        return null;
    })
    return response;      
}

export default getAllIpfsRecords;