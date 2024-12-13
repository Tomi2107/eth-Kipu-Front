const { ethers } = require("ethers");
const TokenBABI = require("./../abis/Token.json"); // Asegúrate de tener el ABI correcto

// Configuración inicial
const provider = "https://scroll-sepolia.g.alchemy.com/v2/-Om5pWvbQTGynmGJHrCUkiXa-ES1ZVuW";
const signer = provider.getSigner();
const tokenB = "0xcafca52de7bcb96ff0b0995af6532e774ab2f6e1"; // Reemplaza con la dirección del contrato TokenA
const tokenAContract = new ethers.Contract(tokenB, TokenBABI, signer);

// Función para aprobar transferencias
async function approve(spender, amount) {
  try {
    const tx = await tokenAContract.approve(spender, ethers.parseUnits(amount, 18));
    console.log("Transacción enviada", tx.hash);
    await tx.wait();
    console.log("Transacción confirmada");
  } catch (error) {
    console.error("Error al aprobar", error);
    throw error;
  }
}

// Función para consultar saldo
async function getBalance(address) {
  try {
    const balance = await tokenAContract.balanceOf(address);
    return ethers.utils.formatUnits(balance, 18);
  } catch (error) {
    console.error("Error al obtener el saldo", error);
    throw error;
  }
}

// Función para transferir tokens
async function transfer(recipient, amount) {
  try {
    const tx = await tokenAContract.transfer(recipient, ethers.parseUnits(amount, 18));
    console.log("Transacción enviada", tx.hash);
    await tx.wait();
    console.log("Transferencia exitosa");
  } catch (error) {
    console.error("Error al transferir", error);
    throw error;
  }
}

// Función para transferir tokens desde una dirección autorizada
async function transferFrom(from, to, amount) {
  try {
    const tx = await tokenAContract.transferFrom(from, to, ethers.parseUnits(amount, 18));
    console.log("Transacción enviada", tx.hash);
    await tx.wait();
    console.log("Transferencia desde dirección autorizada exitosa");
  } catch (error) {
    console.error("Error en transferFrom", error);
    throw error;
  }
}

module.exports = {
  approve,
  getBalance,
  transfer,
  transferFrom,
};
