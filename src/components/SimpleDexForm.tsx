import React, { useState } from "react";
import { ethers } from "ethers";

interface SimpleDexFormProps {
  onDexDeploy: (tokenA: string, tokenB: string) => void;
  onAddLiquidity: (amountA: number, amountB: number) => void;
  onRemoveLiquidity: (amountA: number, amountB: number) => void;
  onSwap: (amount: number, direction: string) => void;
}

const SimpleDexForm: React.FC<SimpleDexFormProps> = ({
  onDexDeploy,
  onAddLiquidity,
  onRemoveLiquidity,
  onSwap,
}) => {

//const simpleDEX = "0x8388c1d78ec692cc4555f9367ff42f17084e79a3";

//let signer, address, tokenAContract, tokenBContract, simpleDEXContract;
//let provider;

//const providerURL = "https://scroll-sepolia.g.alchemy.com/v2/-Om5pWvbQTGynmGJHrCUkiXa-ES1ZVuW";

  const tokenA = "0xbbbdec7784e51c80a6b86e80f6e8f7a313460906";
  const tokenB ="0xcafca52de7bcb96ff0b0995af6532e774ab2f6e1";    
  const [amountA, setAmountA] = useState<number>(0);
  const [amountB, setAmountB] = useState<number>(0);
  const [swapAmount, setSwapAmount] = useState<number>(0);
  const [swapDirection, setSwapDirection] = useState<string>("swapAforB");

  //const alchemyUrl = '<https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_PROJECT_ID>';

// Crear un proveedor usando la URL de Alchemy
  //const provider = new ethers.JsonRpcProvider(alchemyUrl);


  const handleDexDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    onDexDeploy(tokenA, tokenB);
  };

  const handleAddLiquidity = (e: React.FormEvent) => {
    e.preventDefault();
    onAddLiquidity(amountA, amountB);
  };

  const handleRemoveLiquidity = (e: React.FormEvent) => {
    e.preventDefault();
    onRemoveLiquidity(amountA, amountB);
  };

  const handleSwap = (e: React.FormEvent) => {
    e.preventDefault();
    onSwap(swapAmount, swapDirection);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Deploy Section */}
      <div className="p-4 border rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">
          Configurar SimpleDEX
        </h2>
        <form onSubmit={handleDexDeploy}>
          <label htmlFor="onDexDeploy"  className="block text-gray-600 mt-4">Dirección TokenA:</label>
          <input
            id="onDexDeploy"
            type="text"
            value={tokenA}
            readOnly
            className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="onDexDeploy" className="block text-gray-600 mt-4">Dirección TokenB:</label>
          <input
            id="onDexDeploy"
            type="text"
            value={tokenB}
            readOnly
            className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition mt-4"
          >
            Configurar SimpleDEX
          </button>
        </form>
      </div>

      {/* Add Liquidity Section */}
      <div className="p-4 border rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">
          Agregar Liquidez
        </h2>
        <form onSubmit={handleAddLiquidity}>
          <label htmlFor="CantTokA" className="block text-gray-700 mt-4">Cantidad TokenA:</label>
          <input
          id="CanTokA"
            type="number"
            value={amountA}
            onChange={(e) => setAmountA(Number(e.target.value))}
            required
            className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="CanTokB" className="block text-gray-700 mt-4">Cantidad TokenB:</label>
          <input
             id="CanTokB"
            type="number"
            value={amountB}
            onChange={(e) => setAmountB(Number(e.target.value))}
            required
            className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-400 text-white px-6 py-2 rounded-md hover:bg-blue-500 transition mt-4"
          >
            Agregar Liquidez
          </button>
        </form>
      </div>

      {/* Remove Liquidity Section */}
      <div className="p-4 border rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">
          Remover Liquidez
        </h2>
        <form onSubmit={handleRemoveLiquidity}>
          <label htmlFor="CantTokA" className="block text-gray-700 mt-4">Cantidad TokenA:</label>
          <input
            id="CantTokA"
            type="number"
            value={amountA}
            onChange={(e) => setAmountA(Number(e.target.value))}
            required
            className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="CantTokB" className="block text-gray-700 mt-4">Cantidad TokenB:</label>
          <input
            id="CantTokB"
            type="number"
            value={amountB}
            onChange={(e) => setAmountB(Number(e.target.value))}
            required
            className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-400 text-white px-6 py-2 rounded-md hover:bg-blue-500 transition mt-4"
          >
            Remover Liquidez
          </button>
        </form>
      </div>

      {/* Swap Section */}
      <div className="p-4 border rounded-md shadow-md">
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">
          Intercambiar Tokens
        </h2>
        <form onSubmit={handleSwap}>
          <label htmlFor="Cant" className="block text-gray-700 mt-4">Cantidad:</label>
          <input
            id="Cant"
            type="number"
            value={swapAmount}
            onChange={(e) => setSwapAmount(Number(e.target.value))}
            required
            className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="DirInter" className="block text-gray-700 mt-4">
            Dirección del Intercambio:
          </label>
          <select
            id="DirInter"
            value={swapDirection}
            onChange={(e) => setSwapDirection(e.target.value)}
            required
            className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="swapAforB">Token A → Token B</option>
            <option value="swapBforA">Token B → Token A</option>
          </select>
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition mt-4"
          >
            Realizar Intercambio
          </button>
        </form>
      </div>
    </div>
  );
};

export default SimpleDexForm;
// simpleDEX_corr.cjs

