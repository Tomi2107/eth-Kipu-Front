import { loadABI, connectWallet, updateAuthorizationStatus, ethers } from './scriptConectDisc.js';
import { updateReserves } from './scriptSimpleDEX_corr.js';

let tokenBContract;
let tokenAContract;
let signer;
let simpleDEXAddress;
let isTokenBInitialized = false;

async function initializeTokenB() {
  try {
    if (isTokenBInitialized) {
      console.log("TokenB ya está inicializado.");
      return;
    }

    const tokenBAddress = "0xcafca52de7bcb96ff0b0995af6532e774ab2f6e1"; // Dirección de TokenB
    const tokenBABI = await fetch('https://gist.githubusercontent.com/Tomi2107/961bea5fde9050147a6ab4b0231238f9/raw/0c2ac86f5087b9784af49b123b7c4f438cfafb55/.json').then(res => res.json());
    const provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();

    tokenBContract = new ethers.Contract(tokenBAddress, tokenBABI, signer);
    isTokenBInitialized = true;

    console.log("TokenB inicializado correctamente:", tokenBContract);
  } catch (error) {
    console.error("Error inicializando TokenB:", error);
    alert("Error inicializando TokenB.");
  }
};

document.getElementById("deploytokenB").addEventListener("click", async () => {
  await initializeTokenB();
});

// Asociar el formulario con la función
document.getElementById("approveFormB").addEventListener("submit", async (event) => {
  event.preventDefault(); // Evitar recargar la página

  const spender = document.getElementById("approveSpenderB").value.trim();
  const amount = document.getElementById("approveAmountB").value.trim();
  const resultElement = document.getElementById("approveResultB");

  // Restablecer mensajes anteriores
  resultElement.textContent = "";
  console.log(spender, amount);

  // Llamar a la función de aprobación
  await handleApproveB(tokenBContract, spender, amount, resultElement);
});

async function handleApproveB(tokenBContract, spender, amount, resultElement) {
  try {
    if (!spender || !amount) throw new Error('Por favor, completa todos los campos.');
    if (!ethers.isAddress(spender)) throw new Error("Dirección no válida para 'spender'.");
    if (!tokenBContract) throw new Error("El contrato de TokenB no está inicializado.");

    // Conversión de cantidad a formato Wei
    const parsedAmount = ethers.parseUnits(amount, 18);

    console.log("Cantidad en Wei:", parsedAmount.toString());

    // Solicitar aprobación
    const tx = await tokenBContract.approve(spender, parsedAmount);
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

document.getElementById('transferFromFormB').addEventListener('submit', async (event) => {
  event.preventDefault();
  const fromAddress = document.getElementById('fromAddressB').value.trim();
  const toAddress = document.getElementById('toAddressB').value.trim();
  const amount = document.getElementById('transferFromAmountB').value.trim();
  const resultElement = document.getElementById('transferFromResultB');
  await handleTransfer(tokenBContract, fromAddress, toAddress, amount, resultElement);
});

async function handleTransfer(tokenBContract, fromAddress, toAddress, amount, resultElement) {
  try {
    if (!ethers.isAddress(fromAddress) || !ethers.isAddress(toAddress)) {
      throw new Error("Dirección no válida.");
    }

    const amountInWei = ethers.parseUnits(amount, 18);

    const allowance = await tokenBContract.allowance(fromAddress, await tokenBContract.signer.getAddress());
    if (allowance.lt(amountInWei)) throw new Error("Saldo insuficiente aprobado.");

    const tx = await tokenBContract.transferFrom(fromAddress, toAddress, amountInWei);
    console.log("Transacción en proceso...");
    await tx.wait();

    resultElement.textContent = "Transferencia realizada con éxito.";
    resultElement.classList.add("text-green-500");
    resultElement.classList.remove("text-red-500");
  } catch (error) {
    console.error("Error en la transferencia:", error);
    resultElement.textContent = `Error: ${error.message}`;
    resultElement.classList.add("text-red-500");
    resultElement.classList.remove("text-green-500");
  }
};

// Verificar la conexión de la billetera
async function checkWalletConnection() {
  if (typeof window.ethereum === "undefined") {
    alert("MetaMask no está instalado.");
  }
};

const savedAddress = localStorage.getItem("walletAddress");
if (savedAddress) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  signer = await provider.getSigner();
  document.getElementById("walletAddress").innerText = `Dirección: ${savedAddress}`;
  await loadABI();
  await updateAuthorizationStatus();
};

window.addEventListener("load", async () => {
  try {
    // Asociar eventos
    document.getElementById("connectWallet").addEventListener("click", connectWallet);
    document.getElementById("transferFromFormB").addEventListener("submit", async (event) => {
      event.preventDefault();
      const fromAddress = document.getElementById("fromAddressB").value.trim();
      const toAddress = document.getElementById("toAddressB").value.trim();
      const amount = document.getElementById("transferFromAmountB").value.trim();
      const resultElement = document.getElementById("transferFromResultB");
      await handleTransfer(tokenBContract, fromAddress, toAddress, amount, resultElement);
    });

    await checkWalletConnection();
    await updateAuthorizationStatus();
  } catch (error) {
    console.error("Error al inicializar la aplicación:", error);
  }
});

// Actualizar reservas solo si hay cantidad de TokenA
let amount;
if (amount && amount !== '0') {
  try {
    await updateReserves();
  } catch (error) {
    console.log('No hay reservas todavía');
  }
};
