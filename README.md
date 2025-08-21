Smart Contract
Objectif fonctionnel

Gérer un scrutin simple et fiable où chaque électeur ne peut voter qu’une seule fois, avec publication transparente des résultats pour les trois candidats Amadou, Demba et Omar.

Modèle de données

Entités et états internes du contrat :

Candidats

Identifiant du candidat

Nom du candidat

Total des voix

Électeurs

Adresse de l’électeur

Statut a-voté (vrai/faux)

Paramètres de scrutin

Propriétaire/administrateur du contrat

Statut du scrutin (ouvert/fermé)

Horodatages d’ouverture et de clôture (optionnel)

Règles métier et invariants

Un électeur ne peut voter qu’une seule fois.

Un vote n’est accepté que si le scrutin est ouvert.

Un vote doit cibler un candidat valide.

Les résultats sont la somme des voix par candidat et sont consultables à tout moment.

Les opérations d’administration (ouverture, clôture, éventuelle réinitialisation) sont réservées au propriétaire.

Interface externe (points d’entrée)

Sans code, description des appels attendus :

Initialiser les candidats

Paramètre : liste des noms ou identifiants pour Amadou, Demba, Omar

Accès : propriétaire uniquement

Ouvrir le scrutin

Effet : passe le statut à ouvert

Accès : propriétaire uniquement

Voter

Paramètre : identifiant du candidat

Effets : marque l’électeur comme ayant voté et incrémente le compteur du candidat

Accès : tout compte autorisé à voter

Clore le scrutin

Effet : passe le statut à fermé

Accès : propriétaire uniquement

Consulter les résultats

Retour : pour chaque candidat, nombre de voix et rang

Accès : public

Consulter l’état d’un électeur

Retour : a-voté vrai/faux pour une adresse donnée

Accès : public

Événements à journaliser

ScrutinOuvert (horodatage)

ScrutinClos (horodatage)

CandidatCree (identifiant, nom)

VoteEnregistre (adresse électeur, identifiant candidat)

Contrôles et validations

Vérifier que le scrutin est ouvert avant d’enregistrer un vote.

Vérifier que l’adresse n’a pas déjà voté.

Vérifier que l’identifiant du candidat existe.

Protéger les fonctions d’administration par contrôle du propriétaire.

Gestion d’erreurs explicites et messages clairs.

Sécurité

Prévenir le double vote via un registre a-voté indexé par adresse.

Immuabilité des résultats déjà comptabilisés.

Journalisation des événements pour audit.

Pas de logique de transfert de fonds (scrutin sans tokens) pour réduire la surface d’attaque.

Optionnel : liste blanche d’électeurs si nécessaire (par exemple pour un test fermé).

Performance et coût

Comptage par incrément direct pour lecture O(1).

Accès en lecture aux résultats par candidat sans boucles coûteuses.

Limiter les écritures à une seule mise à jour par vote (statut électeur + compteur candidat).

Pas de structures de données dynamiques inutiles pendant le vote.

Cycle de vie du scrutin

Déploiement et initialisation des candidats Amadou, Demba, Omar.

Ouverture officielle du scrutin.

Période de vote : chaque adresse vote une fois pour un candidat valide.

Clôture du scrutin par le propriétaire.

Consultation des résultats finaux (toujours disponibles en lecture).

Hypothèses et limites

Un vote = une adresse. Pour des identités fortes, un registre d’adresses autorisées peut être ajouté.

Pas de modification des candidats après l’ouverture.

Pas de révocation ni de changement de vote pour simplifier l’implémentation.

Tests attendus

Initialisation crée trois candidats valides.

Vote unique par adresse : second vote rejeté.

Vote sur candidat inexistant rejeté.

Vote rejeté si scrutin fermé.

Résultats cohérents avec les votes émis.

Événements émis aux moments clés (création candidats, vote, ouverture/fermeture).

Traçabilité des rôles

Propriétaire/administrateur : initialise candidats, ouvre et clôt le scrutin.

Électeur : appelle l’opération de vote une fois.

Observateur : consulte à tout moment l’état et les résultats.

Livrables côté contrat

Spécification de l’interface (noms des fonctions, paramètres, événements).

Adresse de déploiement et réseau cible.

Journal d’événements clé pour audit.

Sortie des résultats à la clôture (tableau des voix par candidat).

***Logique Anti-Double-Vote et Méthodes Publiques
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
