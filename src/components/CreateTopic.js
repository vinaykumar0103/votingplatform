import React, { useState } from 'react';
import { ethers } from 'ethers';
import VotingPlatform from '../contract/VotingPlatform.json';
import CreateOption from './CreateOption';

const CreateTopic = ({ onTopicCreated }) => {
  const [question, setQuestion] = useState('Blockchain is a?');
  const [expiryTime, setExpiryTime] = useState('');
  const [options] = useState(['Decentralized', 'Centralized']);
  const [selectedOption, setSelectedOption] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const createTopic = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not detected');
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractAddress = '0xFb986557c5a0fD93EEbD2Cbe9494D9186F2B94C5'; // Replace with your contract address
      const contractABI = VotingPlatform.abi; // Extract the ABI from the JSON object
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Convert expiryTime to UNIX timestamp
      const expiryTimestamp = new Date(expiryTime).getTime() / 1000;

      // Create the topic with question and expiry time
      const tx = await contract.createTopic(question, expiryTimestamp);
      await tx.wait();

      // Get the created topic data
      const topicId = await contract.getLatestTopicId();
      const topicData = await contract.getTopic(topicId);

      // Store the options for the created topic
      for (let i = 0; i < options.length; i++) {
        const optionTx = await contract.createOption(topicId, i, options[i]);
        await optionTx.wait();
      }

      // Topic created successfully
      console.log('Topic created:', topicData);

      // Pass the created topic data to the parent component
      onTopicCreated(topicData);

      // Render the CreateOption component with the necessary props
      const createOptionComponent = (
        <CreateOption contract={contract} topic={topicData} onUpdate={() => {}} />
      );

      return createOptionComponent;
    } catch (error) {
      console.log('Error creating topic:', error);
      setErrorMessage('Error creating topic: ' + error.message);
    }
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">Create Vote Topic</h2>
      <p className="mb-2">Question: {question}</p>

      <h3 className="text-lg font-bold mb-2">Options</h3>
      {options.map((option, index) => (
        <div key={index}>
          <input
            type="radio"
            id={`option-${index}`}
            name="selectedOption"
            value={option}
            checked={selectedOption === option}
            onChange={() => handleOptionSelect(option)}
            className="mr-2"
          />
          <label htmlFor={`option-${index}`}>{option}</label>
        </div>
      ))}

      <input
        type="datetime-local"
        placeholder="Expiry Time"
        value={expiryTime}
        onChange={(e) => setExpiryTime(e.target.value)}
        className="p-2 border border-gray-300 rounded mt-2"
      />

      <button
        onClick={createTopic}
        disabled={!expiryTime || !selectedOption}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-4"
      >
        Select
      </button>

      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
    </div>
  );
};

export default CreateTopic;
