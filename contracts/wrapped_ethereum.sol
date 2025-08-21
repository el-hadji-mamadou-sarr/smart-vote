// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract wrapped_ethereum {
  constructor() public {
  }

  // This contract implements a simple wrapped Ethereum token
  // It allows users to deposit and withdraw Ether, effectively wrapping it
  // into a token that can be used in other smart contracts

  // wrapped Ethereum is a token that represents Ether on the Ethereum blockchain
  // It allows users to interact with smart contracts that require a token
  // instead of Ether directly


   mapping(address => uint256) public balances; // will be stored in the contract
    // Mapping to keep track of user balances
    // addresse1 => 1000
    // addresse2 => 2000  
    // addresse3 => 3000

    // contract addreess or EOA address (Externally Owned Account)

    int public total_deposits; // total deposits in the contract
    // will be saved in the contract storage

    int public total_withdrawals; // total withdrawals in the contract
    // will be saved in the contract storage



   event Deposit(address indexed user, uint256 amount);
    // the purpose of this event is to debug the contract
    // it will be emitted when a user deposits Ether into the contract
    // indexed user is the address of the user who deposited Ether

   event Withdrawal(address indexed user, uint256 amount);
    // the purpose of this event is to debug the contract
    // it will be emitted when a user withdraws Ether from the contract
    // indexed user is the address of the user who withdrew Ether



   // this function returns the balance of a user
   // this function is view function, means it does not modify the state of the contract, but only reads it
  function balanceOf(address account) public view returns (uint256) {
    return balances[account];
  }


  // this is a pure function, means it does not read or modify the state of the contract 
  function name() public pure returns (string memory) {
    return "Wrapped Ethereum";
  }


  function symbol() public pure returns (string memory) {
    return "WETH";  
  }

  function decimals() public pure returns (uint8) {
    return 18;
  }


  function totalSupply() public view returns (uint256) {
    // This function returns the total supply of wrapped Ethereum tokens
    // In this case, it is not implemented, so it returns 0
    // You can implement it to return the total amount of Ether deposited in the contract
    return uint256(total_deposits);
  }

  function totalWithdrawals() public view returns (uint256) {
    // This function returns the total amount of Ether withdrawn from the contract
    // It is not implemented, so it returns 0
    // You can implement it to return the total amount of Ether withdrawn in the contract
    return uint256(total_withdrawals);
  }


  // this function is payable, means it can receive Ether
  // it allows users to deposit Ether into the contract
  // when a user deposits Ether, the contract will increase the user's balance
  // and emit a Deposit event
  function deposit() public payable {
    // This function allows users to deposit Ether into the contract
    require(msg.value > 0, "Deposit amount must be greater than zero");
    // msg.value is the amount of Ether sent with the transaction
    // msg is the global variable that contains information about the transaction
    // msg contains also the sender's address, the transaction hash, the block number, etc.
    
    // msg.sender is the address of the user who sent the transaction
    // we increase the user's balance by the amount of Ether sent with the transaction
    balances[msg.sender] += msg.value;


    // we also increase the total deposits in the contract
    total_deposits += int(msg.value);

    // we emit a Deposit event to notify the users that a deposit has been made
    emit Deposit(msg.sender, msg.value);
  }


  // this function on the other hand is not payable, means it cannot receive Ether
  // it allows users to withdraw Ether from the contract
  function withdraw(uint256 amount) public {
    // This function allows users to withdraw Ether from the contract
    // it checks if the user has enough balance to withdraw the specified amount
    // this require is the equivalent of an if statement that checks if the condition is true
    // if the condition is false, it will revert the transaction and return an error message
    require(amount > 0, "Withdrawal amount must be greater than zero");
    
    // we check if the user has enough balance to withdraw the specified amount
    // if the user does not have enough balance, it will revert the transaction and return an
    require(balances[msg.sender] >= amount, "Insufficient balance");

    // we should decrease the user amount before sending the Ether
    // this is to prevent re-entrancy attacks, where a user could call the withdraw

    balances[msg.sender] -= amount;

    // transfer message sender the specified amount of Ether
    payable(msg.sender).transfer(amount);
  
  
    total_withdrawals += int(amount);
    // we also increase the total withdrawals in the contract
    // this is to keep track of the total amount of Ether withdrawn from the contract

    // emit a Withdrawal event to notify the users that a withdrawal has been made
    // this event will be logged in the transaction receipt and can be used to debug the contract
// we also decrease the total withdrawals in the contract 
    emit Withdrawal(msg.sender, amount);
  }
 
  // this function send the token from the sender address to the recipient address
  function transfer(address recipient, uint256 amount) public returns (bool) {
    // This function allows users to transfer wrapped Ether to another address

    require(balances[msg.sender] >= amount, "Insufficient balance");
    // we should decrease the user amount before transferring the token
    // this is to prevent re-entrancy attacks, where a user could call the transfer
    balances[msg.sender] -= amount;
    balances[recipient] += amount;
    return true;
  }



}
