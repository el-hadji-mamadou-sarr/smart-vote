const contractABI = [
{
  "inputs": [{ "internalType": "string[]", "name": "candidateNames", "type": "string[]" }],
  "stateMutability": "nonpayable",
  "type": "constructor"
},
{
  "anonymous": false,
  "inputs": [
    { "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
    { "indexed": false, "internalType": "string", "name": "name", "type": "string" }
  ],
  "name": "CandidateAdded",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    { "indexed": true, "internalType": "address", "name": "voter", "type": "address" },
    { "indexed": true, "internalType": "uint256", "name": "candidateId", "type": "uint256" },
    { "indexed": false, "internalType": "uint256", "name": "newCount", "type": "uint256" }
  ],
  "name": "VoteCast",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    { "indexed": true, "internalType": "uint256", "name": "at", "type": "uint256" }
  ],
  "name": "VotingClosed",
  "type": "event"
},
{
  "anonymous": false,
  "inputs": [
    { "indexed": true, "internalType": "uint256", "name": "at", "type": "uint256" }
  ],
  "name": "VotingOpened",
  "type": "event"
},
{
  "inputs": [{ "internalType": "string", "name": "name", "type": "string" }],
  "name": "addCandidate",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [],
  "name": "candidateCount",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "closeVoting",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
  "name": "getCandidate",
  "outputs": [
    { "internalType": "string", "name": "name", "type": "string" },
    { "internalType": "uint256", "name": "votes", "type": "uint256" }
  ],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "getCandidates",
  "outputs": [{ "internalType": "string[]", "name": "names", "type": "string[]" }],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "getVotes",
  "outputs": [{ "internalType": "uint256[]", "name": "counts", "type": "uint256[]" }],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
  "name": "hasVoted",
  "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "openVoting",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [],
  "name": "owner",
  "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "phase",
  "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [{ "internalType": "uint256", "name": "candidateId", "type": "uint256" }],
  "name": "vote",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
},
{
  "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
  "name": "voteOf",
  "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view",
  "type": "function"
},
{
  "inputs": [],
  "name": "winningCandidate",
  "outputs": [
    { "internalType": "uint256", "name": "id", "type": "uint256" },
    { "internalType": "string", "name": "name", "type": "string" },
    { "internalType": "uint256", "name": "votes", "type": "uint256" }
  ],
  "stateMutability": "view",
  "type": "function"
}
];