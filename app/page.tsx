"use client";

import { useState, useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import { FaWallet, FaEthereum } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";

// --- Types ---
interface NFTMetadata {
  name: string;
  image: string;
  description: string;
  attributes: Array<{ trait_type: string; value: string }>;
}

interface Token {
  tokenId: string;
  metadata: NFTMetadata;
}

// --- Constants ---
const CONTRACT_ADDRESS = "0x26f8Ea024E79850D2b0aB28c176eB00655671776"; 

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();

  const [nfts, setNfts] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTs = async () => {
    if (!isConnected || !address) {
      setError("Wallet not connected.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setNfts([]);

    try {
      // 1. Fetch Token IDs
      const ownedTokensResponse = await fetch(
        `/api/getOwnedTokens?address=${address.toLowerCase()}`
      );

      if (!ownedTokensResponse.ok) {
        throw new Error(
          `Failed to fetch token IDs: ${ownedTokensResponse.statusText}`
        );
      }

      const tokenIds: string[] = (await ownedTokensResponse.json()) || [];

      if (tokenIds.length === 0) {
        setNfts([]);
        setIsLoading(false);
        return;
      }

      // 2. Fetch Metadata
      const metadataPromises = tokenIds.map(async (tokenId) => {
        const metadataResponse = await fetch(
          `/api/getNFTMetadata?contractAddress=${CONTRACT_ADDRESS}&tokenId=${tokenId}`
        );

        if (!metadataResponse.ok) {
          console.error(`Failed to fetch metadata for Token ID ${tokenId}`);
          return null;
        }

        const metadata: NFTMetadata = await metadataResponse.json();

        if (!metadata?.name || !metadata?.image) {
            return null;
        }

        return {
          tokenId,
          metadata,
        } as Token;
      });

      const results = await Promise.all(metadataPromises);
      const validNFTs = results.filter((nft): nft is Token => nft !== null);
      
      setNfts(validNFTs);
    } catch (err) {
      console.error("Error fetching NFTs:", err);
      setError("An error occurred while loading your NFTs.");
      setNfts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      fetchNFTs();
    } else {
        setNfts([]);
        setError(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address]);

  const handleConnectWallet = () => {
    // In Wagmi v2, we grab the first available connector (usually injected/metamask)
    const connector = connectors[0];
    if (connector) {
        connect({ connector });
    } else {
        alert("No wallet connector found. Please install MetaMask.");
    }
  };

  // --- Rendering Logic ---

  const renderWalletButton = () => {
    if (isConnected && address) {
      const shortAddress = `${address.substring(0, 6)}...${address.substring(
        address.length - 4
      )}`;
      return (
        <div className="flex items-center space-x-2 p-3 bg-gray-700 rounded-xl border border-gray-600">
          <FaWallet className="text-indigo-400" />
          <span className="text-sm font-mono text-white">{shortAddress}</span>
        </div>
      );
    }
    return (
      <button
        onClick={handleConnectWallet}
        className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-lg"
      >
        <FaWallet className="mr-2" />
        Connect Wallet
      </button>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center text-white text-xl p-10">
          <FiRefreshCw className="animate-spin mx-auto h-10 w-10 text-indigo-400 mb-3" />
          Loading your W3B4PPs...
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg border border-red-700">
          Error: {error}
        </div>
      );
    }

    if (nfts.length === 0) {
      if (!isConnected) {
        return (
          <div className="text-center text-gray-400 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <FaWallet className="mx-auto h-10 w-10 mb-3 text-gray-500" />
            <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
            <p>Connect your wallet to view your unique W3B4PP NFTs.</p>
          </div>
        );
      }
      return (
        <div className="text-center text-gray-400 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
          <FaEthereum className="mx-auto h-10 w-10 mb-3 text-gray-500" />
          <h3 className="text-xl font-semibold mb-2">No NFTs Found</h3>
          <p>It looks like you don't own any W3B4PPs at this address.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {nfts.map((token) => (
          <NFTCard key={token.tokenId} token={token} />
        ))}
      </div>
    );
  };

  return (
    <main className="min-h-screen p-4 sm:p-8 bg-gray-900 flex flex-col items-center">
      <header className="w-full max-w-6xl flex justify-between items-center mb-10 p-4 bg-gray-800 rounded-2xl shadow-xl">
        <div className="text-3xl font-extrabold text-white tracking-tighter">
          W3B4PP <span className="text-indigo-400">OWNER</span>
        </div>
        <div className="flex items-center space-x-4">
          {isConnected && address && (
            <button
              onClick={fetchNFTs}
              disabled={isLoading}
              className={`p-2 rounded-full transition ${
                isLoading
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-gray-700 hover:bg-gray-600 text-white"
              }`}
            >
              <FiRefreshCw className={isLoading ? "animate-spin" : ""} />
            </button>
          )}
          {renderWalletButton()}
        </div>
      </header>

      <section className="w-full max-w-6xl">
        <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-2">
          Your Collection ({nfts.length})
        </h2>
        {renderContent()}
      </section>
    </main>
  );
}

// --- NFT Card Component ---
interface NFTCardProps {
  token: Token;
}

const NFTCard: React.FC<NFTCardProps> = ({ token }) => {
  const { name, image, attributes } = token.metadata;
  const imageUrl = image || "/placeholder.png"; 

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 transition duration-300 hover:shadow-indigo-500/30 hover:scale-[1.02] flex flex-col h-full">
      <div className="relative pt-[100%] bg-gray-700">
        <img
          src={imageUrl}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
        />
        <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            #{token.tokenId}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-white mb-1 truncate">{name}</h3>
        <div className="mt-auto">
            {attributes?.slice(0, 3).map((attr, index) => (
                <div key={index} className="text-xs text-gray-400 flex justify-between py-0.5 border-t border-gray-700 last:border-b-0">
                    <span className="font-medium text-gray-300">{attr.trait_type}:</span>
                    <span className="font-mono">{attr.value}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
