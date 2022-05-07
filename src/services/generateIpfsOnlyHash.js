import ipfs from "./ipfs";

const generateIpfsOnlyHash = async (buffer) => {
    try{
    console.log("buffer", buffer);
    const result = await ipfs.add(buffer, {"only-hash" : true});
    const generatedIpfsHash = result.path;
    return generatedIpfsHash;
    }
    catch(error){
        alert("Some error occurred. Check the console!");
        console.error(error);
    }
}

export default generateIpfsOnlyHash;