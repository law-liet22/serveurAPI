const express = require("express");
const router = express.Router();
const db = require('../config/connexionMysql.cjs');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
// const urlencodedParser = bodyParser.urlencoded();

router.get('/', (req, res) => {
    console.log("Toutes les tablettes demandees");

    const data = {};

    db.query('SELECT * FROM Tablettes; ', (err, results) => {
        console.log("Requete envoyee");

        if (err) {
            console.error("Erreur lors de la requete : ", err);
            res.status(500).send("Erreur serveur");
            return;
        }

        data.tablettes = results;
        res.json(data);
    });
});


router.get('/:id', (req, res) => {
    const id = req.params.id;
    // console.log("Demande de la tablette avec le code barre : " + id);

    const data = {};

    db.query('SELECT * FROM Tablettes WHERE codeBarre =' + id + ';', (err, result) => {

        console.log("Requete envoyee");
        if (err) {
            console.error('Erreur lors de l\'obtention de la tablette : ' + id);
            res.status(500).send({ error: 'Erreur serveur' });
        }
        else {
            console.log("Obtention des tablettes");

            data.tablette = result;
            res.json(data);
        }
    });
});

router.post('/', (req, res) => {
    const { estEmpruntee, dateDernierEmprunt, dernierNiveauBatterie, codeBarre } = req.body;

    if (!estEmpruntee || !dateDernierEmprunt || !dernierNiveauBatterie || !codeBarre) {
        return res.status(400).send({ error: 'Tous les champs sont obligatoires : estEmpruntee, dateDernierEmprunt, dernierNiveauBatterie, codeBarre' });
    }

    const sql = 'INSERT INTO Tablettes (estEmpruntee, dateDernierEmprunt, dernierNiveauBatterie, codeBarre) VALUES (?, ?, ?, ?);';
    db.query(sql, [estEmpruntee, dateDernierEmprunt, dernierNiveauBatterie, codeBarre], (err, result) => {

        if (err) {
            console.error('Erreur lors de l\'ajout de l\'utilisateur : ', err);
            res.status(500).send({ error: 'Erreur serveur' });
        }
        else {
            res.status(201).send({ message: 'Utilisateur ajoute avec succes !', id: result.inserId });
        }
    });
});

router.patch('/update-tablette/:nom/codeBarre/:cb', (req, res) => {
    const cb = req.params.cb;
    const nom = req.params.nom;
    console.log("Demande modification code barre");
    const data = {};

    const sql = 'UPDATE Tablettes SET codeBarre=' + cb + ' WHERE nomTablette="' + nom + '";';
    db.query(sql, (err, result) => {
    console.log("Entree dans la requete");
        if (err) {
            console.error('Erreur lors de la modification de la tablette : ' + nom);
	    console.log(err);
            res.status(500).send({ error: 'Erreur serveur' });
        }
        else {
            console.log("Modification du code barre de la tablette " + nom);

	    console.log(result);
            data.tablette = result;
            res.json(data);
        }
    });
});

module.exports = router;
