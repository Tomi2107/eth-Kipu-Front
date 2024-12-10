import { connectWallet, loadABI, updateAuthorizationStatus, ethers } from './scriptConectDisc.js';
import { updateReserves } from './scriptSimpleDEX_corr.js';

let tokenAContract;
let isTokenAInitialized = false;

// Verificar conexión con MetaMask
async function checkWalletConnection() {
  if (typeof window.ethereum === "undefined") {
    alert("MetaMask no está instalado.");
    return;
  }

  const savedAddress = localStorage.getItem("walletAddress");
  if (savedAddress) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    document.getElementById(
      "walletAddress"
    ).innerText = `Dirección: ${savedAddress}`;
    await loadABI();
    await updateAuthorizationStatus();
  }
};

// Inicializar TokenA
async function initializeTokenA() {
  if (isTokenAInitialized) {
    console.log("TokenA ya está inicializado.");
    return;
  }

  try {
    const tokenAAddress = "0xbbbdec7784e51c80a6b86e80f6e8f7a313460906"; // Reemplaza con la dirección real
    const tokenAABI = await fetch('https://gist.githubusercontent.com/Tomi2107/4dd8248426b0f2b79a369eddbab98d55/raw/492f918c85edf2a30b82faeaaa506650c300fd69/.json').then(res => res.json());

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    tokenAContract = new ethers.Contract(tokenAAddress, tokenAABI, signer);
    isTokenAInitialized = true;

    console.log("TokenA inicializado correctamente:", tokenAContract);
  } catch (error) {
    console.error("Error inicializando TokenA:", error);
    alert("Error inicializando TokenA.");
  }
};

// Manejar aprobación de tokens
async function handleApproveA(tokenAContract, spender, amount, resultElement) {
  try {
    if (!spender || !amount) throw new Error('Por favor, completa todos los campos.');
    if (!ethers.isAddress(spender)) throw new Error("Dirección no válida para 'spender'.");
    if (!tokenAContract) throw new Error("El contrato no está inicializado.");

    // Conversión de cantidad a formato Wei
    const parsedAmount = ethers.parseUnits(amount, 18);

    // Solicitar aprobación
    const tx = await tokenAContract.approve(spender, parsedAmount);
    console.log("Transacción enviada. Esperando confirmación...");
    await tx.wait();

    // Mostrar resultado exitoso
    resultElement.textContent = `Aprobación exitosa. Hash: ${tx.hash}`;
    resultElement.classList.add("text-green-500");
    resultElement.classList.remove("text-red-500");
  } catch (error) {
    console.error("Error en la aprobación:", error);

    // Mostrar error al usuario
    resultElement.textContent = `Error: ${error.message}`;
    resultElement.classList.add("text-red-500");
    resultElement.classList.remove("text-green-500");
  }
};

// Manejar transferencia de tokens
async function handleTransfer(tokenContract, fromAddress, toAddress, amount, resultElement) {
  try {
    if (!ethers.isAddress(fromAddress) || !ethers.isAddress(toAddress)) {
      throw new Error("Dirección no válida.");
    }

    const amountInWei = ethers.parseUnits(amount, 18);

    const allowance = await tokenContract.allowance(fromAddress, await tokenContract.signer.getAddress());
    if (allowance.lt(amountInWei)) throw new Error("Saldo insuficiente aprobado.");

    const tx = await tokenContract.transferFrom(fromAddress, toAddress, amountInWei);
    console.log("Transacción en proceso...");
    await tx.wait();

    resultElement.textContent = "Transferencia realizada con éxito.";
    resultElement.classList.add("text-green-500");
  } catch (error) {
    console.error("Error en la transferencia:", error);
    resultElement.textContent = `Error: ${error.message}`;
    resultElement.classList.add("text-red-500");
  }
};

// Eventos de la página
window.addEventListener("load", async () => {
  try {
    if (typeof window.ethereum === "undefined") {
      console.error("MetaMask no está instalado.");
      return;
    }

    // Asociar eventos
    document.getElementById("connectWallet").addEventListener("click", connectWallet);
    document.getElementById("deploytokenA").addEventListener("click", initializeTokenA);

    document.getElementById("approveFormA").addEventListener("submit", async (event) => {
      event.preventDefault();
      const spender = document.getElementById("approveSpenderA").value.trim();
      const amount = document.getElementById("approveAmountA").value.trim();
      const resultElement = document.getElementById("approveResultA");
      await handleApproveA(tokenAContract, spender, amount, resultElement);
    });

    document.getElementById("transferFromFormA").addEventListener("submit", async (event) => {
      event.preventDefault();
      const fromAddress = document.getElementById("fromAddressA").value.trim();
      const toAddress = document.getElementById("toAddressA").value.trim();
      const amount = document.getElementById("transferFromAmountA").value.trim();
      const resultElement = document.getElementById("transferFromResultA");
      await handleTransfer(tokenAContract, fromAddress, toAddress, amount, resultElement);
    });

    // Verificar conexión inicial
    await checkWalletConnection();
    await updateReserves();
    await updateAuthorizationStatus();
  } catch (error) {
    console.error("Error al inicializar la aplicación:", error);
  }
});
