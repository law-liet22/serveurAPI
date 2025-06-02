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
        if(result.length <= 0)
        {
            res.status(404).send({messagel: `Aucune tablette avec le code-barre ${id} n'a été trouvée.`});
        }
        else {
            console.log("Obtention des tablettes");

            data.tablette = result;
            res.json(data);
        }
    });
});

router.patch('/codeBarre/:nomTab', (req, res) => {
    const { codeBarre } = req.body;
    const nomTab = req.params.nomTab;

    if (!codeBarre) {
        return res.status(400).send({ error: 'Tous les champs sont obligatoires : codeBarre' });
    }

    const sql = `UPDATE Tablettes SET codeBarre='${codeBarre}' WHERE nomTablette='${nomTab}';`;
    db.query(sql, (err, result) => {

        if (err) {
            console.error("Erreur lors de la modification du code barre de la tablette", err);
            res.status(500).send({ error: 'Erreur serveur' });
        }
        else {
            res.status(201).send({ message: 'Tablette modifiée avec succès !', id: result.inserId });
        }
    });
});

router.patch('/nom/:cb', (req, res) => {
    const nomTablette = req.body;
    const cb = req.params.cb;

    if(!nomTablette)
    {
        return res.status(400).send({ error: 'Tous les champs sont obligatoires : nomTablette' });
    }

    const sqlVerif = `SELECT * FROM Tablettes WHERE codeBarre=${cb};`;

    db.query(sqlVerif, (errV, resultV) => {
        if(errV)
        {
            console.error("Erreur lors de la modification du nom de la tablette", errV);
            res.status(500).send({ error: 'Erreur serveur' });
        }
        else if(resultV.length <= 0)
        {
            return res.status(404).send({message: `Il n'y a aucune tablette avec le code barre ${cb}.`});
        }
        else
        {
            const sql = `UPDATE Tablettes SET ? WHERE codeBarre='${cb}';`;
            db.query(sql, [nomTablette], (err, result) => {
                if(err)
                {
                    console.error("Erreur lors de la modification du nom de la tablette", err);
                    res.status(500).send({ error: 'Erreur serveur' });
                }
                else
                {
                    res.status(201).send({ message: 'Tablette modifiée avec succès !', id: result.inserId });
                }
            });
        }
    });
});

router.post('/', (req, res) => {
    const { nomTablette, codeBarre } = req.body;

    if(!nomTablette || !codeBarre)
    {
        return res.status(400).send({error: `Tous les champs sont obligatoires : nomTablette, codeBarre`});
    }
    const sql = `INSERT INTO Tablettes (nomTablette, codeBarre) VALUES (?, ?)`;

    db.query(sql, [nomTablette, codeBarre], (err, result) => {
        if(err)
        {
            console.error(`Erreur lors de l'ajout de la tablette`, err);
            res.status(500).send({ error: 'Erreur serveur' });
        }
        else
        {
            res.status(201).send({message: `Tablette ajoutée avec succès`})
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

router.patch('/emprunt/:cb', (req, res) => {
    const estEmpruntee = req.body;
    const cb = req.params.cb;

    if(!estEmpruntee)
    {
        return res.status(400).send({error: `Tous les champs sont obligatoires : nomTablette, codeBarre`});
    }

    const sqlVerif = `SELECT * FROM Tablettes WHERE codeBarre='${cb}';`;

    db.query(sqlVerif, (errV, resultV) => {
        if(errV)
        {
            console.error(`Erreur lors de l'ajout de la tablette`, errV);
            res.status(500).send({ error: 'Erreur serveur' });
        }
        else if(resultV <= 0)
        {
            console.log(`Aucune tablette n'a ete trouvee avec le code barre ${cb}.`);
            return res.status(404).send({message: `Aucune tablette n'a été trouvée avec le code barre  ${cb}.`})
        }
        else
        {
            const sql = `UPDATE Tablettes SET ? WHERE codeBarre='${cb}';`;
            db.query(sql, estEmpruntee, (err, result) => {
                if(err)
                {
                    console.error(`Erreur lors de l'ajout de la tablette`, err);
                    res.status(500).send({ error: 'Erreur serveur' });
                }
                else
                {
                    res.status(201).send({message: `Statut de l'emprunt modifié avec succès.`})
                }
            });
        }
    });
});

module.exports = router;
