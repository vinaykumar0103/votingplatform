import React, { useState } from 'react';


const CreateOption = ({ selectedTopic, contract }) => {
  const [optionName, setOptionName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const createOption = async () => {
    try {
      if (!selectedTopic) {
        throw new Error('No topic selected');
      }

      if (!optionName) {
        throw new Error('Option name is required');
      }

      const tx = await contract.createOption(selectedTopic, optionName);
      await tx.wait();

      // Option created successfully
      console.log('Option created!');
      setOptionName('');

    } catch (error) {
      console.log('Error creating option:', error);
      setErrorMessage('Error creating option: ' + error.message);
    }
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg font-bold mb-2">Create Option</h3>
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
        Create
      </button>
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
    </div>
  );
};

export default CreateOption;
