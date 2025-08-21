// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleVoting {
    struct Candidate {
        uint256 id;
        string name;
        uint256 votes;
    }

    Candidate[] private _candidates;
    mapping(address => bool) public isParticipant;
    mapping(address => bool) public hasVoted;

    address public owner;
    enum Phase { Setup, Voting, Ended }
    Phase public phase;

    event VotingOpened(uint256 at);
    event VotingClosed(uint256 at);
    event VoteCast(uint256 indexed candidateId, uint256 newCount);

    modifier onlyOwner() { require(msg.sender == owner, "Only owner"); _; }
    modifier inPhase(Phase p) { require(phase == p, "Wrong phase"); _; }

    constructor() {
        owner = msg.sender;
        phase = Phase.Setup;

        // --- Candidats fixes ---
        _candidates.push(Candidate(0, "Amadou", 0));
        _candidates.push(Candidate(1, "Demba", 0));
        _candidates.push(Candidate(2, "Paul", 0));

        // --- Participants fixes (adresses d'exemple Ganache/Hardhat) ---
        isParticipant[0x64777566321E48DCFC1bf4aB686491Cf7C47718A] = true;
        isParticipant[0xd1327cD9e3332D740d6521aFdE38Cb7fCEFeC641] = true;
        isParticipant[0xAbf158336275e1099C06da465b14A0487098E261] = true;
        // isParticipant[0x09b73d3BC815B816D7AAE8c14e74e9a27eD22d35] = true;
        // isParticipant[0xD292ACF8Cd06b2FAdDaFDaf6C6F3530F96F5F688] = true;
        // isParticipant[0x13bEC533e93f8E5E36e9B281C041434b9B6DE3AB] = true;
        // isParticipant[0xE03C04e894db1779237734B7824f89a96EBd9559] = true;
        // isParticipant[0x48D036895a2605Ee03620007fDa1F941d76d2985] = true;
        // isParticipant[0xb9507723D6efc99A839d4F27397ad587AA121847] = true;
        // isParticipant[0xa31C6EB4A6885AD8191f94666452ea99811976B6] = true;
    }

    function openVoting() external onlyOwner inPhase(Phase.Setup) {
        phase = Phase.Voting;
        emit VotingOpened(block.timestamp);
    }

    function closeVoting() external onlyOwner inPhase(Phase.Voting) {
        phase = Phase.Ended;
        emit VotingClosed(block.timestamp);
    }

    function vote(uint256 candidateId) external inPhase(Phase.Voting) {
        require(isParticipant[msg.sender], "Not authorized");
        require(!hasVoted[msg.sender], "Already voted");
        require(candidateId < _candidates.length, "Invalid candidate");

        hasVoted[msg.sender] = true;
        uint256 newCount = ++_candidates[candidateId].votes;
        emit VoteCast(candidateId, newCount);
    }

    function getVotes() external view returns (uint[] memory counts) {
        counts = new uint[](_candidates.length);
        for (uint i = 0; i < _candidates.length; i++) counts[i] = _candidates[i].votes;
    }

    function getCandidates() external view returns (string[] memory names) {
        names = new string[](_candidates.length);
        for (uint i = 0; i < _candidates.length; i++) names[i] = _candidates[i].name;
    }

    function winningCandidate() external view returns (uint256 id, string memory name, uint256 votes) {
        uint256 n = _candidates.length;
        require(n > 0, "No candidates");
        uint256 bestId = 0;
        uint256 bestVotes = _candidates[0].votes;
        for (uint256 i = 1; i < n; i++) {
            if (_candidates[i].votes > bestVotes) { bestVotes = _candidates[i].votes; bestId = i; }
        }
        Candidate storage c = _candidates[bestId];
        return (bestId, c.name, c.votes);
    }
}
