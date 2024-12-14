// SPDX-License-Identifier: MIT
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
