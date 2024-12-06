import { useState } from "react";
import { ethers } from "ethers";
import TokenForm from "./components/TokenForm";
import SimpleDexForm from "./components/SimpleDexForm";

const App = () => {
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

  const handleTokenSubmit = (tokenAddress: string, ownerAddress: string, amount: string) => {
    console.log("Token Form Data:", { tokenAddress, ownerAddress, amount });
    // Aquí puedes agregar la lógica para interactuar con el contrato de token
  };

  const handleDexDeploy = (tokenA: string, tokenB: string) => {
    console.log("SimpleDEX Deployment Data:", { tokenA, tokenB });
    // Aquí puedes agregar la lógica para desplegar el contrato de SimpleDEX
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
            <TokenForm title="Token A" onSubmit={handleTokenSubmit} />
            <TokenForm title="Token B" onSubmit={handleTokenSubmit} />
            <SimpleDexForm onDeploy={handleDexDeploy} />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
