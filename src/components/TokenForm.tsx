import React, { useState } from "react";

interface TokenFormProps {
  title: string;
  onSubmit: (tokenAddress: string, ownerAddress: string, amount: string) => void;
}

const TokenForm: React.FC<TokenFormProps> = ({ title, onSubmit }) => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");
  const [amount, setAmount] = useState("");

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(tokenAddress, ownerAddress, amount);
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <form onSubmit={handleTokenSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Token Address"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Owner Address"
          value={ownerAddress}
          onChange={(e) => setOwnerAddress(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default TokenForm;
