pragma solidity >=0.4.22 <0.9.0;

contract IpfsStorage {
   string ipfsHash;

   function sendHash(string memory value) public{
       ipfsHash = value;
   }

   function getHash() public view returns (string memory){
       return ipfsHash;
   }
}
