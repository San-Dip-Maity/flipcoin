import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";
import { useState } from "react";

const WalletConnector = ({ onConnect }) => {
  const { activate, active } = useWeb3React();
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    setLoading(true);
    const injected = new InjectedConnector({
      supportedChainIds: [1, 3, 4, 5, 42],
    });
    try {
      await activate(injected);
      onConnect();
    } catch (error) {
      console.error("Connection failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center bg-gradient-to-r from-purple-500 to-blue-500 py-8">
        <h1 className="text-5xl font-bold">Welcome to CryptoFlip!</h1>
      </div>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-500 to-blue-500">
        <div className="p-8 bg-white rounded-lg shadow-lg transform transition-transform duration-500 hover:scale-105">
          <h1 className="text-2xl font-bold text-center text-fuchsia-800 mb-6">
            Connect Your Wallet
          </h1>
          <button
            onClick={connectWallet}
            className={`w-full py-2 px-4 text-white font-semibold rounded-lg transition-colors duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
        </div>
      </div>
    </>
  );
};

export default WalletConnector;
