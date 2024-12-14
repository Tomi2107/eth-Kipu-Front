// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./TokenA.sol";
import "./TokenB.sol";

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
