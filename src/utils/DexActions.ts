import { getContractWithSigner } from "./contractHelpers";
import {ethers} from "ethers";

export const swapTokens = async (dexAddress: string, amount: string, direction: "AtoB" | "BtoA") => {
  const contract = await getContractWithSigner(dexAddress, import.meta.env.VITE_SIMPLE_DEX_ABI_URL!);

  const tx =
    direction === "AtoB"
      ? await contract.swapAtoB(ethers.parseUnits(amount, 18))
      : await contract.swapBtoA(ethers.parseUnits(amount, 18));

  await tx.wait();
  console.log(`Intercambio completado: ${amount} tokens en dirección ${direction}`);
};
