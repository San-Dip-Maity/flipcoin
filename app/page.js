"use client";
import React, { useState } from "react";

import WalletConnector from "./components/WalletConnector";
import Coinflip from "./components/Coinflip";
import { Web3ReactProvider } from "@web3-react/core";

export default function Home() {
  const [connected, setConnected] = useState(false);

  return (
    <Web3ReactProvider>
      <div className="container mx-auto">
        {!connected ? (
          <WalletConnector onConnect={() => setConnected(true)} />
        ) : (
          <Coinflip />
        )}
      </div>
    </Web3ReactProvider>
  );
}
