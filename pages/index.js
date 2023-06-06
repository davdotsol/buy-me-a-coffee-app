import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Coffee from '../abis/BuyMeACoffee.json';

const contractAddress = '0x00301b5E6D965573e9287DC523b028E4C5119470';

const Home = () => {
  const [contract, setContract] = useState(null);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const startUp = async () => {
      await loadContract();
    };
    startUp();
  }, []);

  const loadContract = async () => {
    let signer = null;

    let provider;
    if (window.ethereum == null) {
      // If MetaMask is not installed, we use the default provider,
      // which is backed by a variety of third-party services (such
      // as INFURA). They do not have private keys installed so are
      // only have read-only access
      console.log('MetaMask not installed; using read-only defaults');
    } else {
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

        contract.on('DonationReceived', (...eventData) => {
          const [donor, donationAmount] = eventData;

          setDonations((prevDonations) => {
            const newDonation = {
              donor,
              donationAmount,
            };

            // append new donation
            return [...prevDonations, newDonation];
          });
        });
        setContract(contract);
      } catch (err) {
        console.error(err);
        alert('Load Contract failed.');
      }
    }
  };

  const handleDonate = async () => {
    if (contract) {
      setLoading(true);
      try {
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
        step="any"
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
      />
      <button onClick={handleDonate} disabled={loading}>
        Donate
      </button>

      <h2>Donation History</h2>
      {donations.map((donation, index) => (
        <div key={index}>
          <p>Donor: {donation.donor}</p>
          <p>Amount: {donation.donationAmount} ETH</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default Home;
