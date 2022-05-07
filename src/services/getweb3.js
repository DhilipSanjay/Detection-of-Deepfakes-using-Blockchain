import Web3 from 'web3'

const getWeb3 = async () => { 
    var results = null;
    try{
      if (window.ethereum) {
        console.log("Window.ethereum");
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        results = {
          web3: window.web3
        }
      } 
      else if(window.web3){
        window.web3 = new Web3(window.web3.currentProvider);
        console.log("Window.web3");
        results = {
          web3: window.web3.currentProvider
        }
      }
      else{
        window.alert("Non-Ethereum browser detected. Install MetaMask!");
      }
    }catch(error){
      window.alert("Error Occurred!");
      console.error(error);
    }
    return results;
  }

export default getWeb3;