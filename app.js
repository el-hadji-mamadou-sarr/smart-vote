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


// Helper: display error (for prod you may want to display to UI instead)
function showError(err) {
  console.error(err);
  alert("Erreur : " + (err?.message || err));
}

// Centralized update: avoids double calls, disables buttons as needed
async function runRender() {
  try {
    const [candidates, results, hasVoted] = await Promise.all([
      contract.getCandidates(),
      contract.getResults(),
      contract.hasVoted(userAddress),
    ]);
    renderCandidates(candidates, hasVoted);
    renderResults(candidates, results);
  } catch (e) {
    showError(e);
  }
}

// Render candidate list with dynamic disable if already voted
function renderCandidates(candidates, hasVoted) {
  candidatesList.innerHTML = "";
  candidates.forEach((name, i) => {
    const item = document.createElement("div");
    item.className = "candidate-item";
    item.innerHTML = `
      <span class="candidate-name">${name}</span>
      <button class="vote-btn" ${hasVoted ? "disabled" : ""} data-cid="${i}">
        ${hasVoted ? "Vote déjà soumis" : "Voter"}
      </button>`;
    candidatesList.appendChild(item);
  });

  // Delegated event listeners for all buttons
  candidatesList.querySelectorAll("button[data-cid]").forEach((btn) => {
    btn.onclick = async () => {
      btn.disabled = true;
      try {
        const cid = Number(btn.getAttribute("data-cid"));
        const already = await contract.hasVoted(userAddress);
        if (already) {
          alert("Vous avez déjà voté !");
          return;
        }
        const tx = await contract.vote(cid);
        await tx.wait();
        alert("Vote confirmé !");
        await runRender();
      } catch (e) {
        showError(e);
        btn.disabled = false;
      }
    };
  });
}

// Render live results
function renderResults(candidates, results) {
  // results: array of BigNumber
  const totalVotes = results.reduce(
    (acc, v) => acc.add(v),
    ethers.BigNumber.from(0)
  );
  resultsList.innerHTML = "";
  results.forEach((votes, i) => {
    const percent =
      totalVotes.isZero() ? 0 : votes.mul(100).div(totalVotes).toString();
    const count = votes.toString();
    resultsList.innerHTML += `
      <div class="results-item">
        <div class="result-header">
          <span class="candidate-result-name">${candidates[i]}</span>
          <span class="result-stats">${percent}% (${count} votes)</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar-fill" style="width: ${percent}%;"></div>
        </div>
      </div>
    `;
  });
}
