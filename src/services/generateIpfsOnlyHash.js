import ipfs from "./ipfs";

const generateIpfsOnlyHash = async (buffer) => {
    console.log("buffer", buffer);
    const result = await ipfs.add(buffer, {"only-hash" : true});
    const generatedIpfsHash = result.path;
    return generatedIpfsHash;
}

export default generateIpfsOnlyHash;