
// Cargar direcciones desde el archivo .env
const TOKEN_A_ADDRESS = process.env.VITE_TOKENA_ADDRESS;
const TOKEN_B_ADDRESS = process.env.VITE_TOKENB_ADDRESS;
const DEX_ADDRESS = process.env.VITE_DEX_ADDRESS;

// Importar ethers.js para interactuar con contratos en la blockchain
const ethers = require('ethers');

// Declarar variables globales
let provider, signer, tokenAContract, tokenBContract, dexContract;

// Función para validar direcciones de Ethereum
function isValidAddress(address) {
    return ethers.utils.isAddress(address);
}

// Función para validar montos numéricos
function isValidAmount(amount) {
    return !isNaN(amount) && Number(amount) > 0;
}

// Función para conectar la cartera
async function connectWallet() {
    console.log("Intentando conectar la cartera...");

    if (window.ethereum) {
        try {
            // Solicitar acceso a la cuenta
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log("MetaMask detectado y conectado");

            // Inicializar proveedor y firmante
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            const userAddress = await signer.getAddress();

            console.log(`Cartera conectada: ${userAddress}`);

            // Inicializar contratos
            await initContracts();

            // Actualizar la interfaz de usuario
            document.getElementById('status').innerText = `Conectado a la cuenta: ${userAddress}`;
            document.getElementById('btnConnect').style.display = 'none';
            document.getElementById('btnDisconnect').style.display = 'inline';
        } catch (error) {
            console.error("Error al conectar la cartera:", error);
        }
    } else {
        alert("MetaMask no está instalado. Por favor, instálalo para continuar.");
    }
}

// Función para desconectar la cartera
function disconnectWallet() {
    // Limpiar variables globales
    provider = null;
    signer = null;
    tokenAContract = null;
    tokenBContract = null;
    dexContract = null;

    // Actualizar la interfaz de usuario
    document.getElementById('status').innerText = "Estado: Desconectado";
    document.getElementById('btnConnect').style.display = 'inline';
    document.getElementById('btnDisconnect').style.display = 'none';

    console.log("Cartera desconectada y contratos limpiados");
}

// Función para inicializar contratos
async function initContracts() {
    try {
        console.log("Inicializando contratos...");

        // ABI de los contratos (puedes cargarlos dinámicamente si es necesario)
        const tokenAABI = [/* ABI de Token A */];
        const tokenBABI = [/* ABI de Token B */];
        const dexABI = [/* ABI del DEX */];

        // Crear instancias de los contratos
        tokenAContract = new ethers.Contract(TOKEN_A_ADDRESS, tokenAABI, signer);
        tokenBContract = new ethers.Contract(TOKEN_B_ADDRESS, tokenBABI, signer);
        dexContract = new ethers.Contract(DEX_ADDRESS, dexABI, signer);

        console.log("Contratos inicializados correctamente");
    } catch (error) {
        console.error("Error al inicializar contratos:", error);
    }
}

// Función para realizar transferencias de tokens
async function transferTokens(tokenContract, to, amount) {
    try {
        if (!isValidAddress(to)) throw new Error("Dirección inválida");
        if (!isValidAmount(amount)) throw new Error("Monto inválido");

        // Realizar la transferencia
        const tx = await tokenContract.transfer(to, ethers.utils.parseUnits(amount, 18));
        console.log(`Transferencia enviada: ${tx.hash}`);
        await tx.wait();

        console.log("Transferencia completada con éxito");
        document.getElementById('status').innerText = "Transferencia completada exitosamente.";
    } catch (error) {
        console.error("Error en la transferencia de tokens:", error);
    }
}

// Función para verificar conexión con MetaMask
async function checkWalletConnection() {
    if (!window.ethereum || !provider || !signer) {
        console.error("MetaMask no está conectado");
        document.getElementById('status').innerText = "Estado: MetaMask no conectado";
        return false;
    }
}
