import React, { useState, useEffect, useRef } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { Connection, PublicKey } from "@solana/web3.js";

const Coinflip = () => {
  const { account, library } = useWeb3React();
  const [result, setResult] = useState(null);
  const [betAmount, setBetAmount] = useState("");
  const [selectedSide, setSelectedSide] = useState("heads");
  const [balance, setBalance] = useState("0");
  const [selectedToken, setSelectedToken] = useState("ETH");
  const [flipping, setFlipping] = useState(false);
  const coinRef = useRef(null);

  useEffect(() => {
    if (library && account) {
      getBalance();
    }
  }, [library, account, selectedToken]);

  const getBalance = async () => {
    if (selectedToken === "ETH") {
      const balance = await library.getBalance(account);
      setBalance(ethers.utils.formatEther(balance));
    } else if (selectedToken === "SOL") {
      const solConnection = new Connection(
        "https://api.devnet.solana.com",
        "confirmed"
      );
      const balance = await solConnection.getBalance(new PublicKey(account));
      setBalance((balance / 1e9).toFixed(2)); // Convert from lamports to SOL
    } else if (selectedToken === "BTC") {
      setBalance("BTC balance retrieval is not implemented.");
    }
  };

  const flipCoin = async () => {
    if (flipping) return;
    setFlipping(true);
    if (coinRef.current) {
      coinRef.current.style.transition = "transform 2s";
      coinRef.current.style.transform = "rotateY(3600deg)";
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for the animation to complete

      const outcome = Math.random() < 0.5 ? "heads" : "tails";
      setResult(outcome);

      if (selectedToken === "ETH") {
        const betInWei = ethers.utils.parseEther(betAmount);
        if (outcome === selectedSide) {
          const transaction = await library.getSigner().sendTransaction({
            to: account,
            value: betInWei.mul(2),
          });
          await transaction.wait();
          alert("You won! Double your bet has been sent to your wallet.");
        } else {
          alert("You lost! Better luck next time.");
        }
      } else if (selectedToken === "SOL") {
        // SOL transaction logic here
        alert("SOL transactions are not implemented in this example.");
      } else if (selectedToken === "BTC") {
        // BTC transaction logic here
        alert("BTC transactions are not implemented in this example.");
      }

      getBalance(); // Update balance after the game
    } catch (error) {
      console.error(error);
      alert("Transaction failed");
    } finally {
      if (coinRef.current) {
        coinRef.current.style.transition = "none";
        coinRef.current.style.transform = "none";
      }
      setFlipping(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Coinflip Game</h1>
        <div className="mb-4">
          <label className="block text-lg mb-2">Select Token</label>
          <select
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            className="w-full p-2 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ETH">ETH</option>
            <option value="SOL">SOL</option>
            <option value="BTC">BTC</option>
          </select>
        </div>
        <div className="balance-info mb-4">
          <p className="text-xl font-semibold">
            Your Balance: {balance} {selectedToken}
          </p>
        </div>
        <div className="bet-amount mb-4">
          <label className="block text-lg mb-2">Bet Amount</label>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            placeholder={`Enter amount in ${selectedToken}`}
            className="w-full p-2 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="select-side mb-6">
          <label className="block text-lg mb-2">Select Side</label>
          <select
            value={selectedSide}
            onChange={(e) => setSelectedSide(e.target.value)}
            className="w-full p-2 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="heads">Heads</option>
            <option value="tails">Tails</option>
          </select>
        </div>
        <button
          onClick={flipCoin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-lg transition duration-300"
        >
          Flip Coin
        </button>
        <div className="mt-6">
          <img
            ref={coinRef}
            src={`/${result || "heads"}.png`}
            alt="Coin"
            className={`w-32 h-32 mx-auto ${flipping ? "flipping" : ""}`}
          />
        </div>
        {result && (
          <p className="text-center text-lg mt-4">{`You got ${result}!`}</p>
        )}
      </div>
    </div>
  );
};

export default Coinflip;
