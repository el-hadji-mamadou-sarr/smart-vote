const contractAddress = "0x2053e9F946E4F973794b73ab656999386BF88e8e"; // Replace with your deployed voting contract address

const provider = new ethers.providers.Web3Provider(window.ethereum);
let signer;
let contract;
let userAddress;

const connectButton = document.getElementById('connectButton');
const walletInfo = document.getElementById('walletInfo');
const accountSpan = document.getElementById('account');

connectButton.addEventListener('click', async () => {
    try {
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        userAddress = await signer.getAddress();
        contract = new ethers.Contract(contractAddress, contractABI, signer);
        
        accountSpan.innerText = userAddress.substring(0, 6) + '...' + userAddress.substring(38);
        walletInfo.style.display = 'block';
        connectButton.textContent = 'Wallet Connecté';
        connectButton.disabled = true;
        
        await updateResults(); // Commenté temporairement - besoin d'un contrat de vote déployé
    } catch (error) {
        console.error('Erreur de connexion:', error);
        alert('Erreur lors de la connexion au wallet');
    }
});

// Vote function called from HTML onclick
async function vote(candidateId) {
    if (!userAddress) {
        alert('Veuillez d\'abord connecter votre wallet');
        return;
    }
    
    try {
        const hasVoted = await contract.hasVoted(userAddress);
        if (hasVoted) {
            alert('Vous avez déjà voté !');
            return;
        }
        
        const tx = await contract.vote(candidateId);
        await tx.wait();
        alert('Vote confirmé !');
        
        // await updateResults(); // Commenté temporairement - besoin d'un contrat de vote déployé
    } catch (error) {
        console.error('Erreur de vote:', error);
        alert('Erreur lors du vote: ' + (error?.message || error));
    }
}

// Update results display
async function updateResults() {
    try {
        // Debug: Check contract deployment and phase
        console.log("Contract address:", contract.address);
        console.log("User address:", userAddress);
        
        // Check if contract exists
        const code = await provider.getCode(contract.address);
        console.log("Contract code exists:", code !== "0x");
        
        if (code === "0x") {
            throw new Error("No contract deployed at this address");
        }
        
        // Check if contract exists and phase
        try {
            const phase = await contract.phase();
            console.log("Contract phase:", phase.toString());
            const owner = await contract.owner();
            console.log("Contract owner:", owner);
            const isParticipant = await contract.isParticipant(userAddress);
            console.log("Is user authorized participant:", isParticipant);
        } catch (phaseError) {
            console.error("Error checking contract state:", phaseError);
            console.log("Phase error details:", phaseError.reason, phaseError.data);
            throw new Error("Contract function call failed: " + (phaseError.reason || phaseError.message));
        }
        
        const results = await contract.getVotes();
        
        if (!results || results.length === 0) {
            // Display empty results
            const resultElements = document.querySelectorAll('.results-item');
            resultElements.forEach((element, i) => {
                const statsElement = element.querySelector('.result-stats');
                const progressElement = element.querySelector('.progress-bar-fill');
                
                if (statsElement) statsElement.textContent = '0% (0 votes)';
                if (progressElement) progressElement.style.width = '0%';
            });
            return;
        }
        
        const totalVotes = results.reduce((acc, votes) => acc.add(votes), ethers.BigNumber.from(0));
        
        results.forEach((votes, i) => {
            const percent = totalVotes.isZero() ? 0 : votes.mul(100).div(totalVotes).toString();
            const count = votes.toString();
            
            const resultElements = document.querySelectorAll('.results-item');
            if (resultElements[i]) {
                const statsElement = resultElements[i].querySelector('.result-stats');
                const progressElement = resultElements[i].querySelector('.progress-bar-fill');
                
                if (statsElement) statsElement.textContent = `${percent}% (${count} votes)`;
                if (progressElement) progressElement.style.width = `${percent}%`;
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des résultats:', error);
        // Display empty results on error
        const resultElements = document.querySelectorAll('.results-item');
        resultElements.forEach((element, i) => {
            const statsElement = element.querySelector('.result-stats');
            const progressElement = element.querySelector('.progress-bar-fill');
            
            if (statsElement) statsElement.textContent = 'Pas de données';
            if (progressElement) progressElement.style.width = '0%';
        });
    }
}

// Helper: display error
function showError(err) {
    console.error(err);
    alert("Erreur : " + (err?.message || err));
}
