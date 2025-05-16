const express = require("express");
const router = express.Router();
const db = require('../config/connexionMysql.cjs');
const req = require("express/lib/request");

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
// const urlencodedParser = bodyParser.urlencoded();

router.get('/', (req, res) => {
    const data = {};

    db.query('SELECT * FROM Oeuvres ', (err, results) => {
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

router.get('/oeuvreLifi:cl', (req, res) => { 
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
                res.status(404).send({message: "Il n'y a pas d'oeuvre avec cet identifiant hexa"});
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

    const sql = 'SELECT id, nom_oeuvre, code_hexa FROM Oeuvres;';

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
                console.log("Description de l'oeuvre non trouvee pour l'oeuvre avec le code hexa : " + cl);
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
module.exports = router;
