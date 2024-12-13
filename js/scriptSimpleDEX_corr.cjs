const { ethers } = require("ethers");

// Dirección y ABI de SimpleDEX
const simpleDEXAddress = "0x8388c1d78ec692cc4555f9367ff42f17084e79a3"; // Reemplazar con la dirección real
const simpleDEXABI_URL = "https://gist.githubusercontent.com/Tomi2107/a1856eb0469c6eebdd24fd48d2d2b32c/raw/0ba5cfd708d0e57751bd8249d760a8a26b39cf1c/.json";

const provider = "https://scroll-sepolia.g.alchemy.com/v2/-Om5pWvbQTGynmGJHrCUkiXa-ES1ZVuW";
const signer = provider.getSigner();
let simpleDEXContract;
let isSimpleDEXInitialized = false;

// Inicializar SimpleDEX
const initializeSimpleDEX = async () => {
  try {
    if (!window.ethereum) {
      alert("MetaMask no está disponible.");
      return;
    }

    const simpleDEXABI = await fetch(simpleDEXABI_URL).then((res) => res.json());
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();

    simpleDEXContract = new ethers.Contract(simpleDEXAddress, simpleDEXABI, signer);
    isSimpleDEXInitialized = true;

    console.log("SimpleDEX inicializado correctamente:", simpleDEXContract);
  } catch (error) {
    console.error("Error inicializando SimpleDEX:", error);
    alert("Error inicializando SimpleDEX.");
  }
};

// Configurar SimpleDEX con TokenA y TokenB
const setupSimpleDEX = async (tokenAAddress, tokenBAddress) => {
  try {
    if (!isSimpleDEXInitialized) {
      alert("SimpleDEX no está inicializado.");
      return;
    }

    console.log("Configurando SimpleDEX con TokenA:", tokenAAddress, "y TokenB:", tokenBAddress);
    await simpleDEXContract.initialize(tokenAAddress, tokenBAddress);

    alert("SimpleDEX configurado correctamente.");
  } catch (error) {
    console.error("Error configurando SimpleDEX:", error);
    alert("Error configurando SimpleDEX.");
  }
};

// Event listeners para botones e interacciones del frontend
document.getElementById("deploysimpleDex").addEventListener("click", async () => {
  await initializeSimpleDEX();
});

document.getElementById("setupSimpleDEXForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const tokenAAddress = document.getElementById("tokenAAddress").value;
  const tokenBAddress = document.getElementById("tokenBAddress").value;

  if (!ethers.isAddress(tokenAAddress) || !ethers.isAddress(tokenBAddress)) {
    alert("Las direcciones ingresadas no son válidas.");
    return;
  }

  await setupSimpleDEX(tokenAAddress, tokenBAddress);
});

// Actualizar reservas de tokens
async function updateReserves() {
  try {
    // Inicializa con valores predeterminados
    document.getElementById("reserveA").innerText = "0.0 A";
    document.getElementById("reserveB").innerText = "0.0 B";

    // Verifica que los contratos estén definidos
    if (!tokenAContract || !tokenBContract || !simpleDEXContract) {
      console.log("Contratos no inicializados.");
      return;
    }

    // Verifica que los métodos balanceOf existan
    if (typeof tokenAContract.balanceOf !== "function" || typeof tokenBContract.balanceOf !== "function") {
      console.log("Método balanceOf no disponible en los contratos.");
      return;
    }

    // Obtén las reservas actualizadas
    const reserveA = await tokenAContract.balanceOf(simpleDEXContract.address);
    const reserveB = await tokenBContract.balanceOf(simpleDEXContract.address);

    // Actualiza los elementos HTML con los valores actuales
    document.getElementById("reserveA").innerText = ethers.formatUnits(reserveA, 18);
    document.getElementById("reserveB").innerText = ethers.formatUnits(reserveB, 18);
  } catch (error) {
    console.error("Error al actualizar las reservas:", error);
  }
}

// Vincula loadReserves al evento de carga de la página
window.addEventListener("load", updateReserves);

// Llama a updateReserves periódicamente o después de eventos específicos
document.getElementById("updateButton").addEventListener("click", updateReserves);

// Agregar liquidez
document.getElementById('addLiquidityForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const amountA = document.getElementById('amountA').value;
  const amountB = document.getElementById('amountB').value;

  try {
    const tx = await simpleDEXContract.addLiquidity(
      ethers.parseUnits(amountA, 18),
      ethers.parseUnits(amountB, 18)
    );
    await tx.wait();
    alert("Liquidez añadida con éxito.");
    await updateReserves();
  } catch (error) {
    console.error("Error al agregar liquidez:", error);
    alert("No se pudo añadir liquidez.");
  }
});

// Retirar liquidez
document.getElementById('removeLiquidityForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const amountA = document.getElementById('removeamountA').value;
  const amountB = document.getElementById('removeamountB').value;

  try {
    const tx = await simpleDEXContract.removeLiquidity(
      ethers.parseUnits(amountA, 18),
      ethers.parseUnits(amountB, 18)
    );
    await tx.wait();
    alert("Liquidez retirada con éxito.");
    await updateReserves();
  } catch (error) {
    console.error("Error al retirar liquidez:", error);
    alert("No se pudo retirar liquidez.");
  }
});

// Consultar saldo de un usuario
document.getElementById('balanceForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const address = document.getElementById('addressBalance').value;
  try {
    const balance = await tokenAContract.balanceOf(address);
    document.getElementById('balanceResult').innerText = `Saldo: ${ethers.formatUnits(balance, 18)} TKA`;
  } catch (error) {
    console.error("Error al consultar el saldo:", error);
    alert("No se pudo consultar el saldo.");
  }
});

// Manejar intercambios (swaps)
document.getElementById('swapForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const amountIn = document.getElementById('swapAmount').value;
  const direction = document.getElementById('swapDirection').value;

  try {
    let tx;
    if (direction === "swapAforB") {
      tx = await simpleDEXContract.swapAforB(ethers.parseUnits(amountIn, 18));
    } else if (direction === "swapBforA") {
      tx = await simpleDEXContract.swapBforA(ethers.parseUnits(amountIn, 18));
    }
    await tx.wait();
    alert("Intercambio realizado con éxito.");
    await updateReserves();
  } catch (error) {
    console.error("Error en el intercambio:", error);
    alert("No se pudo realizar el intercambio.");
  }
});

// Verificar conexión al wallet
async function checkWalletConnection() {
  if (!window.ethereum) {
    alert("Por favor, instala Metamask para interactuar con esta aplicación.");
    return;
  }

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log("Cartera conectada.");
  } catch (error) {
    console.error("Error al conectar la cartera:", error);
    alert("Error al conectar la cartera.");
  }
};

// Guardar y usar dirección del wallet
const savedAddress = localStorage.getItem("walletAddress");
if (savedAddress) {
  console.log("Dirección guardada encontrada:", savedAddress);
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  console.log("Signer inicializado:", signer);

  document.getElementById("walletAddress").innerText = `Dirección: ${savedAddress}`;

  // Inicializar aplicación al cargar
  window.addEventListener('load', async () => {
    try {
      await checkWalletConnection();
      await initializeSimpleDEX();
      await loadABI();
    } catch (error) {
      console.error("Error al inicializar:", error);
    }
  });
}



//que funciones llevan allowance ? iniciali<eTokenA y B, load y update reserves, los form de trasnferencia...

/*haria falta agregar un boton que permita ver cuantos token de A y B tengo al iniciar el simpledex y que varie con los trsafer y el swap..
*falta la funcion getPrice(), y un boton que devuelva el precio de los tokens al principio y a medida que se usan los trasf y swap..
*/
// También exportamos updateReserves para que pueda ser utilizada en otros scripts.
