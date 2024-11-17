"use client";

import { useState } from "react";
import { BrowserProvider } from "ethers";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("No Metamask wallet installed! Please install Metamask and try again.");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
    } catch (error) {
      console.log("Error connecting wallet:", error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Metamask</h1>
      <button
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#f0b90b",
          border: "none",
          cursor: "pointer",
        }}
        onClick={connectWallet}
      >
        Connect Wallet
      </button>
      {walletAddress && (
        <p style={{ marginTop: "20px", fontSize: "16px" }}>
          <strong>Connected Wallet Address:</strong> {walletAddress}
        </p>
      )}
    </div>
  );
}


ethers
