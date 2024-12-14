
export const config = {
    privateKey: import.meta.env.VITE_PRIVATE_KEY || "",
    providerUrl: import.meta.env.VITE_PROVIDER_URL || "",
    tokenAAddress: import.meta.env.VITE_TOKEN_A_ADDRESS || "",
    tokenBAddress: import.meta.env.VITE_TOKEN_B_ADDRESS || "",
    simpleDEXAddress: import.meta.env.VITE_SIMPLE_DEX_ADDRESS || "",
    tokenAABIUrl: import.meta.env.VITE_TOKEN_A_ABI_URL || "",
    tokenBABIUrl: import.meta.env.VITE_TOKEN_B_ABI_URL || "",
    simpleDEXABIUrl: import.meta.env.VITE_SIMPLE_DEX_ABI_URL || "",
  };
  