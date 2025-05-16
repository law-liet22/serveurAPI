const express = require("express");
const router = express.Router();
const db = require('../config/connexionMysql.cjs');

function retourLigne(nbrBr = 1)
{
    for(i = 0; i < nbrBr; i++)
    {
        console.log(" ");
    }
}

router.get('/', (req, res) => {
    let data = {};

    retourLigne(1);
    db.query('SELECT * FROM Tablettes ', (err, results) => {
        if (err) 
        {
            console.error("Erreur lors de la requete:", err);
            res.status(500).send("Erreur serveur");
            return;
        }
        //res.json(results);
        data.tablettes =  results;
        console.log("Obtention des donnees des tablettes");
        retourLigne(1);
        
            //res.json(data);
        db.query('SELECT * FROM Oeuvres ', (err, results) => {
            if (err) 
            {
                console.error("Erreur lors de la requ  te:", err);
                res.status(500).send("Erreur serveur");
                return;
            }
            //res.json(results);
            data.oeuvres = results;
            console.log("Obtention des donnees des oeuvres");
            retourLigne(1);
            //res.json(data);

            db.query('SELECT * FROM Emprunts ', (err, results) => {
                if (err) 
                {
                    console.error("Erreur lors de la requ  te:", err);
                    res.status(500).send("Erreur serveur");
                    return;
                }
                //res.json(results);
                data.emprunts = results;
                console.log("Obtention des donnees des emprunts");
                retourLigne(1);
                res.json(data);
            });
        });
    });
});

router.post('/', (req, res) => {
    res.send("Test");
});

module.exports = router;