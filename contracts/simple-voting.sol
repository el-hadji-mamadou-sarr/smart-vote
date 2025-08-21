// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title SimpleVoting - Système de vote transparent et anti double-vote (MVP)
/// @notice Passez les noms des candidats au constructeur (ex: ["Amadou","Demba","Omar"])
contract SimpleVoting {
    // ----- Types & stockage -----
    struct Candidate {
        uint256 id;
        string name;
        uint256 votes;
    }

    struct Participant {
        address addr;
        uint256 vote;
    }

    Candidate[] private _candidates;
    mapping(address => bool) public hasVoted;       // EF-3
    mapping(address => uint256) public voteOf;      // Anonyme
    Participant[] private _participants;

    address public owner;

    enum Phase { Setup, Voting, Ended }
    Phase public phase;

    // ----- Événements -----
    event CandidateAdded(uint256 indexed id, string name);
    event VotingOpened(uint256 indexed at);
    event VotingClosed(uint256 indexed at);
    event VoteCast(address indexed voter, uint256 indexed candidateId, uint256 newCount);

    // ----- Modificateurs -----
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier inPhase(Phase p) {
        require(phase == p, "Wrong phase");
        _;
    }

    // ----- Construction -----
    constructor(string[] memory candidateNames) {
        owner = msg.sender;
        phase = Phase.Setup;
        for (uint256 i = 0; i < candidateNames.length; i++) {
            _candidates.push(Candidate({
                id: i,
                name: candidateNames[i],
                votes: 0
            }));
            emit CandidateAdded(i, candidateNames[i]);
        }
    }

    // ----- Admin -----
    function addCandidate(string calldata name) external onlyOwner inPhase(Phase.Setup) {
        uint256 newId = _candidates.length;
        _candidates.push(Candidate({ id: newId, name: name, votes: 0 }));
        emit CandidateAdded(newId, name);
    }

    function openVoting() external onlyOwner inPhase(Phase.Setup) {
        require(_candidates.length >= 1, "No candidates");
        phase = Phase.Voting;
        emit VotingOpened(block.timestamp);
    }

    function closeVoting() external onlyOwner inPhase(Phase.Voting) {
        phase = Phase.Ended;
        emit VotingClosed(block.timestamp);
    }

    // ----- Vote -----
    /// @notice Vote pour un candidat par son id (0..N-1)
    function vote(uint256 candidateId) external inPhase(Phase.Voting) {
        require(!hasVoted[msg.sender], "Already voted");
        require(candidateId < _candidates.length, "Invalid candidate");

        hasVoted[msg.sender] = true;
        voteOf[msg.sender] = candidateId;

        uint256 newCount = ++_candidates[candidateId].votes; // EF-4, EF-5
        emit VoteCast(msg.sender, candidateId, newCount);
    }

    // ----- Lecture / Résultats (EF-6) -----
    function candidateCount() external view returns (uint256) {
        return _candidates.length;
    }

    function getCandidate(uint256 id)
        external
        view
        returns (string memory name, uint256 votes)
    {
        require(id < _candidates.length, "Invalid candidate");
        Candidate storage c = _candidates[id];
        return (c.name, c.votes);
    }

    /// @notice Retourne tous les noms des candidats (ordre = id)
    function getCandidates() external view returns (string[] memory names) {
        uint256 n = _candidates.length;
        names = new string[](n);
        for (uint256 i = 0; i < n; i++) {
            names[i] = _candidates[i].name;
        }
    }

    /// @notice Retourne tous les compteurs de votes (ordre = id)
    function getVotes() external view returns (uint256[] memory counts) {
        uint256 n = _candidates.length;
        counts = new uint256[](n);
        for (uint256 i = 0; i < n; i++) {
            counts[i] = _candidates[i].votes;
        }
    }

    /// @notice Gagnant (en cas d'egalite: premier max)
    function winningCandidate()
        external
        view
        returns (uint256 id, string memory name, uint256 votes)
    {
        uint256 n = _candidates.length;
        if (n == 0) return (type(uint256).max, "", 0);

        uint256 bestId = 0;
        uint256 bestVotes = _candidates[0].votes;

        for (uint256 i = 1; i < n; i++) {
            if (_candidates[i].votes > bestVotes) {
                bestVotes = _candidates[i].votes;
                bestId = i;
            }
        }
        Candidate storage c = _candidates[bestId];
        return (bestId, c.name, c.votes);
    }
}
