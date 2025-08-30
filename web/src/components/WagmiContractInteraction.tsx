"use client";

import { useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { Button } from "./ui/button";
import contractABI from "../MyContractABI.json";

const CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export default function WagmiContractInteraction() {
  const [newText, setNewText] = useState<string>("");

  // Wagmi hooks - so much simpler!
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  // Read contract data (automatically updates)
  const { data: currentText, refetch: refetchText } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: "getText",
  });

  // Write contract data
  const {
    data: hash,
    writeContract,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract();

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Handle wallet connection
  const handleConnect = () => {
    const injectedConnector = connectors.find(
      (connector) => connector.id === "injected"
    );
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  };

  // Handle text update
  const handleSetText = () => {
    if (!newText.trim()) {
      alert("Please enter some text");
      return;
    }

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: contractABI,
      functionName: "setText",
      args: [newText.trim()],
    });
  };

  // Reset form after successful transaction
  if (isSuccess) {
    setTimeout(() => {
      refetchText();
      setNewText("");
    }, 1000);
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Smart Contract</h1>

      {/* Wallet Connection - Much simpler! */}
      <div className="border rounded-lg p-4 space-y-4">
        <h2 className="text-xl font-semibold">Wallet Connection</h2>
        {!isConnected ? (
          <Button onClick={handleConnect} className="w-full">
            Connect Wallet
          </Button>
        ) : (
          <div className="space-y-2">
            <p className="text-green-600">✅ Connected</p>
            <p className="text-sm text-gray-600 break-all">
              Account: {address}
            </p>
            <Button onClick={() => disconnect()} variant="outline" size="sm">
              Disconnect
            </Button>
          </div>
        )}
      </div>

      {/* Contract Interaction */}
      <div className="border rounded-lg p-4 space-y-4">
        <h2 className="text-xl font-semibold">Contract Interaction</h2>

        {/* Read Text - Automatically loads! */}
        <div className="space-y-2">
          <h3 className="font-medium">Current Text:</h3>
          {currentText ? (
            <div className="p-3 bg-gray-100 rounded-md">
              <p className="text-gray-700">{String(currentText)}</p>
            </div>
          ) : (
            <p className="text-gray-500">Loading...</p>
          )}
          <Button onClick={() => refetchText()} variant="outline" size="sm">
            Refresh
          </Button>
        </div>

        {/* Write Text */}
        <div className="space-y-2">
          <label htmlFor="newText" className="block text-sm font-medium">
            Update Text:
          </label>
          <div className="flex space-x-2">
            <input
              id="newText"
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Enter new text..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={handleSetText}
              disabled={!isConnected || isWritePending || isConfirming}
            >
              {isWritePending
                ? "Preparing..."
                : isConfirming
                ? "Confirming..."
                : "Update Text"}
            </Button>
          </div>

          {/* Transaction status */}
          {hash && (
            <div className="text-xs space-y-1">
              <p>
                Transaction Hash:{" "}
                <code className="bg-gray-100 px-1 rounded">{hash}</code>
              </p>
              {isConfirming && (
                <p className="text-yellow-600">
                  ⏳ Waiting for confirmation...
                </p>
              )}
              {isSuccess && (
                <p className="text-green-600">✅ Transaction confirmed!</p>
              )}
            </div>
          )}

          {/* Error handling */}
          {writeError && (
            <p className="text-red-600 text-sm">Error: {writeError.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
