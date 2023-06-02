import React, { useState } from 'react';
import { ethers } from 'ethers';
import Coffee from '../abis/Coffee.json';

const contractAddress = '0x499e92CA65DCae686e26C86779d2DAC081234319';

const Home = () => {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleDonate = async () => {
    let signer = null;

    let provider;
    if (window.ethereum == null) {
      // If MetaMask is not installed, we use the default provider,
      // which is backed by a variety of third-party services (such
      // as INFURA). They do not have private keys installed so are
      // only have read-only access
      console.log('MetaMask not installed; using read-only defaults');
    } else {
      setLoading(true);
      // Connect to the MetaMask EIP-1193 object. This is a standard
      // protocol that allows Ethers access to make all read-only
      // requests through MetaMask.
      provider = new ethers.BrowserProvider(window.ethereum);

      // It also provides an opportunity to request access to write
      // operations, which will be performed by the private key
      // that MetaMask manages for the user.
      signer = await provider.getSigner();
      try {
        const contract = new ethers.Contract(
          contractAddress,
          Coffee.abi,
          signer
        );
        const donationTx = await contract.donate({
          value: ethers.parseEther(amount.toString()),
        });
        await donationTx.wait();
        alert('Thank you for your donation!');
        setAmount(0);
      } catch (err) {
        console.error(err);
        alert('Donation failed. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Buy Me a Coffee</h1>
      <p>Enter the amount of ETH you want to donate:</p>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
      />
      <button onClick={handleDonate} disabled={loading}>
        Donate
      </button>
    </div>
  );
};

export default Home;
