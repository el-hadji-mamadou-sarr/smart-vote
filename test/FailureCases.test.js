const SimpleVoting = artifacts.require("SimpleVoting");

contract("SimpleVoting - Cas d'échec", (accounts) => {
    let votingInstance;
    const owner = accounts[0];
    const attacker = accounts[1];
    const voter1 = accounts[2];
    const voter2 = accounts[3];
    
    const candidates = ["Amadou", "Demba", "Omar"];

    beforeEach(async () => {
        votingInstance = await SimpleVoting.new(candidates, { from: owner });
    });

    // =======================
    // Tests de sécurité
    // =======================
    describe("Tests de sécurité - Contrôle d'accès", () => {
        it("doit REJETER les actions admin par des non-propriétaires", async () => {
            console.log("\nTest : accès admin non autorisé");
            
            // Tentative d'ouverture par un attaquant
            try {
                await votingInstance.openVoting({ from: attacker });
                assert.fail("FAILURE: L'attaquant a pu ouvrir le vote !");
            } catch (error) {
                console.log("Ouverture non autorisée rejetée");
                assert(error.message.includes("revert"));
            }
            
            // Ouverture légale
            await votingInstance.openVoting({ from: owner });
            
            // Tentative de fermeture par un attaquant
            try {
                await votingInstance.closeVoting({ from: attacker });
                assert.fail("FAILURE: L'attaquant a pu fermer le vote !");
            } catch (error) {
                console.log("Fermeture non autorisée rejetée");
                assert(error.message.includes("revert"));
            }
        });
    });

    // =======================
    // Anti double vote
    // =======================
    describe("Tests anti-double vote", () => {
        beforeEach(async () => {
            await votingInstance.openVoting({ from: owner });
        });

        it("doit EMPÊCHER la même adresse de voter deux fois", async () => {
            console.log("\nTest : prévention du double vote");
            
            // Premier vote
            await votingInstance.vote(0, { from: voter1 });
            console.log("Premier vote accepté");
            
            // Vérifier le statut du votant
            const hasVoted = await votingInstance.hasVoted(voter1);
            assert.equal(hasVoted, true, "Statut du votant non mis à jour");
            
            // Tentative de second vote
            try {
                await votingInstance.vote(1, { from: voter1 });
                assert.fail("CRITIQUE : double vote accepté");
            } catch (error) {
                console.log("Double vote rejeté correctement");
                assert(error.message.includes("revert"));
            }
            
            // Vérifier que le premier vote est toujours compté
            const candidate0 = await votingInstance.getCandidate(0);
            assert.equal(candidate0.votes.toNumber(), 1, "Premier vote perdu");
        });

        it("doit EMPÊCHER le vote sur différents candidats par la même adresse", async () => {
            console.log("\nTest : double vote sur candidats différents");
            
            await votingInstance.vote(1, { from: voter2 });
            
            try {
                await votingInstance.vote(0, { from: voter2 });
                assert.fail("CRITIQUE : double vote accepté");
            } catch (error) {
                console.log("Second vote rejeté");
                assert(error.message.includes("revert"));
            }
        });
    });

    // =======================
    // Entrées invalides
    // =======================
    describe("Tests d'entrées invalides", () => {
        beforeEach(async () => {
            await votingInstance.openVoting({ from: owner });
        });

        it("doit REJETER les votes pour des candidats inexistants", async () => {
            console.log("\nTest : votes pour candidats invalides");
            
            const testCases = [3, 999, 100];
            
            for (let invalidId of testCases) {
                try {
                    await votingInstance.vote(invalidId, { from: accounts[4 + testCases.indexOf(invalidId)] });
                    assert.fail(`Candidat invalide ${invalidId} accepté`);
                } catch (error) {
                    console.log(`Candidat invalide ${invalidId} rejeté`);
                    assert(error.message.includes("revert"));
                }
            }
        });
    });

    // =======================
    // Contrôle des phases
    // =======================
    describe("Tests de contrôle des phases", () => {
        it("doit REJETER les votes hors période de vote", async () => {
            console.log("\nTest : restrictions période de vote");
            
            // Avant ouverture
            try {
                await votingInstance.vote(0, { from: voter1 });
                assert.fail("Vote accepté avant ouverture");
            } catch (error) {
                console.log("Vote avant ouverture rejeté");
                assert(error.message.includes("revert"));
            }
            
            // Ouvrir et fermer
            await votingInstance.openVoting({ from: owner });
            await votingInstance.closeVoting({ from: owner });
            
            // Après fermeture
            try {
                await votingInstance.vote(0, { from: voter1 });
                assert.fail("Vote accepté après fermeture");
            } catch (error) {
                console.log("Vote après fermeture rejeté");
                assert(error.message.includes("revert"));
            }
        });
    });

    // =======================
    // Tests de charge / stress
    // =======================
    describe("Tests de stress", () => {
        it("doit gérer plusieurs tentatives d'attaque simultanées", async () => {
            console.log("\nTest : attaques simultanées");
            
            await votingInstance.openVoting({ from: owner });
            
            // Voter normalement
            await votingInstance.vote(0, { from: voter1 });
            
            // Attaques simultanées de double vote
            const attackPromises = [];
            for (let i = 0; i < 5; i++) {
                attackPromises.push(
                    votingInstance.vote(1, { from: voter1 }).catch(e => e)
                );
            }
            
            const results = await Promise.all(attackPromises);
            
            // Toutes les attaques doivent échouer
            results.forEach((result, index) => {
                if (result.message && result.message.includes("revert")) {
                    console.log(`Attaque ${index + 1} bloquée`);
                } else {
                    assert.fail(`Attaque ${index + 1} réussie`);
                }
            });
            
            // Vérifier l'intégrité du vote
            const candidate0 = await votingInstance.getCandidate(0);
            assert.equal(candidate0.votes.toNumber(), 1, "Comptage des votes corrompu");
        });
    });
});
