import React, { useState } from 'react';

const CreateTopic = ({ createTopic }) => {
  const [question, setQuestion] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!question) {
        throw new Error('Please enter a question');
      }

      // Call the createTopic function passed as a prop
      await createTopic(question.trim());

      // Reset the form
      setQuestion('');
      setErrorMessage('');
    } catch (error) {
      console.log('Error creating topic:', error);
      setErrorMessage('Error creating topic: ' + error.message);
    }
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">Create Topic</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question"
          className="p-2 border border-gray-300 rounded mr-2"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Create
        </button>
      </form>
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
    </div>
  );
};

export default CreateTopic;
