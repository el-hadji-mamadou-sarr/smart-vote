// voting.js
import { ethers } from "ethers";
import fs from "fs";

// ---- 1. Provider ----
const providerUrl = "http://127.0.0.1:7545";   // Ganache
const provider = new ethers.JsonRpcProvider(providerUrl);

// ---- 2. ABI & Contract ----
const contractAddress = "0x773b908d122F81B793540244a21c2D3C3cD57ed3"; // senin deploy adresin
const abi = JSON.parse(fs.readFileSync("./build/contracts/SimpleVoting.json")).abi;
const contract = new ethers.Contract(contractAddress, abi, provider);

async function main() {
  const ownerSigner = await provider.getSigner(0);      // 0. hesap = owner
  const owner = await ownerSigner.getAddress();
  const contractAsOwner = contract.connect(ownerSigner);

  try {
    await contractAsOwner.openVoting();
    console.log("✅ Voting phase opened (owner:", owner, ")");
  } catch (e) {
    console.log("ℹ️ Voting zaten açık olabilir:", e.reason || e.message);
  }

  const voterSigners = [1, 2, 3, 4, 5].map(i => provider.getSigner(i));

  const names = await contract.getCandidates();
  console.log("📋 Candidates:", names);

  for (let i = 0; i < voterSigners.length; i++) {
    const s = await voterSigners[i];
    const addr = await s.getAddress();
    const c = contract.connect(s);
    const choice = Math.floor(Math.random() * names.length);
    await c.vote(choice);
    console.log(`🗳️  ${addr} → ${names[choice]}`);
  }

  const counts = await contract.getVotes();
  console.log("\n📊 Final results:");
  names.forEach((n, idx) => {
    console.log(`- ${n}: ${counts[idx].toString()} vote(s)`);
  });
}

main().catch(console.error);
