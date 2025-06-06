const express = require("express");
const router = express.Router();
const db = require('../config/connexionMysql.cjs');
const req = require("express/lib/request");

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
// const urlencodedParser = bodyParser.urlencoded();

router.get('/', (req, res) => {
    const data = {};

    db.query(`SELECT id AS id_oeuvre, nom_oeuvre, nom_auteur, date_oeuvre, description, code_hexa AS id_hexa, 
        url FROM Oeuvres;`, (err, results) => {
        if (err) {
            console.error("Erreur lors de la requete : ", err);
            res.status(500).send("Erreur serveur");
            return;
        }
        else if(results == '')
        {
            console.log("Aucune oeuvre n'a ete trouvee");
            res.status(404).send({message: "Aucune oeuvre n'a ete trouvee dans la base de donnees"})
        }
        else
        {
            data.oeuvres = results;
            res.json(data);
        }
    });
});

router.get('/oeuvreLifi/:cl', (req, res) => { 
    const cl = req.params.cl;
    const data={};

    const sql = 'SELECT * FROM Oeuvres WHERE code_hexa="' + cl + '";';
    db.query(sql, (err, result) => {
        console.log("Requete envoyée pour obtenir oeuvre avec lifi");

        if(err)
        {
            console.error("Erreur lors de l'obtention de l'oeuvre");
            res.status(500).send({error: "Erreur serveur"});
        }
        else
        {
            console.log("Obtention de l'oeuvre");
            data.oeuvres = result;
            res.json(data);
        }
        
    });
});

// router.put('/update-lifi/:clifi', (res, req) => {
//     console.log("Appel de la mise a jour du code lifi");
    
//     const cl = req.params.clifi;
//     const nouveauCode = req.body;

//     if(!nouveauCode)
//     {
//         return(res.status(400).send({error: 'Le champs est obligatoire : nouveauCodeHexa'}));
//         console.error("Erreur lors de la modification du code hexadecimal d'une oeuvre : " + cl + " avec le nouveau code " + nouveauCode + ".");
//     }
//     else
//     {
//         const sql = 'UPDATE Oeuvres SET code_hexa=' + nouveauCode + 'WHERE code_hexa=' + cl + ';';
//         console.log("Code lifi mis a jour");
//     }
// });

router.post('/', (req, res) => {
    const { nomOeuvre, nomAuteur, dateOeuvre, descriptionOeuvre } = req.body;

    if (!nomOeuvre || !nomAuteur || !dateOeuvre || !descriptionOeuvre) {
        return (res.status(400).send({ error: 'Tous les champs sont obligatoires : nomOeuvre, nomAuteur, dateOeuvre, descriptionOeuvre.' }));
    }

    const sql = 'INSERT INTO Oeuvres nom_oeuvre, nom_auteur, date_oeuvre, description VALUES (?, ?, ?, ?)';
    db.query(sql, [nomOeuvre, nomAuteur, dateOeuvre, descriptionOeuvre], (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'ajout de l\'oeuvre : ', err);
            res.status(500).send({ error: 'Erreur serveur' });
        }
        else {
            res.status(201).send({ message: 'Oeuvre ajoutée avec succès !', id: result.insertId })
        }
    });
});

router.get('/nom/oeuvre/:cl', (req, res) => {
    const cl = req.params.cl;
    const data = {};

    const sql = 'SELECT nom_oeuvre FROM Oeuvres WHERE code_hexa="' + cl + '";';

    db.query(sql, (err, result) => {
        console.log("Requete envoyée pour obtenir le nom de l'oeuvre avec le code " + cl);

        if(err)
        {
            console.error("Erreur lors de l'obtention du nom de l'oeuvre");
            res.status(500).send({error: "Erreur serveur"});
        }
        else
        {
            if(result == "")
            {
                console.log("Nom de l'oeuvre non trouve pour l'oeuvre avec le code hexa " + cl);
                res.status(404).send({message: "Il n'y a pas d'oeuvre avec cet identifiant hexa"})
            }  
            else
            {
                console.log("Obtention du nom de l'oeuvre");
                data.oeuvres = result;
                res.json(data);
            }
        }
    });
});


router.get('/nom/auteur/:cl', (req, res) =>
{
    const cl = req.params.cl;
    const data = {};

    const sql = 'SELECT nom_auteur FROM Oeuvres WHERE code_hexa="' + cl + '";';

    db.query(sql, (err, result) => {
        console.log("Requete envoyee pour obtenir le nom de l'auteur de l'oeuvre avec le code " + cl);
        
        if(err)
        {
            console.error("Erreur lors de l'obtention du nom de l'auteur de l'oeuvre");
            res.status(500).send({error: "Erreur serveur"});
        }
        else
        {
            if(result == "")
            {
                console.log("Nom d'auteur non trouve pour l'oeuvre avec le code hexa " + cl);
                res.status(404).send({message: "Il n'y a pas d'oeuvre avec cet identifiant hexa"});
            }
            else
            {
                console.log("Obtention du nom de l'auteur de l'oeuvre");
                data.oeuvres = result;
                res.json(data);
            }
        }
    });
});

router.get('/date/:cl', (req, res) => {
    const cl = req.params.cl;
    const data = {};

    const sql = 'SELECT date_oeuvre FROM Oeuvres WHERE code_hexa="' + cl + '";';

    db.query(sql, (err, result) => {
        console.log("Requete envoyee pour obtenir la date de l'oeuvre avec le code " + cl);
        
        if(err)
        {
            console.error("Erreur lors de l'obtention de la date de l'oeuvre");
            res.status(500).send({error: "Erreur serveur"});
        }
        else
        {
            if(result == "")
            {
                console.log("Date de l'oeuvre non trouvee pour l'oeuvre avec le code hexa : " + cl);
                res.status(404).send({message: "Il n'y a pas d'oeuvre avec cet identifiant hexa"});
            }
            else
            {
                console.log("Obtention de la date de l'oeuvre");
                data.oeuvres = result;
                res.json(data);
            }
        }
    });
});

router.get('/desc/:cl', (req, res) => {
    
    const cl = req.params.cl;
    const data = {};

    const sql = 'SELECT description FROM Oeuvres WHERE code_hexa="' + cl + '";';

    db.query(sql, (err, result) => {
        console.log("Requete envoyee pour obtenir la description de l'oeuvre " + cl);

        if(err)
        {
            console.error("Erreur lors de l'obtention de la description de l'oeurve " + cl);
            res.status(500).send({error: "Erreur serveur"});
        }
        else
        {
            if(result == "")
            {
                console.log("Description de l'oeuvre non trouvee pour l'oeuvre avec le code hexa : " + cl);
                res.status(404).send({message: "Il n'y a pas d'oeuvre avec cet identifiant hexa. Vérifiez votre entrée."});
            }
            else
            {
                console.log("Obtention de la description de l'oeuvre");
                data.oeuvres = result;
                res.json(data); 
            }           
        }
    });
});

router.get('/id', (req, res) => {
    const data = {};

    const sql = `SELECT Oeuvres.id AS id_oeuvre, nom_oeuvre, Lampes.code_hexa FROM Oeuvres
    INNER JOIN Lampes ON Oeuvres.code_hexa = Lampes.id;`;

    db.query(sql, (err, result) => {
        console.log("Requete envoyee pour obtenir les oeuvres (id, nom, code_hexa) ");

        if(err)
        {
            console.error("Erreur lors de l'obtention des oeuvres");
            res.status(500).send({error: "Erreur serveur"});
        }
        else
        {
            if(result == "")
            {
                console.log("Identifiants de l'oeuvre non trouves");
                res.status(404).send({message: "Il n'y a pas d'oeuvres"});
            }
            else
            {
                console.log("Obtention de l'id, nom et le code hexe de toutes les oeuvres");
                data.oeuvres = result;
                res.json(data.oeuvres); 
            }           
        }
    });
});

router.get('/liens', (req, res) => {
    const data = {};

    const sql = 'SELECT url, nom_oeuvre FROM Oeuvres;'

    db.query(sql, (err, result) => {
        console.log("Requete envoyee pour recuperer les liens des oeuvres");

        if(err)
        {
            console.error("Erreur lors de l'obtention des oeuvres");
            res.status(500).send({error: "Erreur serveur"});
        }
        else
        {
            if(result.length==0)
            {
                console.log("Aucune URL trouvee");
                res.status(404).send({message: "Il n'y a pas d'oeuvre avec une URL"});
            }
            else
            {
                console.log("Obtention de chaque URL");
                data.oeuvres = result;
                res.json(data.oeuvres); 
            }           
        }
    });
});

router.put('/modifier/:id', (req, res) => {
    const id = req.params.id;
    const nom_oeuvre = req.body.nom_oeuvre;
    const nom_auteur = req.body.nom_auteur;
    const date_oeuvre = req.body.date_oeuvre;
    const code_hexa = req.body.code_hexa;
    const url = req.body.url;
    const description = req.body.description;

    const sql = `UPDATE Oeuvres SET nom_oeuvre='${nom_oeuvre}', nom_auteur='${nom_auteur}', date_oeuvre='${date_oeuvre}', description="${description}", url='${url}' WHERE id=${id};`;

     if(!nom_oeuvre || !nom_auteur || !date_oeuvre || !url || !description)
     {
        return res.status(400).send({error: `Tous les champs sont obligatoires.`});
     }

     db.query(sql, (err, result) => {
        if(err)
        {
            console.error("Erreur lors de la mise à jour d'une oeuvre : ", err);
            return res.status(500).send({error: "Erreur serveur"});
        }
        
        return res.status(201).send({message: `Modification effectuée pour l'oeuvre dont l'id est ${id}.`});
     });
});

module.exports = router;
