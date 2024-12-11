import { ethers } from 'https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js';

const tokenAAddress = "0xbbbdec7784e51c80a6b86e80f6e8f7a313460906";
const tokenBAddress = "0xcafca52de7bcb96ff0b0995af6532e774ab2f6e1";
const simpleDEXAddress = "0x8388c1d78ec692cc4555f9367ff42f17084e79a3";

let signer, address, tokenAContract, tokenBContract, simpleDEXContract;
let provider;

const providerURL = "https://scroll-sepolia.g.alchemy.com/v2/-Om5pWvbQTGynmGJHrCUkiXa-ES1ZVuW";

/**
 * Conecta la wallet y configura el proveedor y firmante.
 */
async function connectWallet() {
    console.log('Conectando wallet...');

    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            provider = new ethers.BrowserProvider(window.ethereum);
            signer = await provider.getSigner();
            address = await signer.getAddress();

            document.getElementById('walletAddress').innerText = `Dirección: ${address}`;
            document.getElementById('connectWallet').style.display = 'none';
            document.getElementById('disconnectWallet').style.display = 'block';

            console.log("Wallet conectada:", address);

            // Inicializa contratos una vez conectada la wallet
           // await initializeContracts();

        } catch (error) {
            console.error("Error al conectar la wallet:", error);
        }
    } else {
        alert('Por favor, instala MetaMask.');
    }
};

/**
 * Carga los ABIs desde URLs externas.
 */
async function loadABI() {
    try {
        const tokenAABI = await fetch('https://gist.githubusercontent.com/Tomi2107/4dd8248426b0f2b79a369eddbab98d55/raw/492f918c85edf2a30b82faeaaa506650c300fd69/.json').then(res => res.json());
        const tokenBABI = await fetch('https://gist.githubusercontent.com/Tomi2107/961bea5fde9050147a6ab4b0231238f9/raw/0c2ac86f5087b9784af49b123b7c4f438cfafb55/.json').then(res => res.json());
        const simpleDEXABI = await fetch('https://gist.githubusercontent.com/Tomi2107/a1856eb0469c6eebdd24fd48d2d2b32c/raw/0ba5cfd708d0e57751bd8249d760a8a26b39cf1c/.json').then(res => res.json());

        console.log("ABIs cargados correctamente.");
        return { tokenAABI, tokenBABI, simpleDEXABI };
    } catch (error) {
        console.error('Error al cargar los ABIs:', error);
    }
};
/**
 * Desconecta la wallet y limpia el estado relacionado.
 */
document.addEventListener('DOMContentLoaded', () => {
    const disconnectButton = document.getElementById('disconnectWallet');
    disconnectButton.addEventListener('click', () => {
        console.log('Desconectando wallet...');
        document.getElementById('walletAddress').innerText = "Desconectado";
        document.getElementById('connectWallet').style.display = 'inline';
        document.getElementById('disconnectWallet').style.display = 'none';
        console.log('wallet desconectada');
    });
});

/**
 * Carga las reservas del contrato SimpleDEX solo después de interacciones relevantes.
 */
async function loadReserves() {
    try {
        // Establece valores iniciales mientras se cargan los datos
        document.getElementById("reserveA").innerText = "0.0";
        document.getElementById("reserveB").innerText = "0.0";

        // Obtén las reservas desde los contratos
        const reserveA = await tokenAContract.balanceOf(tokenAAddress);
        const reserveB = await tokenBContract.balanceOf(tokenBAddress);

        // Actualiza los elementos HTML con los valores obtenidos
        document.getElementById("reserveA").innerText = ethers.formatUnits(reserveA, 18);
        document.getElementById("reserveB").innerText = ethers.formatUnits(reserveB, 18);
    } catch {
        console.log("contratos no incilizados");

      
    }
};

// Llama a la función al cargar la página
window.addEventListener("load", loadReserves);



/**
 * Actualiza el estado de autorizaciones para los tokens.
 */
async function updateAuthorizationStatus() {
    console.log('Autorizacion no cargada todavia');
    try {
      // Obtener referencias a los elementos
      const spenderAElement = document.getElementById("approveSpenderA");
      const spenderBElement = document.getElementById("approveSpenderB");
  
      // Verificar si los elementos tienen valor
      if (!spenderAElement.value) {
        const spenderA = await fetchSpenderA(); // Supongamos que fetchSpenderA obtiene el dato correspondiente
        spenderAElement.value = spenderA;
        console.log(`SpenderA actualizado a: ${spenderA}`);
      }
  
      if (!spenderBElement.value) {
        const spenderB = await fetchSpenderB(); // Supongamos que fetchSpenderB obtiene el dato correspondiente
        spenderBElement.value = spenderB;
        console.log(`SpenderB actualizado a: ${spenderB}`);
      
    }else{
        let authorizedForA = await tokenAContract.allowance(address, simpleDEXAddress);
        let authorizedForB = await tokenBContract.allowance(address, simpleDEXAddress);

        document.getElementById("authorizations").innerHTML = `
            <p><strong>Token A:</strong> ${ethers.formatUnits(authorizedForA, 18)} autorizado.</p>
            <p><strong>Token B:</strong> ${ethers.formatUnits(authorizedForB, 18)} autorizado.</p>
        `;
    }}catch{
        console.log('updateAutorization L118');
    }
};  

// Llamar a la función en algún punto del flujo
updateAuthorizationStatus();
  
// Eventos de la página
window.addEventListener('load', async () => {
    const storedAddress = localStorage.getItem('walletAddress');
    if (storedAddress) {
        address = storedAddress;
        document.getElementById('walletAddress').innerText = `Dirección: ${address}`;
        document.getElementById('connectWallet').style.display = 'none';
        document.getElementById('disconnectWallet').style.display = 'block';
        await loadABI();
      //  await initializeContracts();
    } else {
        document.getElementById('connectWallet').style.display = 'inline';
        document.getElementById('disconnectWallet').style.display = 'none';
    }
});

// Exporta las funciones necesarias para otros scripts
export {
    connectWallet,
    loadABI,
    // initializeContracts,
    loadReserves,
    updateAuthorizationStatus,
    ethers
};


