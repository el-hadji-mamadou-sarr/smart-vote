const contractAddress = "0x2f8329BCea95963E4621fDDDDCc0dDe13ac1f731"; // Replace with your deployed contract address

const provider = new ethers.providers.Web3Provider(window.ethereum);
let signer;
let contract;

const connectButton = document.getElementById('connectButton');
const walletInfo = document.getElementById('walletInfo');
const accountSpan = document.getElementById('account');
const balanceSpan = document.getElementById('balance');
const totalDepositsSpan = document.getElementById('totalDeposits');
const totalWithdrawalsSpan = document.getElementById('totalWithdrawals');
const actionsDiv = document.getElementById('actions');

const depositButton = document.getElementById('depositButton');
const withdrawButton = document.getElementById('withdrawButton');
const transferButton = document.getElementById('transferButton');

connectButton.addEventListener('click', async () => {
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, contractABI, signer);
    const address = await signer.getAddress();
    accountSpan.innerText = address;
    walletInfo.style.display = 'block';
    actionsDiv.style.display = 'block';
    connectButton.style.display = 'none';
    updateBalance();
    updateTotals();
});

async function updateBalance() {
    const balance = await contract.balanceOf(await signer.getAddress());
    balanceSpan.innerText = ethers.utils.formatEther(balance);
}

async function updateTotals() {
    const totalDeposits = await contract.total_deposits();
    const totalWithdrawals = await contract.total_withdrawals();
    totalDepositsSpan.innerText = ethers.utils.formatEther(totalDeposits);
    totalWithdrawalsSpan.innerText = ethers.utils.formatEther(totalWithdrawals);
}

depositButton.addEventListener('click', async () => {
    const amount = document.getElementById('depositAmount').value;
    const tx = await contract.deposit({ value: ethers.utils.parseEther(amount) });
    await tx.wait();
    updateBalance();
    updateTotals();
});

withdrawButton.addEventListener('click', async () => {
    const amount = document.getElementById('withdrawAmount').value;
    const tx = await contract.withdraw(ethers.utils.parseEther(amount));
    await tx.wait();
    updateBalance();
    updateTotals();
});

transferButton.addEventListener('click', async () => {
    const address = document.getElementById('transferAddress').value;
    const amount = document.getElementById('transferAmount').value;
    const tx = await contract.transfer(address, ethers.utils.parseEther(amount));
    await tx.wait();
    updateBalance();
});