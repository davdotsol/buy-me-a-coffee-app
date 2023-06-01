import React, { useState } from 'react';
import Web3 from 'web3';
import Coffee from '../abis/Coffee.json';

const IndexPage = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const connectWeb3 = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setAccount(accounts[0]);
        const web3 = new Web3(window.ethereum);
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Coffee.networks[networkId];
        const contract = new web3.eth.Contract(
          Coffee.abi,
          deployedNetwork && deployedNetwork.address
        );
        setWeb3(web3);
        setContract(contract);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('Web3 provider not found');
    }
  };

  const donate = async () => {
    if (contract && account) {
      setLoading(true);
      try {
        const donationWei = web3.utils.toWei(donationAmount, 'ether');
        await contract.methods
          .donate()
          .send({ value: donationWei, from: account });
        alert('Thank you for your donation!');
        setDonationAmount('');
      } catch (error) {
        console.error(error);
        alert('An error occurred during the donation process');
      }
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Buy Me a Coffee</h1>
      {web3 ? (
        <>
          <p>Connected with Web3</p>
          <input
            type="number"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
          />
          <button onClick={donate} disabled={loading}>
            Donate
          </button>
        </>
      ) : (
        <button onClick={connectWeb3}>Connect with Web3</button>
      )}
    </div>
  );
};

export default IndexPage;
