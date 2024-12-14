import { ethers } from "ethers";

export const checkBalance = async (tokenAddress: string, userAddress: string) => {
    const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_REACT_APP_PROVIDER_URL);
    const abi = ["function balanceOf(address account) view returns (uint256)"];
    const contract = new ethers.Contract(tokenAddress, abi, provider);
    const balance = await contract.balanceOf(userAddress);
    return ethers.formatUnits(balance, 18); // Ajustar decimales
  };
  