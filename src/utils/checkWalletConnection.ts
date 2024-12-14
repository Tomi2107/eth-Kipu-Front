import { ethers } from "ethers";

export const checkWalletConnection = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask no está instalada.");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const accounts = await provider.send("eth_requestAccounts", []);
  console.log("Wallet conectada. Cuenta:", accounts[0]);
  return accounts[0]; // Retorna la cuenta conectada
};
