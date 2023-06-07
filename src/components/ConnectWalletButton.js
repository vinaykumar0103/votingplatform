import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const ConnectWalletButton = () => {
  const [account, setAccount] = useState('');

  const connectWallet = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
    } catch (error) {
      console.log('Error connecting wallet:', error);
    }
  };

  const disconnectWallet = () => {
    setAccount('');
  };

  useEffect(() => {
    const checkAccount = async () => {
      if (window.ethereum && window.ethereum.selectedAddress) {
        const address = window.ethereum.selectedAddress;
        setAccount(address);
      }
    };

    checkAccount();
  }, []);

  return (
    <div>
      {!account ? (
        <button onClick={connectWallet} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
          Connect Wallet
        </button>
      ) : (
        <div>
          <p>Connected Account: {account}</p>
          <button onClick={disconnectWallet} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
};

export default ConnectWalletButton;
