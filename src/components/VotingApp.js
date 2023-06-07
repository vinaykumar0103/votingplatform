import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import VotingPlatform from '../contract/VotingPlatform.json';
import ConnectWalletButton from './ConnectWalletButton';

const contractAddress = '0xCb59C5c7509f9F71F39f2c7f38c9071eD88492B3'; // Replace with your contract address

const VotingApp = () => {
  
  const [account, setAccount] = useState('');
  const [question, setQuestion] = useState('');
  const [expiryTime, setExpiryTime] = useState('');
  const [optionName, setOptionName] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        setAccount(accounts[0]);
      } else {
        setErrorMessage('No Ethereum wallet found. Please install MetaMask.');
      }
    } catch (error) {
      console.log('Error connecting wallet:', error);
    }
  };

  const createTopic = async () => {
    if (!account) {
      await connectWallet();
      setErrorMessage('Please connect your wallet');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, VotingPlatform.abi, provider.getSigner());

      const tx = await contract.createTopic(question, expiryTime);
      await tx.wait();

      // Topic created successfully
      console.log('Topic created!');
    } catch (error) {
      console.log('Error creating topic:', error);
    }
  };

  const createOption = async () => {
    if (!account) {
      await connectWallet();
      setErrorMessage('Please connect your wallet');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, VotingPlatform.abi, provider.getSigner());

      const tx = await contract.createOption(selectedTopic, optionName);
      await tx.wait();

      // Option created successfully
      console.log('Option created!');
    } catch (error) {
      console.log('Error creating option:', error);
    }
  };

  const vote = async () => {
    if (!account) {
      await connectWallet();
      setErrorMessage('Please connect your wallet');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, VotingPlatform.abi, provider.getSigner());

      const tx = await contract.vote(selectedTopic, selectedOption);
      await tx.wait();

      // Voted successfully
      console.log('Voted!');
    } catch (error) {
      console.log('Error voting:', error);
    }
  };

  useEffect(() => {
    const checkAccount = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_accounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();
          setAccount(accounts[0]);
        } catch (error) {
          console.log('Error checking account:', error);
        }
      }
    };

    checkAccount();
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div className="container mx-auto p-4">
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

        <ConnectWalletButton onConnect={connectWallet}/> 
         
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Create Topic</h2>
          <input
            type="text"
            placeholder="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="p-2 border border-gray-300 rounded mb-2"
          />
          <input
            type="datetime-local"
            placeholder="Expiry Time"
            value={expiryTime}
            onChange={(e) => setExpiryTime(e.target.value)}
            className="p-2 border border-gray-300 rounded mb-2"
          />
          <button
            onClick={createTopic}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Create Topic
          </button>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Create Option</h2>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="p-2 border border-gray-300 rounded mb-2"
          >
            <option value="">Select Topic</option>
            {/* Render topics dynamically */}
          </select>
          <input
            type="text"
            placeholder="Option Name"
            value={optionName}
            onChange={(e) => setOptionName(e.target.value)}
            className="p-2 border border-gray-300 rounded mb-2"
          />
          <button
            onClick={createOption}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Create Option
          </button>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Vote</h2>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="p-2 border border-gray-300 rounded mb-2"
          >
            <option value="">Select Topic</option>
            {/* Render topics dynamically */}
          </select>
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="p-2 border border-gray-300 rounded mb-2"
          >
            <option value="">Select Option</option>
            {/* Render options dynamically based on selected topic */}
          </select>
          <button
            onClick={vote}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Vote
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default VotingApp;
