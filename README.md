# Smart-Vote — Système de vote sur blockchain

Résumé
-------
Smart-Vote est un projet pédagogique qui illustre un système de vote décentralisé sur Ethereum. Le smart contract principal (`contracts/simple-voting.sol`) gère une liste de candidats, un ensemble d'adresses autorisées à voter, une phase de vote et la comptabilisation des voix en garantissant qu'un électeur ne puisse voter qu'une seule fois.

Analyse du code (état actuel)
-----------------------------
- Contrat principal : `contracts/simple-voting.sol`
  - Solidity ^0.8.20.
  - Structures : `Candidate` (id, name, votes).
  - Mappings : `isParticipant` (adresses autorisées), `hasVoted`.
  - Phases : `Setup`, `Voting`, `Ended` ; contrôlées par le propriétaire (`owner`).
  - Fonctions publiques importantes :
    - `openVoting()` / `closeVoting()` (seulement owner).
    - `vote(candidateId)` : vérifie l'autorisation, l'absence de vote préalable et incrémente le compteur.
    - `getVotes()` / `getCandidates()` / `winningCandidate()` : lectures des résultats.
  - Remarque : le constructeur initialise des candidats fixes et quelques adresses d'exemple (adresses Ganache). Si vous voulez un système dynamique, prévoir des fonctions d'ajout de candidats et d'ajout de participants.

- Frontend : `index.html`, `app.js`, `abi.js`
  - `index.html` propose une interface visuelle de vote (boutons `Voter` pour 3 candidats) et une UI pour se connecter au wallet.
  - `app.js` actuel contient du code pour un contrat différent (fonctions `deposit`, `withdraw`, `transfer`, `balanceOf`), il ne contient pas les fonctions attendues par `index.html` (par ex. `vote()` ou la récupération des candidats/voix).
  - `abi.js` contient l'ABI d'un contrat de type "wrapped_ethereum" (pas l'ABI de `SimpleVoting`).
  - Conclusion : le frontend n'est pas encore intégré au `SimpleVoting` — il faut remplacer l'ABI et adapter `app.js` (ou créer un `voting.js`) pour utiliser `SimpleVoting` (connecter, lister candidats, envoyer `vote()` et afficher `getVotes()`).

- Tests et migrations
  - `migrations/1755686314_wrapped_ethereum.js` déploie un contrat `wrapped_ethereum` (pas encore de migration pour `SimpleVoting`).
  - `test/wrapped_ethereum.js` contient des tests pour `wrapped_ethereum` (dépôt/retrait/transfert), mais il n'y a pas de tests automatisés pour `SimpleVoting` dans `test/`.

Instructions d'installation et d'exécution
----------------------------------------
Prérequis
- Node.js (>= 16), npm
- Truffle (ou Hardhat) et Ganache pour un réseau local

Installer les dépendances
```bash
npm install
```

Déployer le contrat `SimpleVoting` localement (Truffle)
1. Lancer Ganache (UI ou CLI) sur le port 8545.
2. Ajouter une migration pour `SimpleVoting` (si absente, créer `migrations/2_deploy_simple_voting.js`).
3. Lancer :
```bash
truffle migrate --network development
```

Exécuter les tests
```bash
truffle test
```
Recommandation : ajouter des tests unitaires pour `SimpleVoting` (happy path + cas limites : double vote, vote par non-participant, ouverture/fermeture de la phase).

Lancer l'interface
- Option simple : ouvrir `index.html` dans un navigateur (nécessite que `app.js` soit connecté au bon contrat).
- Option recommandée : lancer le serveur de développement fourni :
```bash
npm run dev
```

Points techniques et corrections à faire
--------------------------------------
1. Frontend - ABI/Adresse/Implémentation
   - Remplacer l'ABI dans `abi.js` par l'ABI généré pour `SimpleVoting` (après compilation).
   - Mettre à jour `app.js` (ou ajouter `voting.js`) pour :
     - Se connecter au provider (ethers.js ou web3.js).
     - Appeler `getCandidates()` et afficher dynamiquement la liste.
     - Envoyer `vote(candidateId)` et mettre à jour l'affichage des résultats.
   - Définir `contractAddress` (adresse retournée par la migration Truffle) dans le frontend.

2. Migrations
   - Ajouter une migration dédiée pour déployer `SimpleVoting` et afficher son adresse.

3. Tests
   - Écrire des tests JavaScript (Truffle/Mocha) pour `SimpleVoting` :
     - Cas : un participant vote, le compteur augmente.
     - Cas : un même participant essaie de revoter -> revert.
     - Cas : un non-participant vote -> revert (si c'est la règle choisie).

4. Optionnel - amélioration du contrat
   - Ajouter fonctions pour ajouter/supprimer participants et candidats sécurisées par `onlyOwner`.
   - Eventuellement, ajouter un mécanisme d'enregistrement off-chain + proof on-chain si besoin.

Sécurité et limitations
-----------------------
- Le contrat actuel initialise une liste de participants dur-codée dans le constructeur ; pour une vraie application il faut un mécanisme sécurisé d'enregistrement/inscription.
- Les adresses présentes sont des exemples Ganache. En production, gérer l'authentification des électeurs est crucial.
- Les phases empêchent de voter hors période, mais il faut tester les timings et vérifier les conditions de front-running si des fonds sont impliqués.

Livrables attendus
------------------
- `contracts/simple-voting.sol` (smart contract principal).
- `migrations/` : script de déploiement pour `SimpleVoting`.
- `test/` : tests unitaires pour `SimpleVoting`.
- `index.html`, `app.js` (ou `voting.js`) et `abi.js` : frontend connecté au contrat.
- Captures d'écran ou export des résultats après simulation.

Contributeurs et répartition des tâches
------------------------------------
1. Membre 1 — Chef·fe de projet / Coordinateur·rice : Nour BEN REJEB
   - Planification, réunions, suivi des tâches, merge final.
   - Validation des livrables et préparation de la présentation.
2. Membre 2 — Analyste / Spécifications : Harouna BA
   - Définir la liste de candidats, cas d'utilisation et exigences.
   - Rédiger le cahier des charges minimal et le plan de test.
3. Membre 3 — Architecte Smart Contract : Rostom MOUADDEB
   - Concevoir la structure du contrat (structures, événements, accès).
   - Définir la logique anti-double-vote et les méthodes publiques.
4. Membre 4 — Développeur·se Solidity : Souleymane
   - Implémenter le smart contract en Solidity.
   - Ajouter événements, modificateurs et fonctions de vote/comptage.
5. Membre 5 — Testeur·se Smart Contract : Salamata Nourou MBAYE
   - Écrire et exécuter tests unitaires (Hardhat/Truffle).
   - Tester cas limites (double vote, votes invalides).
6. Membre 6 — Déploiement / Environnement de test : Dixy Prevner M POUTOU BABINGUI
   - Configurer Ganache / testnet, scripts de déploiement.
   - Déployer contrat et fournir adresse/ABI pour l’équipe.
7. Membre 7 — Développeur·se Frontend (interface simple) : El Hadji Mamadou SARR
   - Créer interface CLI ou petit formulaire web (HTML/JS).
   - UX minimal pour sélectionner candidat et lancer un vote.
8. Membre 8 — Intégration web3 / Connexion au contrat : Thierno Sadou BARRY
   - Intégrer web3.js / ethers.js pour appeler le contrat.
   - Gérer wallets simulés et récupération des résultats.
9. Membre 9 — Documentation & Guides : Ala TROJETTE
   - Mettre à jour le README, guide d’utilisation et instructions de déploiement.
   - Rédiger les étapes pour reproduire les tests et captures d’écran.
10. Membre 10 — QA finale, simulation et captures : Basak DURGUN DONMEZ
    - Simuler plusieurs utilisateurs, collecter résultats et captures d’écran (NOUR BEN REJEB).
    - Vérifier la cohérence des résultats et préparer le rapport final.

Prochaines étapes recommandées (à court terme)
--------------------------------------------
1. Ajouter une migration Truffle pour déployer `SimpleVoting`.
2. Générer l'ABI de `SimpleVoting` (après compilation) et remplacer `abi.js`.
3. Adapter `app.js` pour appeler `getCandidates()`, `getVotes()` et `vote()`.
4. Écrire 4–6 tests unitaires pour couvrir les cas critiques.

Contact / Support
-----------------
Pour toute question sur le code ou l'intégration, créer une issue dans le dépôt en précisant le fichier concerné (par ex. `contracts/simple-voting.sol` ou `index.html`).

---

Fin du README — version analytique et actionnable.
