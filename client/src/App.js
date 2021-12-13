import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import ipfs from './ipfs'

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      storageValue: 0,
      web3: null, 
      accounts: null, 
      contract: null, 
      buffer: null, ipfsHash: '' };
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }


  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  runExample = async () => {
    
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set("25").send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };


  captureFile(event){
    console.log('capture file ...')
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file) //converting uploaded file into array of buffer
    reader.onloadend = () => {
      this.setState({buffer : Buffer(reader.result)})  //converting uploaded file into array of buffer
      console.log('buffer', this.state.buffer)  //consoling it out just in case to check the buffer
    }

  }

  onSubmit(event){
    event.preventDefault() //prevents from reloading the page on clicking submit button
    console.log('on submit....')
    ipfs.files.add(this.state.buffer,(error,result) => {
      if(error) {
        console.error(error)
        return
      }
      this.setState({ipfsHash: result[0].hash})
      console.log('ipfsHash', this.state.ipfsHash)

      
      

    })

  }

  




  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>FLOKI - The Carrier</h1>
        <p>This platform helps you share files accross Internet through Blockchain.</p>
        <h2>File to be shared is stored on IPFS and The Ethereum blockchain!!</h2>
        <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt="😈"/>
        <h2>Upload File</h2>
        <form onSubmit={this.onSubmit} >
        <input type = 'file' onChange={this.captureFile}/>
        <input type = 'submit' /> 
        <p>
          Welcome to the dark side 😈
        </p>
        

        </form>
        
      </div>
    );
  }
}

export default App;
