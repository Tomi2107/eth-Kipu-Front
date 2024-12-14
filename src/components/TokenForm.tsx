import { useState } from "react";
import { ethers } from "ethers";

interface TokenAction {
  action: string; // Tipo de acción: "approve", "transfer", etc.
  spender?: string;
  recipient?: string;
  from?: string;
  to?: string;
  amount?: string;
  address?: string;
};

interface TokenFormProps {
  title: string;
  approveTitle: string;
  balanceTitle: string;
  transferTitle: string;
  transferFromTitle: string;
  onApprove: (spender: string, amount: string) => Promise<void>;
  onCheckBalance: (address: string) => Promise<void>;
  onTransfer: (recipient: string, amount: string) => Promise<void>;
  onTransferFrom: (from: string, to: string, amount: string) => Promise<void>;
  onSubmit: (tokenActions: TokenAction) => void; // Permitir múltiples argumentos
  tokenActions: TokenAction[];
};

const TokenForm: React.FC<TokenFormProps> = ({
  title,
  approveTitle,
  balanceTitle,
  transferTitle,
  transferFromTitle,
  onApprove,
  onCheckBalance,
  onTransfer,
  onTransferFrom,
  onSubmit, // Agregado
}) => {
  const [spender, setSpender] = useState("");
  const [approveAmount, setApproveAmount] = useState("");
  const [balanceAddress, setBalanceAddress] = useState("");
  const [transferRecipient, setTransferRecipient] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [transferFromAmount, setTransferFromAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const isValidAddress = (address: string) => ethers.isAddress(address);

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ action: "approve", spender, amount: approveAmount });
    if (!isValidAddress(spender)) {
      setMessage("Dirección no válida");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await onApprove(spender, approveAmount);
      setMessage("Aprobación exitosa");
    } catch (error) {
      setMessage("Error al aprobar");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ action: "checkBalance", address: balanceAddress });
    if (!isValidAddress(balanceAddress)) {
      setMessage("Dirección no válida");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const balance = await onCheckBalance(balanceAddress);
      setMessage(`Saldo: ${balance}`);
    } catch (error) {
      setMessage("Error al consultar saldo");
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ action: "transfer", recipient: transferRecipient, amount: transferAmount });
    if (!isValidAddress(transferRecipient)) {
      setMessage("Dirección no válida");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await onTransfer(transferRecipient, transferAmount);
      setMessage("Transferencia exitosa");
    } catch (error) {
      setMessage("Error al transferir");
    } finally {
      setLoading(false);
    }
  };

  const handleTransferFrom = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ action: "transferFrom", from: fromAddress, to: toAddress, amount: transferFromAmount });
    if (!isValidAddress(fromAddress) || !isValidAddress(toAddress)) {
      setMessage("Dirección no válida");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await onTransferFrom(fromAddress, toAddress, transferFromAmount);
      setMessage("Transferencia desde otra dirección exitosa");
    } catch (error) {
      setMessage("Error al transferir desde otra dirección");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">{title}</h1>
      </header>
      <main>
        {message && (
          <p className="text-center text-red-500 font-semibold mb-4">{message}</p>
        )}
        {/* Aprobar transferencia */}
        
        <section>
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">{approveTitle}</h2>
          <form onSubmit={handleApprove} className="mt-4">
            <input 
              type="text"
              placeholder="Dirección autorizada"
              value={spender}
              onChange={(e) => setSpender(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-blue-500"
              required
            />
            <input
              type="number"
              placeholder="Cantidad autorizada"
              value={approveAmount}
              onChange={(e) => setApproveAmount(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className={`bg-blue-500 text-white px-6 py-2 rounded-md mt-4 ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
              }`}
              disabled={loading}
            >
              Aprobar
            </button>
          </form>
        </section>

        {/* Consultar saldo */}
        <section>
          <h2 className="text-4xl font-bold text-center text-gray-600 mb-6">{balanceTitle}</h2>
          <form onSubmit={handleCheckBalance} className="mt-4">
            <input
              type="text"
              placeholder="Dirección de consulta"
              value={balanceAddress}
              onChange={(e) => setBalanceAddress(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className={`bg-blue-500 text-white px-6 py-2 rounded-md mt-4 ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
              }`}
              disabled={loading}
            >
              Consultar
            </button>
          </form>
        </section>

        {/* Transferir token */}
        <section>
          <h2 className="text-4xl font-bold text-center text-gray-600 mb-6">{transferTitle}</h2>
          <form onSubmit={handleTransfer} className="mt-4">
            <input
              type="text"
              placeholder="Dirección del destinatario"
              value={transferRecipient}
              onChange={(e) => setTransferRecipient(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-blue-500"
              required
            />
            <input
              type="number"
              placeholder="Cantidad a transferir"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className={`bg-blue-500 text-white px-6 py-2 rounded-md mt-4 ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
              }`}
              disabled={loading}
            >
              Transferir
            </button>
          </form>
        </section>
                        {/* Transferir en nombre de otra dirección */}
        <section>
        <h2 className="text-4xl font-bold text-center text-gray-600 mb-6">{transferFromTitle}</h2>
        <form onSubmit={handleTransferFrom} className="mt-4">
          <input
            type="text"
            placeholder="Dirección del emisor"
            value={fromAddress}
            onChange={(e) => setFromAddress(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Dirección del destinatario"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-blue-500"
            required
          />
          <input
            type="number"
            placeholder="Cantidad a transferir"
            value={transferFromAmount}
            onChange={(e) => setTransferFromAmount(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition mt-4"
          >
            Transferir
          </button>
        </form>
      </section>
    </main>
  </div>
)};

export default TokenForm;


