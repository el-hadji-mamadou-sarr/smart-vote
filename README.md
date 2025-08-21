# Smart Vote - Système de Vote Décentralisé sur Blockchain

## Répartition des rôles et contributions

Membre 1 — Cheffe de projet / Coordinatrice: Nour BEN REJEB  
Membre 2 — Analyste / Spécifications: Harouna BA  
Membre 3 — Architecte Smart Contract: Rostom MOUADDEB  
Membre 4 — Développeur·se Solidity: Souleymane  
Membre 5 — Testeur·se Smart Contract: Salamata Nourou MBAYE  
Membre 6 — Déploiement / Environnement de test: Dixy Prevner M POUTOU BABINGUI  
Membre 7 — Développeur·se Frontend (interface simple): El Hadji Mamadou SARR  
Membre 8 — Intégration web3 / Connexion au contrat: Thierno Sadou BARRY  
Membre 9 — Documentation & Guides: Ala TROJETTE  
Membre 10 — QA finale, simulation et captures: Basak DURGUN DONMEZ

---

## 📋 Table des Matières

* [À propos](#à-propos)
* [Fonctionnalités](#fonctionnalités)
* [Architecture](#architecture)
* [Installation](#installation)
* [Guide d'utilisation](#guide-dutilisation)
* [Déploiement](#déploiement)
* [Tests](#tests)
* [Captures d'écran](#captures-décran)
* [Architecture du Smart Contract de Vote](#architecture-du-smart-contract-de-vote)
* [Contact](#contact)

## À propos

**Smart Vote** est une application de vote décentralisée construite sur Ethereum qui permet d'organiser des élections transparentes et sécurisées. Le système utilise des smart contracts pour garantir l'intégrité des votes et la transparence du processus électoral.

### Objectifs principaux

* Permettre aux électeurs de voter une seule fois
* Garantir la sécurité et la visibilité des résultats
* Créer un système transparent et auditable

### Stack Technique

* **Blockchain**: Ethereum (Solidity)
* **Frontend**: HTML5, CSS3, JavaScript (Web3.js)
* **Tests**: Truffle, Mocha
* **Déploiement**: Truffle

## Fonctionnalités

✅ **Sécurité renforcée** — Protection contre le double vote
✅ **Transparence** — Tous les votes sont enregistrés sur la blockchain
✅ **Accessibilité** — Interface web intuitive
✅ **Auditabilité** — Historique complet des transactions
✅ **Administration** — Gestion complète du scrutin par l'administrateur
✅ **Comptabilisation automatique** — Les votes sont comptés automatiquement par le smart contract

## Architecture

### Vue d'ensemble

Le système Smart Vote est composé de trois composants principaux :

1. **Smart Contract** (Solidity) — Logique de vote et enregistrement sur blockchain
2. **Interface Web** (HTML/CSS/JavaScript) — Interaction utilisateur
3. **Tests automatisés** — Validation du fonctionnement

> Pour le détail complet de l’architecture bas-niveau du contrat, voir [Architecture du Smart Contract de Vote](#architecture-du-smart-contract-de-vote).

## Installation

### Prérequis

* Node.js (v14 ou supérieur)
* npm ou yarn
* MetaMask (extension navigateur)
* Truffle (global)
* Ganache (pour le développement local)

### Installation locale

1. **Cloner le repository**

```bash
git clone https://github.com/el-hadji-mamadou-sarr/smart-vote.git
cd smart-vote
```

2. **Installer les dépendances**

```bash
npm install
npm install -g truffle
```

3. **Configurer l'environnement**

```bash
# Pour le développement local
# Démarrer la blockchain locale sur 127.0.0.1:8545 avec 10 comptes préfinancés
ganache
```

- Mettre l'adresse des participants dans contrats/simple-voting.sol

4. **Compiler et déployer les contrats**

```bash
truffle compile
truffle migrate --reset
```
- Mettre l'adresse du contrat dans app.js

5. **Lancer l'application**

```bash
npm run dev
``` 

## Guide d'utilisation

### Pour les administrateurs

#### 1. Configuration initiale

```javascript
// Se connecter à MetaMask et sélectionner le compte administrateur
// Déployer le contrat ou utiliser l'adresse du contrat déployé
```

#### 2. Ajouter des candidats

```javascript
// Ajouter des candidats (phase Setup uniquement)
await contract.methods.addCandidate("Amadou").send({ from: adminAddress });
await contract.methods.addCandidate("Demba").send({ from: adminAddress });
await contract.methods.addCandidate("Omar").send({ from: adminAddress });
```

#### 3. Ouverture du scrutin

```javascript
// Ouvrir les votes
await contract.methods.openVoting().send({ from: adminAddress });
```

#### 4. Clôture du scrutin

```javascript
// Fermer les votes
await contract.methods.closeVoting().send({ from: adminAddress });
```

### Pour les électeurs

#### 1. Se connecter

* Ouvrir l'application dans le navigateur
* Connecter MetaMask au réseau approprié
* Sélectionner le compte de vote

#### 2. Voter

```javascript
// Vérifier si l'utilisateur peut voter
const hasVoted = await contract.methods.hasVoted(userAddress).call();

// Voter pour un candidat
await contract.methods.vote(candidateId).send({ from: userAddress });
```

#### 3. Consulter les résultats

```javascript
// Obtenir les résultats
const results = await contract.methods.getVotes().call();
const winner = await contract.methods.winningCandidate().call();
```

## Déploiement

### Déploiement sur testnet (Rinkeby/Ropsten)

1. **Obtenir des ETH de test**

   * Utiliser un faucet ([https://faucets.chain.link/](https://faucets.chain.link/))

2. **Configurer le fichier de configuration**

```javascript
// truffle-config.js
module.exports = {
  networks: {
    rinkeby: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://rinkeby.infura.io/v3/YOUR_PROJECT_ID`
        ),
      network_id: 4,
      gas: 5650000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
};
```

3. **Déployer**

```bash
truffle migrate --network rinkeby
```

### Déploiement sur mainnet

⚠️ **Attention** : Le déploiement sur mainnet nécessite des ETH réels et une revue de sécurité approfondie.

```bash
truffle migrate --network mainnet
```

## Tests


### Préparation

* **Démarrer Ganache**

```bash
ganache-cli
```

* Le serveur RPC tourne sur `127.0.0.1:8545` avec 10 comptes à \~1000 ETH. *(Pic 1)*

* **Compiler**

```bash
truffle compile
```

* Compilation réussie ; artifacts générés dans `build/contracts`. *(Pic 2)*

* **Déployer**

```bash
truffle migrate --reset
```

* Exemple de sortie (local) :
  Adresse du contrat : `0xA36Db62B0De385f5715178b9f74Ad91b2a891B9f`
  Compte déployeur : `0xF6C3508Ff8d5f9433E3E63B9DC8996B0baC4a5a1`
  Coût \~0.0059 ETH (Ganache). *(Pic 3)*

### Lancer les tests

```bash
truffle test
# avec couverture (si configuré)
truffle run coverage
```

* **VotingSystem.test.js** *(Pic 4)*

  * ✅ Déploiement : contrat déployé, propriétaire défini, candidats initialisés.
  * ✅ Phases : seul le propriétaire peut ouvrir/fermer.
  * ✅ Vote : prévention double vote, rejet indices invalides, comptage correct.
  * ✅ Résultats : `getVotes()` exact, `winningCandidate()` cohérent.
  * ✅ Cas limites : votes simultanés OK, lecture après fermeture, vote bloqué après fermeture.

* **FailureCases.test.js** *(Pic 5)*

  * ✅ Sécurité / accès : opérations admin interdites aux non-propriétaires.
  * ✅ Anti-double-vote : toute 2e tentative échoue.
  * ✅ Entrées invalides : candidats inexistants rejetés.
  * ✅ Phases : impossible de voter avant ouverture / après fermeture.
  * ✅ Stress : rejets systématiques des votes multiples simultanés depuis la même adresse.

### Reproduction ciblée

```bash
truffle test test/VotingSystem.test.js --grep "should allow voting"
truffle test test/FailureCases.test.js --grep "should prevent double voting"
truffle test test/VotingSystem.test.js --grep "should calculate winner correctly"
```

### Versions utilisées

<img width="800" height="175" alt="image" src="https://github.com/user-attachments/assets/658c42af-29be-437d-a0f9-1eea6a69463c" />


## Captures d'écran

* **Pic 1** — Démarrage de Ganache / comptes : <img width="1056" height="691" alt="image" src="https://github.com/user-attachments/assets/65b965c0-27a9-4260-ae86-cbd34bfbc5c3" />


* **Pic 2** — Compilation Truffle réussie : <img width="1025" height="529" alt="image" src="https://github.com/user-attachments/assets/f3cee6cd-c656-4b1c-98a2-561570fe1f12" />

* **Pic 3** — Déploiement & adresse du contrat : <img width="1025" height="529" alt="image" src="https://github.com/user-attachments/assets/1fe7551e-ae00-4eb9-877c-783e1f8f554e" />


* **Pic 4** — Résultats `VotingSystem.test.js` : <img width="1035" height="318" alt="image" src="https://github.com/user-attachments/assets/51d96f3e-55ab-4e57-93aa-9b58f0b6e911" />

* **Pic 5** — Résultats `FailureCases.test.js` : <img width="1041" height="548" alt="image" src="https://github.com/user-attachments/assets/a0d0af51-9c4b-4f7b-ac42-996ce8b1cd09" />

* **Pic 6** — Logs de test additionnels :   <img width="650" height="650" alt="image" src="https://github.com/user-attachments/assets/6245b663-7e90-4a2f-bbd1-97ccce78870b" />  

* **Pic 7** — Logs/console utiles :  <img width="650" height="650" alt="image" src="https://github.com/user-attachments/assets/a9e1a0e6-2742-4ffd-b3a8-1e9d7aa13e12" />  

* **Pic 8** — État des comptes/transactions :   <img width="650" height="650" alt="image" src="https://github.com/user-attachments/assets/21554862-9bad-4e0a-8966-8cb0b9ad5172" />  

* **Pic 9** — Autre sortie tests :   <img width="650" height="650" alt="image" src="https://github.com/user-attachments/assets/06c651ee-8f69-499d-83d0-a876e8ef8425" />  

* **Pic 10** — Autre sortie tests :   <img width="650" height="650" alt="image" src="https://github.com/user-attachments/assets/63c1caa5-742d-4336-8d08-2aaf5197d174" />  

* **Pic 11** — Autre sortie tests :   <img width="650" height="600" alt="image" src="https://github.com/user-attachments/assets/f2a0fc9b-8138-472a-a9db-951b8f7e80ec" />  

* **Pic 12** — Autre sortie tests :   <img width="650" height="650" alt="image" src="https://github.com/user-attachments/assets/96a1c67b-6ed4-4404-9372-263df277c803" />  


### Placeholder Frontend

* **Pic Frontend** — Capture de l’interface (Formulaire vote / résultats) : 
<img width="550" height="1090" alt="image" src="https://github.com/user-attachments/assets/12f9c8a4-2d1a-42e9-abd4-24be9ff50621" />  
<img width="550" height="890" alt="image" src="https://github.com/user-attachments/assets/be645a85-a2a6-44c5-a076-57da04a614ac" />  
<img width="550" height="890" alt="image" src="https://github.com/user-attachments/assets/8e2411c1-6dad-4161-b631-d06b190fb319" />  
<img width="550" height="890" alt="image" src="https://github.com/user-attachments/assets/1b671bc2-d359-47a0-969f-767b1d82b882" />  





---

## Architecture du Smart Contract de Vote

### Modèle de données

#### Candidate
- **id**: `uint256` — identifiant unique du candidat  
- **name**: `string` — nom du candidat  
- **votes**: `uint256` — nombre de voix reçues  

#### Structures globales
- **candidates**: `Candidate[]`  
  Tableau indexé par `id` contenant tous les candidats.  

- **hasVoted**: `mapping(address => bool)`  
  Enregistre si une adresse a déjà voté (**anti-double-vote strict**).  

- **voteOf**: `mapping(address => uint256)`  
  Trace publique du choix de chaque adresse (utile pour audit et transparence).  
  > 💡 Pour préserver l’anonymat, une évolution possible serait un système **commit-reveal** (v2).  

- **owner**: `address`  
  Adresse propriétaire du contrat (rôle administrateur).  

- **phase**: `enum { Setup, Voting, Ended }`  
  Indique l’état courant du scrutin : configuration, en cours, ou terminé.  

---

### Événements

- **CandidateAdded(uint256 id, string name)** : ajout d’un candidat  
- **VotingOpened(uint256 at)** : ouverture officielle du scrutin  
- **VotingClosed(uint256 at)** : clôture du scrutin  
- **VoteCast(address voter, uint256 candidateId, uint256 newCount)** : enregistrement d’un vote  

---

### Accès et modificateurs

- **onlyOwner** : réservé aux opérations d’administration (ajout de candidat, ouverture, fermeture)  
- **inPhase(Phase)** : assure que les appels respectent le cycle du scrutin  

---

### Fonctions publiques

#### Lecture
- `candidateCount() → uint256` : nombre total de candidats  
- `getCandidate(uint256 id) → (string name, uint256 votes)` : détail d’un candidat  
- `getCandidates() → string[]` : liste des noms des candidats  
- `getVotes() → uint256[]` : tableau des compteurs de votes  
- `winningCandidate() → (uint256 id, string name, uint256 votes)` : candidat en tête  
- `hasVoted(address) → bool` : indique si une adresse a voté  

#### Écriture
- `addCandidate(string name)` : ajoute un candidat (**seulement en phase Setup**)  
- `openVoting()` : passe de **Setup → Voting** (admin uniquement)  
- `closeVoting()` : passe de **Voting → Ended** (admin uniquement)  
- `vote(uint256 candidateId)` : permet à un électeur de voter une fois pour un candidat existant (**en phase Voting uniquement**)  

---

### Invariants et règles

- Impossible de voter hors phase **Voting**  
- `candidateId` doit être valide (`candidateId < candidates.length`)  
- Une adresse ne peut voter **qu’une seule fois** (contrôle via `hasVoted`)  
- Les résultats (`getVotes`, `winningCandidate`) sont accessibles **en temps réel**  

---

### Sécurité et extensibilité

#### Sécurité
- Aucun stockage ni transfert d’ETH  
- Pas d’appels externes dans `vote()` → pas de réentrance  
- Solidity ≥ 0.8 → protection native contre overflow/underflow  

#### Transparence
- Événements pour tracer toutes les étapes  
- Lecture on-chain des résultats et du statut des électeurs  

#### Facilité d’usage
- Identifiants simples (entiers)  
- Lecture claire de l’état du scrutin  

#### Extensions possibles
- **Meta-transactions / relayer (EIP-712)** : voter sans payer de gas  
- **Fenêtre temporelle** : ouverture/fermeture automatique avec timestamps  
- **Commit-Reveal** : renforcer l’anonymat du vote  

---

### Logique Anti-Double-Vote

1. **Registre d’électeurs** : chaque adresse est associée à un statut indiquant si elle a déjà voté  
2. **Vérification préalable** : avant d’accepter un vote, le contrat vérifie `hasVoted[msg.sender]`  
3. **Blocage du second vote** : si l’adresse a déjà voté → transaction rejetée  
4. **Marquage immédiat** : dès qu’un vote est accepté, l’adresse est marquée comme **a voté**  
5. **Immuabilité** : le statut ne peut être réinitialisé ni modifié  

> Cette logique garantit qu’un électeur ne peut voter **qu’une seule fois**, même en cas de tentative de fraude ou de réexécution.  

---

### Méthodes publiques

#### Administration (réservées au propriétaire)
- **Initialiser les candidats** : enregistrer la liste des candidats (ex: *Amadou, Demba, Omar*)  
- **Ouvrir le scrutin** : autoriser le démarrage du vote  
- **Clore le scrutin** : mettre fin au vote et bloquer toute nouvelle participation  

#### Participation (électeurs)
- **Voter** : choisir un candidat (si scrutin ouvert et adresse non encore utilisée)  

#### Consultation (tout public)
- **Consulter les résultats** : nombre de voix obtenues par chaque candidat  
- **Consulter l’état d’un électeur** : vérifier si une adresse a déjà voté  
- **Consulter l’état du scrutin** : indiquer si le scrutin est **Setup / Voting / Ended**  
