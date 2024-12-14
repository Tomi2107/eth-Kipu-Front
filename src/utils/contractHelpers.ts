import { ethers } from "ethers";
import { config } from "./config";
import { loadABI } from "./abiLoader";

export const getProvider = () => new ethers.JsonRpcProvider(config.providerUrl);

export const getSigner = () => {
  const provider = getProvider();
  return new ethers.Wallet(config.privateKey, provider);
};

export const getContract = async (address: string, abiUrl: string) => {
  const abi = await loadABI(abiUrl);
  const provider = getProvider();
  return new ethers.Contract(address, abi, provider);
};

export const getContractWithSigner = async (address: string, abiUrl: string) => {
  const abi = await loadABI(abiUrl);
  const signer = getSigner();
  return new ethers.Contract(address, abi, signer);
};
