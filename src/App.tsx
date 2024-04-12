import React, { useState, useEffect } from 'react';
import { useETHProvider, useBTCProvider, useConnectModal } from '@particle-network/btc-connectkit';
import { chains } from '@particle-network/chains';
import { ethers } from 'ethers';
import { notification } from 'antd';
import './App.css';

// Frontend component only -- ignore
import NetworkIndicator from './networkIndicator';
// --

const App = () => {
  const { provider, evmAccount, chainId } = useETHProvider();
  const { openConnectModal, disconnect } = useConnectModal();
  const { accounts, sendBitcoin, getNetwork } = useBTCProvider();

  const customProvider = new ethers.providers.Web3Provider(provider, "any");

  const handleLogin = () => {
    openConnectModal();
  };

  const executeTxEvm = async () => {
    const signer = customProvider.getSigner();

    const tx = {
      to: "0x000000000000000000000000000000000000dEaD",
      value: ethers.utils.parseEther('0.01'),
      data: "0x"
    };

    const txResponse = await signer.sendTransaction(tx);
    const txReceipt = await txResponse.wait();

    notification.success({
      message: "Transaction Successful",
      description: (
        <div>
          Transaction Hash: <a href={`${chains.getEVMChainInfoById(chainId).blockExplorerUrl}/tx/${txReceipt.transactionHash}`} target="_blank" rel="noopener noreferrer">{txReceipt.transactionHash}</a>
        </div>
      )
    });
  };

  const executeTxBtc = async () => {
    const hash = await sendBitcoin(accounts[0], 1);

    notification.success({
      message: 'Transaction Successful',
      description: (
        <div>
          Transaction Hash: <a href={`https://live.blockcypher.com/btc-testnet/tx/${hash}`} target="_blank" rel="noopener noreferrer">{hash}</a>
        </div>
      )
    });
  };


  return (
    <div className="App">
      <div className="logo-section">
        <img src="https://i.imgur.com/EerK7MS.png" alt="Logo 1" className="logo logo-big" />
      </div>
      {!evmAccount ? (
      <button className="sign-button" onClick={handleLogin}>
        <img src="https://i.imgur.com/aTxNcXk.png" alt="Bitcoin Logo" className="bitcoin-logo" />
        Connect
      </button>
      ) : (
        <div className="profile-card">
          <NetworkIndicator />
          <button className="sign-message-button" onClick={executeTxEvm}>Execute EVM Transaction</button>
          <button className="sign-message-button button-btc" onClick={executeTxBtc}>Execute BTC Transaction</button>
          <button className="disconnect-button" onClick={() => {disconnect();}}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default App;
