import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";

const WalletConnector = ({ onConnect }) => {
  const { activate, active } = useWeb3React();

  const connectWallet = () => {
    const injected = new InjectedConnector({
      supportedChainIds: [1, 3, 4, 5, 42],
    });
    activate(injected);
    onConnect();
  };

  return (
    <button onClick={connectWallet} className="btn-primary">
      Connect Wallet
    </button>
  );
};

export default WalletConnector;
