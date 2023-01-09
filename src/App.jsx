import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("0");
  const [allWaves, setAllWaves] = useState([]);
  const [waveCount, setWaveCount] = useState(0);
  const [message, setMessage] = useState("");  // add this line to hold the message state
  /**
   * Create a varaible here that holds the contract address after you deploy!
   */
  const contractAddress = "0x0d59a8C5f2268bD4004736B5A09039E3A7Fe9b77";
  const contractABI = abi.abi;

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    getAllWaves();
  }, [currentAccount]);

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);

        /*
         * Get the total number of waves and store it in state
         */
        const count = await wavePortalContract.getTotalWaves();
        setWaveCount(count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

   const checkIfWalletIsConnected = async () => {
  try {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)
    } else {
      console.log("No authorized account found");
      // Add this block to render a "Connect Wallet" button if no authorized account is found
    }
  } catch (error) {
    console.log(error);
  }
}

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
         * Call the wave method from your Smart Contract
         */
        const tx = await wavePortalContract.wave("Hello, World!");

        console.log("Transaction:", tx);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /*
   * Add a function here that will handle the form submission
   * You will need to pass the message state as an argument to this function
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the wave method from your Smart Contract, passing in the message as an argument
         */
        const tx = await wavePortalContract.wave(message);
        console.log("Transaction:", tx);

        // reset the message state
        setMessage("");
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
  <div className="mainContainer">
    <div className="dataContainer">
      <div className="header">
        🎵 Music Portal
      </div>

      <div className="bio">
        Hey! I'm Tanvi and I'm a 16 y/o building in Web3. Connect your Ethereum wallet to wave at me or share a link to your favourite song and why it means so much to you! Check out music favourites from around the world below!
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
        <button className="wave-button" onClick={wave}>Wave</button>
      </div>
       
      <div className="total-waves" style={{ display: 'flex', justifyContent: 'center', fontWeight: 'bold', fontSize: '40px' , marginTop: '20px'}}>
        <div>Total Waves: {waveCount}</div>
      </div>
      <form onSubmit={handleSubmit} style={{ width: '100%', margin: '0 auto' }}>
  <label style={{ fontWeight: 'bold', fontSize: '40px' }}>
    {/* remove the "Message:" text */}
    <input className="message-input" type="text" value={message} onChange={event => setMessage(event.target.value)} style={{ margin: '0 auto', width: '99%' }} />
        </label>
        {/* display the submit button as a button */}
        <button className="submit-button" type="submit" value="Submit">Send Message</button>
      </form>

      <ul>
        {allWaves.map((wave, index) => (
          <li key={index} style={{ fontWeight: 'bold', textAlign: 'center', listStyleType: 'none', marginTop: '20px', paddingRight: '50px' }}>
             <div style={{ marginLeft: '20px', border: '5px solid black', padding: '10px' }}>
        <p style={{ fontSize: '14px' }}>Address: {wave.address}</p>
<p style={{ fontSize: '14px' }}>Timestamp: {wave.timestamp.toString()}</p>
<p style={{ fontSize: '14px' }}>Message: {wave.message}</p>
      </div>
    </li>
  ))}
</ul>
    </div>
  </div>
);
}
export default App
