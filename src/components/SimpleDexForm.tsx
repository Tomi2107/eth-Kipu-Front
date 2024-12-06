import React, { useState } from "react";

interface SimpleDexFormProps {
  onDeploy: (tokenA: string, tokenB: string) => void;
}

const SimpleDexForm: React.FC<SimpleDexFormProps> = ({ onDeploy }) => {
  const [tokenA, setTokenA] = useState("");
  const [tokenB, setTokenB] = useState("");

  const handleDexDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    onDeploy(tokenA, tokenB);
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-700">Deploy SimpleDEX</h3>
      <form onSubmit={handleDexDeploy} className="space-y-4">
        <input
          type="text"
          placeholder="Token A Address"
          value={tokenA}
          onChange={(e) => setTokenA(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Token B Address"
          value={tokenB}
          onChange={(e) => setTokenB(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded-md"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition"
        >
          Deploy
        </button>
      </form>
    </div>
  );
};

export default SimpleDexForm;
