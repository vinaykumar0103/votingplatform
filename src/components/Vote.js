import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import VotingPlatform from '../contract/VotingPlatform.json';

const Vote = ({ selectedTopic, selectedUser }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [optionsData, setOptionsData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchOptionsData = async () => {
      try {
        if (!window.ethereum) {
          throw new Error('MetaMask not detected');
        }

        if (!ethers.utils.isAddress(selectedTopic)) {
          throw new Error('Invalid selected topic address');
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractAddress = '0x9F2D42B619e4C739AC64889E745Cf77De69e75e6'; // Replace with your contract address
        const contractABI = VotingPlatform.abi; // Extract the ABI from the JSON object
        const contract = new ethers.Contract(contractAddress, contractABI, signer);

        // Fetch options data for the selected topic
        const optionsCount = await contract.getOptionsCount(selectedTopic);
        const options = [];
        for (let i = 0; i < optionsCount; i++) {
          const optionId = await contract.getOptionId(selectedTopic, i);
          const option = await contract.options(optionId);
          options.push({
            id: optionId,
            name: option.name,
          });
        }

        setOptionsData(options);
      } catch (error) {
        console.log('Error fetching options data:', error);
        setErrorMessage('Error fetching options data: ' + error.message);
      }
    };

    fetchOptionsData();
  }, [selectedTopic]);

  const handleVote = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not detected');
      }

      if (!ethers.utils.isAddress(selectedTopic)) {
        throw new Error('Invalid selected topic address');
      }

      if (selectedUser !== 'selected-user-address') { // Replace 'selected-user-address' with the actual selected user's address
        throw new Error('You are not authorized to vote.');
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractAddress = '0xFb986557c5a0fD93EEbD2Cbe9494D9186F2B94C5'; // Replace with your contract address
      const contractABI = VotingPlatform.abi; // Extract the ABI from the JSON object
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.vote(selectedTopic, selectedOption);
      await tx.wait();

      // Vote successful
      console.log('Vote successful!');
    } catch (error) {
      console.log('Error voting:', error);
      setErrorMessage('Error voting: ' + error.message);
    }
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">Vote</h2>
      {optionsData.length > 0 ? (
        <>
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="p-2 border border-gray-300 rounded mb-2"
          >
            <option value="">Select an option</option>
            {optionsData.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleVote}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            disabled={!selectedOption}
          >
            Vote
          </button>
        </>
      ) : (
        <p>Loading options...</p>
      )}

      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
    </div>
  );
};

export default Vote;
