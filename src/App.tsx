import React, { useState } from 'react';
import { ethers } from "ethers";
import TokenForm from "./components/TokenForm";
import SimpleDexForm from "./components/SimpleDexForm";

import './../css/styles.css'
import './../css/index.css'

const App: React.FC = () => {
  // useEffect(() => {
  //     // Ejecutar la conexión del wallet al cargar la aplicación
  //     checkWalletConnection().then(() => {
  //         console.log('Wallet conectada.');
  //     }).catch((error: Error) => {
  //         console.error('Error al conectar el wallet:', error);
  //     });
  // }, []);
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false); // Estado para manejar la espera
  const [error, setError] = useState<string | null>(null);

  const handleConnectWallet = async () => {
    setIsConnecting(true); // Activar la espera

    try {
      if (!window.ethereum) throw new Error("Metamask no está instalado.");

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      setConnected(true);
      setError(null); // Limpiar cualquier error previo
    } catch (error) {
      console.error("Error al conectar la wallet:", error);
      setError("Error al conectar la billetera.");
    } finally {
      setIsConnecting(false); // Desactivar la espera
    }
  };

  const handleDisconnectWallet = () => {
    setConnected(false);
    setAccount(null);
  };

  const handleApprove = async (spender: string, amount: string) => {
    console.log(`Aprobando ${amount} tokens para ${spender}`);
    // Lógica para aprobar tokens (interacción con el contrato).
  };
  
  const handleCheckBalance = async (address: string): Promise<string> => {
    console.log(`Consultando balance de la dirección ${address}`);
    // Lógica para consultar balance (interacción con el contrato).
    return "1000"; // Ejemplo de saldo
  };
  
  const handleTransfer = async (recipient: string, amount: string) => {
    console.log(`Transfiriendo ${amount} tokens a ${recipient}`);
    // Lógica para transferir tokens (interacción con el contrato).
  };
  
  const handleTransferFrom = async (from: string, to: string, amount: string) => {
    console.log(`Transfiriendo ${amount} tokens desde ${from} hacia ${to}`);
    // Lógica para transferir tokens desde una dirección (interacción con el contrato).
  };

   const handleDexDeploy = (tokenA: string, tokenB: string) => {
     console.log("SimpleDEX Deployment Data:", { tokenA, tokenB });
     // Aquí puedes agregar la lógica para desplegar el contrato de SimpleDEX
   };
  
  const handleAddLiquidity = (amountA: number, amountB: number) => {
    console.log(`Adding liquidity: ${amountA} TokenA and ${amountB} TokenB.`);
    // Lógica para agregar liquidez.
  };
  
  const handleRemoveLiquidity = (amountA: number, amountB: number) => {
    console.log(`Removing liquidity: ${amountA} TokenA and ${amountB} TokenB.`);
    // Lógica para remover liquidez.
  };
  
  const handleSwap = (amount: number, direction: string) => {
    console.log(`Swapping ${amount} tokens in direction: ${direction}.`);
    // Lógica para realizar el swap.
  };
  return (
    <div className="bg-gray-100 font-sans min-h-screen p-6">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Intro to Ethers</h1>

        <div className="text-center">
          {!connected ? (
            <button
              onClick={handleConnectWallet}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
              disabled={isConnecting} // Deshabilitar el botón mientras se conecta
            >
              {isConnecting ? "Buscando billetera..." : "Conectar wallet"}
            </button>
          ) : (
            <button
              onClick={handleDisconnectWallet}
              className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition"
            >
              Desconectar
            </button>
          )}
        </div>

        {isConnecting && (
          <p className="text-center text-gray-600 mt-4">
            Esperando conexión con la billetera...
          </p>
        )}

        {error && (
          <p className="text-center text-red-500 mt-4">{error}</p>
        )}

        <p className="text-center text-gray-600 mt-4">
          Estado: {connected ? `Conectado: ${account}` : "Desconectado"}
        </p>

        {connected && (
          <>
            <h2 className="text-xl font-semibold text-gray-700 mt-8">SimpleDEX Manager</h2>
            <TokenForm onSubmit={handleApprove}
            title="token A"
            approveTitle="Aprobar Tokens"
            balanceTitle="Consultar Balance"
            transferTitle="Transferir Tokens"
            transferFromTitle="Transferencia Desde"
            onApprove={handleApprove}
            onCheckBalance={handleCheckBalance}
            onTransfer={handleTransfer}
            onTransferFrom={handleTransferFrom}
            />
            <TokenForm onSubmit={handleApprove}
            title="token B"
            approveTitle="Aprobar Tokens"
            balanceTitle="Consultar Balance"
            transferTitle="Transferir Tokens"
            transferFromTitle="Transferencia Desde" 
            onApprove={handleApprove}
            onCheckBalance={handleCheckBalance}
            onTransfer={handleTransfer}
            onTransferFrom={handleTransferFrom}
            />
            <SimpleDexForm 
            onDexDeploy={handleDexDeploy}
            onAddLiquidity={handleAddLiquidity}
            onRemoveLiquidity={handleRemoveLiquidity}
            onSwap={handleSwap}
             /> 
          </>
        )}
      </div>
    </div>
  );
};


export default App
