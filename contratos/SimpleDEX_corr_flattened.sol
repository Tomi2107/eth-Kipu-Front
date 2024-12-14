// SPDX-License-Identifier: MIT
// File: @openzeppelin/contracts/token/ERC20/IERC20.sol


// OpenZeppelin Contracts (last updated v5.1.0) (token/ERC20/IERC20.sol)

pragma solidity ^0.8.20;

/**
 * @dev Interface of the ERC-20 standard as defined in the ERC.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the value of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the value of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 value) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 value) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the
     * allowance mechanism. `value` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

// File: contracts/TokenA.sol


pragma solidity 0.8.26;

/// @title TokenA: Un token ERC-20 simple
/// @dev Este contrato implementa un token ERC-20 estándar
contract TokenA {
    string public name = "TokenA"; // Nombre del token
    string public symbol = "TKA"; // Símbolo del token
    uint8 public decimals = 18;   // Número de decimales
    uint256 public totalSupply = 1_000_000 * (10 ** uint256(decimals)); // Suministro total

    mapping(address => uint256) public balanceOf; // Saldo de cada dirección
    mapping(address => mapping(address => uint256)) public allowance; // Permisos para transferencias

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() {
        balanceOf[msg.sender] = totalSupply; // Asignar todo el suministro inicial al creador del contrato
    }

    function transfer(address to, uint256 value) public returns (bool) {
        require(balanceOf[msg.sender] >= value, "Saldo insuficiente");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) public returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(balanceOf[from] >= value, "Saldo insuficiente");
        require(allowance[from][msg.sender] >= value, "No autorizado");
        balanceOf[from] -= value;
        allowance[from][msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(from, to, value);
        return true;
    }
}

// File: contracts/TokenB.sol


pragma solidity 0.8.26;

/// @title TokenB: Un token ERC-20 simple
/// @dev Este contrato implementa un token ERC-20 estándar
contract TokenB {
    string public name = "TokenB"; // Nombre del token
    string public symbol = "TKB"; // Símbolo del token
    uint8 public decimals = 18;   // Número de decimales
    uint256 public totalSupply = 1_000_000 * (10 ** uint256(decimals)); // Suministro total

    mapping(address => uint256) public balanceOf; // Saldo de cada dirección
    mapping(address => mapping(address => uint256)) public allowance; // Permisos para transferencias

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() {
        balanceOf[msg.sender] = totalSupply; // Asignar todo el suministro inicial al creador del contrato
    }

    function transfer(address to, uint256 value) public returns (bool) {
        require(balanceOf[msg.sender] >= value, "Saldo insuficiente");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) public returns (bool) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool) {
        require(balanceOf[from] >= value, "Saldo insuficiente");
        require(allowance[from][msg.sender] >= value, "No autorizado");
        balanceOf[from] -= value;
        allowance[from][msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(from, to, value);
        return true;
    }
}

// File: contracts/SimpleDEX_corr.sol


pragma solidity 0.8.26;




/// @title SimpleDEX: Un Exchange descentralizado con pools de liquidez
/// @dev Implementa la fórmula del producto constante para calcular los precios.
contract SimpleDEX {
    address public tokenA;
    address public tokenB;

    uint256 public reserveA;
    uint256 public reserveB;

    address public owner;

    event LiquidityAdded(address indexed provider, uint256 amountA, uint256 amountB);
    event LiquidityRemoved(address indexed provider, uint256 amountA, uint256 amountB);
    event TokenSwapped(address indexed trader, address tokenIn, uint256 amountIn, address tokenOut, uint256 amountOut);

    modifier onlyOwner() {
        require(msg.sender == owner, unicode"Solo el owner puede realizar esta acción");
        _;
    }

    constructor(address _tokenA, address _tokenB) {
        tokenA = _tokenA;
        tokenB = _tokenB;
        owner = msg.sender;
    }

    function addLiquidity(uint256 amountA, uint256 amountB) external onlyOwner {
        // Checks: Verifica las condiciones necesarias
        require(amountA > 0 && amountB > 0, unicode"Las cantidades deben ser mayores a 0");

        // Effects: Actualiza el estado antes de interactuar
        reserveA += amountA;
        reserveB += amountB;

        // Interactions: Interactúa con contratos externos al final
        IERC20(tokenA).transferFrom(msg.sender, address(this), amountA);
        IERC20(tokenB).transferFrom(msg.sender, address(this), amountB);

        emit LiquidityAdded(msg.sender, amountA, amountB);
    }

    function removeLiquidity(uint256 amountA, uint256 amountB) external onlyOwner {
        // Checks
        require(amountA <= reserveA, unicode"No hay suficiente liquidez para TokenA");
        require(amountB <= reserveB, unicode"No hay suficiente liquidez para TokenB");

        // Effects
        reserveA -= amountA;
        reserveB -= amountB;

        // Interactions
        IERC20(tokenA).transfer(msg.sender, amountA);
        IERC20(tokenB).transfer(msg.sender, amountB);

        emit LiquidityRemoved(msg.sender, amountA, amountB);
    }

    function swapAforB(uint256 amountAIn) external {
        // Checks
        require(amountAIn > 0, unicode"La cantidad de entrada debe ser mayor a 0");

        uint256 amountBOut = getAmountOut(amountAIn, reserveA, reserveB);

        // Effects
        reserveA += amountAIn;
        reserveB -= amountBOut;

        // Interactions
        IERC20(tokenA).transferFrom(msg.sender, address(this), amountAIn);
        IERC20(tokenB).transfer(msg.sender, amountBOut);

        emit TokenSwapped(msg.sender, tokenA, amountAIn, tokenB, amountBOut);
    }

    function swapBforA(uint256 amountBIn) external {
        // Checks
        require(amountBIn > 0, unicode"La cantidad de entrada debe ser mayor a 0");

        uint256 amountAOut = getAmountOut(amountBIn, reserveB, reserveA);

        // Effects
        reserveB += amountBIn;
        reserveA -= amountAOut;

        // Interactions
        IERC20(tokenB).transferFrom(msg.sender, address(this), amountBIn);
        IERC20(tokenA).transfer(msg.sender, amountAOut);

        emit TokenSwapped(msg.sender, tokenB, amountBIn, tokenA, amountAOut);
    }

    function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut) internal pure returns (uint256) {
        require(reserveIn > 0 && reserveOut > 0, unicode"Reservas no válidas");
        uint256 amountInWithFee = amountIn * 997; // Comisión de 0.3%
        uint256 numerator = amountInWithFee * reserveOut;
        uint256 denominator = (reserveIn * 1000) + amountInWithFee;
        return numerator / denominator;
    }
}
