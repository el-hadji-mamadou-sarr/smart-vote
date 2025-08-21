const SimpleVoting = artifacts.require("SimpleVoting");

contract("SimpleVoting", (accounts) => {
    let votingInstance;
    const owner = accounts[0];
    const voter1 = accounts[1];
    const voter2 = accounts[2];
    const voter3 = accounts[3];
    const nonVoter = accounts[4];

    // Candidats de test
    const candidates = ["Amadou", "Demba", "Omar"];

    beforeEach(async () => {
        votingInstance = await SimpleVoting.new(candidates, { from: owner });
    });

    // =======================
    // Déploiement
    // =======================
    describe("Déploiement", () => {
        it("Le contrat doit être déployé avec succès", async () => {
            assert(votingInstance.address !== '', "Le contrat n'a pas été déployé correctement");
        });

        it("Le déployeur doit être défini comme propriétaire", async () => {
            const contractOwner = await votingInstance.owner();
            assert.equal(contractOwner, owner, "Le propriétaire n'est pas correct");
        });

        it("Les candidats doivent être initialisés", async () => {
            const candidateCount = await votingInstance.candidateCount();
            assert.equal(candidateCount.toNumber(), 3, "Le nombre de candidats est incorrect");
        });

        it("Les noms des candidats doivent être corrects", async () => {
            const candidateNames = await votingInstance.getCandidates();
            assert.equal(candidateNames[0], "Amadou");
            assert.equal(candidateNames[1], "Demba");
            assert.equal(candidateNames[2], "Omar");
        });
    });

    // =======================
    // Gestion de la phase de vote
    // =======================
    describe("Gestion de la phase de vote", () => {
        it("Le propriétaire peut ouvrir le vote", async () => {
            const tx = await votingInstance.openVoting({ from: owner });
            if (tx.logs.length > 0) {
                assert.equal(tx.logs[0].event, "VotingOpened", "Événement VotingOpened non émis");
                console.log("Vote ouvert avec succès");
            }
        });

        it("Les non-propriétaires ne peuvent pas ouvrir le vote", async () => {
            try {
                await votingInstance.openVoting({ from: voter1 });
                assert.fail("Erreur attendue : ouverture du vote non autorisée");
            } catch (error) {
                console.log("Ouverture par un non-propriétaire rejetée");
                assert(error.message.includes("revert") || error.message.includes("owner"));
            }
        });

        it("Le propriétaire peut fermer le vote", async () => {
            await votingInstance.openVoting({ from: owner });
            const tx = await votingInstance.closeVoting({ from: owner });
            if (tx.logs.length > 0) {
                assert.equal(tx.logs[0].event, "VotingClosed", "Événement VotingClosed non émis");
                console.log("Vote fermé avec succès");
            }
        });
    });

    // =======================
    // Processus de vote
    // =======================
    describe("Processus de vote", () => {
        beforeEach(async () => {
            await votingInstance.openVoting({ from: owner });
        });

        it("Les votes valides sont acceptés", async () => {
            const tx = await votingInstance.vote(0, { from: voter1 });
            if (tx.logs.length > 0) {
                assert.equal(tx.logs[0].event, "VoteCast");
                assert.equal(tx.logs[0].args.voter, voter1);
                assert.equal(tx.logs[0].args.candidateId.toNumber(), 0);
                console.log("Vote valide enregistré pour Amadou");
            }

            const hasVoted = await votingInstance.hasVoted(voter1);
            assert.equal(hasVoted, true, "Statut du votant incorrect");

            const candidate = await votingInstance.getCandidate(0);
            assert.equal(candidate.votes.toNumber(), 1, "Le vote n'a pas été comptabilisé");
        });

        it("Le double vote est empêché", async () => {
            await votingInstance.vote(0, { from: voter1 });
            try {
                await votingInstance.vote(1, { from: voter1 });
                assert.fail("Erreur attendue : double vote non autorisé");
            } catch (error) {
                console.log("Tentative de double vote rejetée");
                assert(error.message.includes("revert") || error.message.includes("voted"));
            }
        });

        it("Les votes pour des candidats invalides sont rejetés", async () => {
            try {
                await votingInstance.vote(999, { from: voter1 });
                assert.fail("Erreur attendue : vote pour candidat invalide");
            } catch (error) {
                console.log("Vote pour candidat invalide rejeté");
                assert(error.message.includes("revert") || error.message.includes("Invalid"));
            }
        });

        it("Le comptage de plusieurs votes est correct", async () => {
            await votingInstance.vote(0, { from: voter1 }); // Amadou
            await votingInstance.vote(1, { from: voter2 }); // Demba
            await votingInstance.vote(0, { from: voter3 }); // Amadou

            const candidate0 = await votingInstance.getCandidate(0);
            const candidate1 = await votingInstance.getCandidate(1);
            const candidate2 = await votingInstance.getCandidate(2);

            assert.equal(candidate0.votes.toNumber(), 2, "Amadou devrait avoir 2 votes");
            assert.equal(candidate1.votes.toNumber(), 1, "Demba devrait avoir 1 vote");
            assert.equal(candidate2.votes.toNumber(), 0, "Omar devrait avoir 0 vote");
        });
    });

    // =======================
    // Résultats et requêtes
    // =======================
    describe("Résultats et requêtes", () => {
        beforeEach(async () => {
            await votingInstance.openVoting({ from: owner });
            await votingInstance.vote(0, { from: voter1 }); // Amadou
            await votingInstance.vote(1, { from: voter2 }); // Demba
            await votingInstance.vote(0, { from: voter3 }); // Amadou
        });

        it("Les nombres de votes sont corrects", async () => {
            const votes = await votingInstance.getVotes();
            assert.equal(votes[0].toNumber(), 2, "Amadou devrait avoir 2 votes");
            assert.equal(votes[1].toNumber(), 1, "Demba devrait avoir 1 vote");
            assert.equal(votes[2].toNumber(), 0, "Omar devrait avoir 0 vote");
        });

        it("Les noms des candidats sont corrects", async () => {
            const candidateNames = await votingInstance.getCandidates();
            assert.equal(candidateNames[0], "Amadou");
            assert.equal(candidateNames[1], "Demba");
            assert.equal(candidateNames[2], "Omar");
        });

        it("Le gagnant est correctement identifié", async () => {
            const winner = await votingInstance.winningCandidate();
            assert.equal(winner.id.toNumber(), 0, "Le gagnant devrait être Amadou");
            assert.equal(winner.name, "Amadou");
            assert.equal(winner.votes.toNumber(), 2, "Amadou devrait avoir 2 votes");
        });

        it("Le statut des votants est correctement suivi", async () => {
            const voter1Status = await votingInstance.hasVoted(voter1);
            const nonVoterStatus = await votingInstance.hasVoted(nonVoter);
            assert.equal(voter1Status, true, "voter1 devrait être marqué comme ayant voté");
            assert.equal(nonVoterStatus, false, "nonVoter ne devrait pas être marqué comme ayant voté");
        });
    });

    // =======================
    // Cas limites et sécurité
    // =======================
    describe("Cas limites et sécurité", () => {
        beforeEach(async () => {
            await votingInstance.openVoting({ from: owner });
        });

        it("Le contrat gère correctement les votes rapides", async () => {
            const promises = [
                votingInstance.vote(0, { from: accounts[5] }),
                votingInstance.vote(1, { from: accounts[6] }),
                votingInstance.vote(0, { from: accounts[7] }),
                votingInstance.vote(2, { from: accounts[8] })
            ];

            await Promise.all(promises);

            const votes = await votingInstance.getVotes();
            const totalVotes = votes[0].toNumber() + votes[1].toNumber() + votes[2].toNumber();
            assert.equal(totalVotes, 4, "Le total des votes devrait être de 4");
            console.log("Votes rapides traités correctement");
        });

        it("L’historique des votes est conservé après fermeture", async () => {
            await votingInstance.vote(0, { from: voter1 });
            await votingInstance.closeVoting({ from: owner });

            const candidate = await votingInstance.getCandidate(0);
            assert.equal(candidate.votes.toNumber(), 1, "L'historique des votes n'est pas conservé");
            console.log("Historique des votes conservé après fermeture");
        });

        it("Impossible de voter après fermeture", async () => {
            await votingInstance.closeVoting({ from: owner });
            try {
                await votingInstance.vote(0, { from: voter1 });
                assert.fail("Erreur attendue : vote interdit après fermeture");
            } catch (error) {
                console.log("Vote après fermeture correctement rejeté");
                assert(error.message.includes("revert"));
            }
        });
    });
});
