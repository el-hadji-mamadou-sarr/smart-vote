const wrapped_ethereum = artifacts.require("wrapped_ethereum");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("wrapped_ethereum", function (accounts ) {
  it("should assert true", async function () {
    await wrapped_ethereum.deployed();
    return assert.isTrue(true);
  });
  it("should have a name", async function () {
    const instance = await wrapped_ethereum.deployed();
    const name = await instance.name();
    assert.equal(name, "Wrapped Ethereum");
  });
  it("should have a symbol", async function () {
    const instance = await wrapped_ethereum.deployed();
    const symbol = await instance.symbol();
    assert.equal(symbol, "WETH");
  });
  it("should have 18 decimals", async function () {
    const instance = await wrapped_ethereum.deployed();
    const decimals = await instance.decimals();
    assert.equal(decimals.toNumber(), 18);
  });

  //test deposit
  it("should allow deposits", async function () {
    const instance = await wrapped_ethereum.deployed();
    const initialBalance = await instance.balanceOf(accounts[0]);
    
    // Simulate a deposit
    await instance.deposit({ from: accounts[0], value: web3.utils.toWei("1", "ether") });
    
    const newBalance = await instance.balanceOf(accounts[0]);
    assert.equal(newBalance.toString(), initialBalance.add(web3.utils.toBN(web3.utils.toWei("1", "ether"))).toString());
  });

  // test withdraw
  it("should allow withdrawals", async function () {
    const instance = await wrapped_ethereum.deployed();
    const initialBalance = await instance.balanceOf(accounts[0]);
    
    // Simulate a withdrawal
    await instance.withdraw(web3.utils.toWei("1", "ether"), { from: accounts[0] });
    
    const newBalance = await instance.balanceOf(accounts[0]);
    assert.equal(newBalance.toString(), initialBalance.sub(web3.utils.toBN(web3.utils.toWei("1", "ether"))).toString());
  });


  // transfer test
  it("should allow transfers", async function () {
    const instance = await wrapped_ethereum.deployed();
    const initialBalanceSender = await instance.balanceOf(accounts[0]);
    const initialBalanceReceiver = await instance.balanceOf(accounts[1]);
    // deposit before transfer
    await instance.deposit({ from: accounts[0], value: web3.utils.toWei("1", "ether") });

    // Simulate a transfer
    await instance.transfer(accounts[1], web3.utils.toWei("0.5", "ether"), { from: accounts[0] });
    
    const newBalanceSender = await instance.balanceOf(accounts[0]);
    const newBalanceReceiver = await instance.balanceOf(accounts[1]);
    
    assert.equal(newBalanceSender.toString(), initialBalanceSender.sub(web3.utils.toBN(web3.utils.toWei("-0.5", "ether"))).toString());
    assert.equal(newBalanceReceiver.toString(), initialBalanceReceiver.add(web3.utils.toBN(web3.utils.toWei("0.5", "ether"))).toString());
  });

});
