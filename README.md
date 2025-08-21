***Architecture du Smart Contract de Vote
Modèle de données
•	Candidate
o	id: uint256 — identifiant unique du candidat

o	name: string — nom du candidat

o	votes: uint256 — nombre de voix reçues
•	candidates : Candidate[]
o	Tableau indexé par id contenant tous les candidats
•	hasVoted : mapping(address => bool)
o	Enregistre si une adresse a déjà voté (anti-double-vote strict)
•	voteOf : mapping(address => uint256)
o	Trace publique du choix de chaque adresse

o	Utile pour audit et transparence

o	Pour préserver l’anonymat : évolution possible en commit-reveal (v2)
•	owner : address
o	Adresse propriétaire du contrat (rôle administrateur)
•	phase : enum { Setup, Voting, Ended }
o	Indique l’état courant du scrutin : configuration, en cours ou terminé
________________________________________
Événements
•	CandidateAdded(uint256 id, string name) — ajout d’un candidat

•	VotingOpened(uint256 at) — ouverture officielle du scrutin

•	VotingClosed(uint256 at) — clôture du scrutin

•	VoteCast(address voter, uint256 candidateId, uint256 newCount) — enregistrement d’un vote
________________________________________
Accès et modificateurs
•	onlyOwner — réservé aux opérations d’administration (ajout de candidat, ouverture, fermeture)

•	inPhase(Phase) — assure que les appels respectent le cycle du scrutin
________________________________________
Fonctions publiques
Lecture
•	candidateCount() → uint256 — nombre total de candidats

•	getCandidate(uint256 id) → (string name, uint256 votes) — détail d’un candidat

•	getCandidates() → string[] — liste des noms des candidats

•	getVotes() → uint256[] — tableau des compteurs de votes

•	winningCandidate() → (uint256 id, string name, uint256 votes) — candidat en tête

•	hasVoted(address) → bool — indique si une adresse a voté (exposé si public)
Écriture
•	addCandidate(string name) — ajoute un candidat (seulement en phase Setup)

•	openVoting() — passe de Setup à Voting (admin uniquement)

•	closeVoting() — passe de Voting à Ended (admin uniquement)

•	vote(uint256 candidateId) — permet à un électeur de voter une fois pour un candidat existant (en phase Voting uniquement)
________________________________________
Invariants et règles
•	Impossible de voter hors phase Voting

•	candidateId doit être valide (candidateId < candidates.length)

•	Une adresse ne peut voter qu’une seule fois (contrôle via hasVoted)

•	Les résultats (getVotes, winningCandidate) sont accessibles en temps réel
________________________________________
Sécurité et extensibilité
•	Sécurité
o	Aucun stockage ni transfert d’ETH

o	Pas d’appels externes dans vote(), donc pas de réentrance

o	Solidity ≥ 0.8, protection native contre overflow/underflow
•	Transparence
o	Événements pour tracer toutes les étapes

o	Lecture on-chain des résultats et du statut des électeurs
•	Facilité d’usage
o	Identifiants simples (entiers)

o	Lecture claire de l’état du scrutin
•	Extensions possibles
o	Meta-transactions / relayer (EIP-712) : voter sans payer de gas

o	Fenêtre temporelle : ouverture/fermeture automatique avec timestamps

o	Commit-Reveal : renforcer l’anonymat du vote
________________________________________
***Logique Anti-Double-Vote
•	Registre d’électeurs : chaque adresse est associée à un statut indiquant si elle a déjà voté

•	Vérification préalable : lors de l’appel à la fonction vote, le contrat vérifie si l’adresse a déjà voté

•	Blocage du second vote : si l’adresse figure déjà comme « a voté », la transaction est rejetée

•	Marquage immédiat : dès qu’un vote est accepté, le statut de l’électeur passe à « a voté »

•	Immuabilité : une fois le statut défini à « a voté », il ne peut pas être réinitialisé ou modifié
________________________________________
Méthodes publiques
•	Administration (propriétaire uniquement)
o	Initialiser les candidats : enregistre la liste des candidats (ex: Amadou, Demba, Omar)

o	Ouvrir le scrutin : autorise le démarrage du vote

o	Clore le scrutin : met fin au vote et empêche tout nouvel enregistrement
•	Participation (tous électeurs)
o	Voter : permet à une adresse de choisir un candidat, sous réserve qu’elle n’ait pas déjà voté et que le scrutin soit ouvert
•	Consultation (tous utilisateurs)
o	Consulter les résultats : renvoie le nombre de voix obtenues par chaque candidat

o	Consulter l’état d’un électeur : vérifie si une adresse a déjà voté

o	Consulter l’état du scrutin : indique si le scrutin est ouvert, fermé ou en attente
