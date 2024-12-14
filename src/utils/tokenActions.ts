import { getContractWithSigner } from "./contractHelpers";
import { ethers } from "ethers";

export const approveTokens = async (
  tokenAddress: string,
  spenderAddress: string,
  amount: string,
  isBrowser: boolean = false // Bandera para diferenciar entorno backend o navegador
) => {
  let contract;

  if (isBrowser) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const abi = ["function approve(address spender, uint256 amount)"];
    contract = new ethers.Contract(tokenAddress, abi, signer);
  } else {
    contract = await getContractWithSigner(tokenAddress, import.meta.env.VITE_TOKEN_A_ABI_URL!);
  }

  const tx = await contract.approve(spenderAddress, ethers.parseUnits(amount, 18));
  await tx.wait();
  console.log(`Tokens aprobados: ${amount}`);
};

export const checkBalance = async (tokenAddress: string, userAddress: string) => {
  const contract = await getContractWithSigner(tokenAddress, import.meta.env.VITE_TOKEN_A_ABI_URL!);
  const balance = await contract.balanceOf(userAddress);
  return ethers.formatUnits(balance, 18);
};
