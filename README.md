Architecture du Smart Contract de Vote
1. Modèle de données

Candidate

id: uint256 — identifiant unique du candidat.

name: string — nom du candidat.

votes: uint256 — nombre de voix reçues.

candidates : Candidate[]

Tableau indexé par id contenant tous les candidats.

hasVoted : mapping(address => bool)

Enregistre si une adresse a déjà voté (anti-double-vote strict).

voteOf : mapping(address => uint256)

Trace publique du choix de chaque adresse.

Utile pour audit et transparence.

Pour préserver l’anonymat, une évolution possible serait un système commit-reveal (v2).

owner : address

Adresse propriétaire du contrat (rôle administrateur).

phase : enum { Setup, Voting, Ended }

Indique l’état courant du scrutin : configuration, en cours, ou terminé.

2. Événements

CandidateAdded(uint256 id, string name) : ajout d’un candidat.

VotingOpened(uint256 at) : ouverture officielle du scrutin.

VotingClosed(uint256 at) : clôture du scrutin.

VoteCast(address voter, uint256 candidateId, uint256 newCount) : enregistrement d’un vote.

3. Accès et modificateurs

onlyOwner : réservé aux opérations d’administration (ajout de candidat, ouverture, fermeture).

inPhase(Phase) : assure que les appels respectent le cycle du scrutin.

4. Fonctions publiques
Lecture

candidateCount() → uint256 : nombre total de candidats.

getCandidate(uint256 id) → (string name, uint256 votes) : détail d’un candidat.

getCandidates() → string[] : liste des noms des candidats.

getVotes() → uint256[] : tableau des compteurs de votes.

winningCandidate() → (uint256 id, string name, uint256 votes) : candidat en tête.

hasVoted(address) → bool : indique si une adresse a voté (exposé si public).

Écriture

addCandidate(string name) : ajoute un candidat (seulement en phase Setup).

openVoting() : passe de Setup à Voting (admin uniquement).

closeVoting() : passe de Voting à Ended (admin uniquement).

vote(uint256 candidateId) : permet à un électeur de voter une fois pour un candidat existant (en phase Voting uniquement).

5. Invariants et règles

Impossible de voter hors phase Voting.

candidateId doit être valide (candidateId < candidates.length).

Une adresse ne peut voter qu’une seule fois (contrôle via hasVoted).

Les résultats (getVotes, winningCandidate) sont accessibles en temps réel.

6. Sécurité et extensibilité

Sécurité

Aucun stockage ni transfert d’ETH.

Pas d’appels externes dans vote(), donc pas de réentrance.

Solidity ≥ 0.8, protection native contre overflow/underflow.

Transparence

Événements pour tracer toutes les étapes.

Lecture on-chain des résultats et du statut des électeurs.

Facilité d’usage

Identifiants simples (entiers).

Lecture claire de l’état du scrutin.

Extensions possibles

Meta-transactions / relayer (EIP-712) : voter sans payer de gas.

Fenêtre temporelle : ouverture/fermeture automatique avec timestamps.

Commit-Reveal : renforcer l’anonymat du vote.


****Logique Anti-Double-Vote et Méthodes Publiques
Logique anti-double-vote

Registre d’électeurs : chaque adresse est associée à un statut indiquant si elle a déjà voté.

Vérification préalable : lors de l’appel à la fonction de vote, le contrat vérifie si l’adresse est marquée comme ayant déjà voté.

Blocage du second vote : si l’adresse figure déjà comme « a voté », la transaction est rejetée.

Marquage immédiat : dès qu’un vote est accepté, le statut de l’électeur passe à « a voté », empêchant toute tentative ultérieure.

Immuabilité : une fois le statut défini à « a voté », il ne peut pas être réinitialisé ou modifié.

Cette logique garantit qu’un électeur ne peut participer qu’une seule fois, même en cas de tentative de double vote par réexécution ou fraude.

Méthodes publiques
Administration (réservées au propriétaire)

Initialiser les candidats : enregistre la liste des candidats (Amadou, Demba, Omar).

Ouvrir le scrutin : autorise le démarrage du vote.

Clore le scrutin : met fin au vote et empêche tout nouvel enregistrement.

Participation (accessibles à tout électeur)

Voter : permet à une adresse de choisir un candidat, sous réserve qu’elle n’ait pas déjà voté et que le scrutin soit ouvert.

Consultation (accessibles à tous)

Consulter les résultats : renvoie le nombre de voix obtenues par chaque candidat.

Consulter l’état d’un électeur : permet de vérifier si une adresse a déjà voté (utile pour transparence).

Consulter l’état du scrutin : indique si le scrutin est ouvert, fermé ou en attente.
