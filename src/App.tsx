import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import TokenForm from "./components/TokenForm";
import SimpleDexForm from "./components/SimpleDexForm";

import { approveTokens, checkBalance } from "./../src/utils/tokenActions"; 
import { swapTokens } from "./../src/utils/DexActions"
import {config} from "./../src/utils/config";
import { checkWalletConnection } from "./../src/utils/checkWalletConnection";

import './../css/styles.css'
import './../css/index.css'

const App: React.FC = () => {
  useEffect(() => {
    // Ejecutar la conexión del wallet al cargar la aplicación
    checkWalletConnection()
      .then((account: any) => {
        console.log("Wallet conectada. Cuenta:", account);
      })
      .catch((error: Error) => {
        console.error("Error al conectar el wallet:", error);
      });
  }, []);
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

  const handleApprove = async () => {
    try {
      await approveTokens(config.tokenAAddress, config.simpleDEXAddress, "1000");
      console.log("Tokens aprobados exitosamente.");
    } catch (error) {
      console.error("Error al aprobar tokens:", error);
    }
  };

  const handleCheckBalance = async () => {
    try {
      const balance = await checkBalance(config.tokenAAddress, account!);
      console.log("Balance:", balance);
    } catch (error) {
      console.error("Error al consultar balance:", error);
    }
  };

  const handleTransfer = async (recipient: string, amount: string) => {
    try {
      console.log(`Transfiriendo ${amount} tokens a ${recipient}`);
      // Aquí agregas la lógica de transferencia con interacción al contrato
    } catch (error) {
      console.error("Error al transferir tokens:", error);
    }
  };

  const handleTransferFrom = async (from: string, to: string, amount: string) => {
    try {
      console.log(`Transfiriendo ${amount} tokens desde ${from} hacia ${to}`);
      // Aquí agregas la lógica de transferencia con interacción al contrato
    } catch (error) {
      console.error("Error en transferencia desde otra dirección:", error);
    }
  };

  const handleDexDeploy = async (tokenA: string, tokenB: string) => {
    try {
      console.log("Desplegando SimpleDEX con:", { tokenA, tokenB });
      // Lógica de despliegue del contrato SimpleDEX
    } catch (error) {
      console.error("Error al desplegar SimpleDEX:", error);
    }
  };

  const handleAddLiquidity = async (amountA: number, amountB: number) => {
    try {
      console.log(`Agregando liquidez: ${amountA} TokenA y ${amountB} TokenB`);
      // Lógica para agregar liquidez al contrato
    } catch (error) {
      console.error("Error al agregar liquidez:", error);
    }
  };

  const handleRemoveLiquidity = async (amountA: number, amountB: number) => {
    try {
      console.log(`Removiendo liquidez: ${amountA} TokenA y ${amountB} TokenB`);
      // Lógica para remover liquidez del contrato
    } catch (error) {
      console.error("Error al remover liquidez:", error);
    }
  };

  const handleSwap = async () => {
    try {
      await swapTokens(config.simpleDEXAddress, "10", "AtoB");
      console.log("Tokens swapeados exitosamente.");
    } catch (error) {
      console.error("Error al hacer swap de tokens:", error);
    }
  };

  return (
    <div className="bg-gray-100 font-sans min-h-screen p-6">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Intro to Ethers
        </h1>

        <div className="text-center">
          {!connected ? (
            <button
              onClick={handleConnectWallet}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
              disabled={isConnecting}
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

        {error && <p className="text-center text-red-500 mt-4">{error}</p>}

        <p className="text-center text-gray-600 mt-4">
          Estado: {connected ? `Conectado: ${account}` : "Desconectado"}
        </p>

        {connected && (
          <>
            <h2 className="text-xl font-semibold text-gray-700 mt-8">
              SimpleDEX Manager
            </h2>
            <TokenForm
              title="Token A"
              approveTitle="Aprobar Tokens"
              balanceTitle="Consultar Balance"
              transferTitle="Transferir Tokens"
              transferFromTitle="Transferencia Desde"
              onApprove={handleApprove}
              onCheckBalance={handleCheckBalance}
              onTransfer={handleTransfer}
              onTransferFrom={handleTransferFrom}
              onSubmit={(action) => console.log("Acción realizada:", action)}
              tokenActions={[]}
            
            />
            <TokenForm
              title="Token B"
              approveTitle="Aprobar Tokens"
              balanceTitle="Consultar Balance"
              transferTitle="Transferir Tokens"
              transferFromTitle="Transferencia Desde"
              onApprove={handleApprove}
              onCheckBalance={handleCheckBalance}
              onTransfer={handleTransfer}
              onTransferFrom={handleTransferFrom}
              onSubmit={(action) => console.log("Acción realizada:", action)}
              tokenActions={[]}
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
