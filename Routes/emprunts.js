const express = require("express"); //Express
const router = express.Router(); //Utilisation des routes

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
// const urlencodedParser = bodyParser.urlencoded();

const db = require('../config/connexionMysql.cjs'); //Infos connexion BDD

function retourLigne(nbrBr = 1)
{
    for(i = 0; i < nbrBr; i++)
    {
        console.log(" ");
    }
}



router.get('/', (req, res) => { //Get tous les emprunts
    const data = {};

    db.query('SELECT * FROM Emprunts ', (err, results) => {
        if (err) {
            console.error("Erreur lors de la requete : ", err);
            res.status(500).send("Erreur serveur");
            return;
        }
        // test
        data.emprunts = results;
        retourLigne(2);
        res.json(data);
    });
});

router.post('/', (req, res) => {
    // const { nomVisiteur, prenomVisiteur, mailVisiteur, tabletteEmpruntee } = req.body;
    const nomVisiteur = req.body.nomVisiteur;
    const prenomVisiteur = req.body.prenomVisiteur;
    const mailVisiteur = req.body.mailVisiteur;
    const tabletteEmpruntee = req.body.tabletteEmpruntee;

    if (!nomVisiteur || !prenomVisiteur || !mailVisiteur || !tabletteEmpruntee) {
        console.log(req);
        
        return (res.status(400).send({ error: 'Tous les champs sont obligatoires : nom, prenom, mail, photo, tablette.' }));
    }
    else {
        const date = new Date(); // Obtenir la date actuelle
        const year = date.getFullYear(); // Obtenir l'année
        const mounth = String(date.getMonth() + 1).padStart(2, '0'); // Mois (0 à 11) + 1 puis complète avec 0 (si besoin)
        const day = String(date.getDate()).padStart(2, '0'); // Jour du mois, complété avec 0 si besoin

        const dateActuelle = `${year}-${mounth}-${day}`;

        const sql = 'INSERT INTO Emprunts (nomVisiteur, prenomVisiteur, mailVisiteur, tabletteEmpruntee) VALUES (?, ?, ?, ?);';
        const sqlEmpr = `UPDATE Tablettes SET estEmpruntee='1', dateDernierEmprunt='${dateActuelle}' WHERE codeBarre='${tabletteEmpruntee}';`;
        

        db.query(sql, [nomVisiteur, prenomVisiteur, mailVisiteur, tabletteEmpruntee], (err, result) => {
            if (err) {
                console.error('Erreur lors de l\'ajout de l\'emprunt : ', err);
                return res.status(500).send({ error: 'Erreur serveur' });
            }
            else 
            {
                db.query(sqlEmpr, (errE, reultE) => {
                    if(errE)
                    {
                        console.error('Erreur lors de l\'ajout de l\'emprunt : ', err);
                        return res.status(500).send({ error: 'Erreur serveur' });  
                    }
                });
                res.status(201).send({ message: "Emprunt ajouté avec succes !", id: result.inserId });
            }
        });
    }
});

router.patch('/restitution/:cb', (req, res) => {
    const codeBarre = req.params.cb;

    const sql = `UPDATE Tablettes SET estEmpruntee='0' WHERE codeBarre='${codeBarre}';`;

    db.query(sql, (err, result) => {
        if(err)
        {
            console.error('Erreur lors de la restitution de l\'emprunt : ', err);
            return res.status(500).send({ error: 'Erreur serveur' });
        }

        return res.status(201).send({message: `Restitution enregistrée.`});
    });
});

router.post('/codeBarre', jsonParser, (req, res) => {
    const cb = req.body;

    if(!cb)
    {
        return res.status(400).send({ error: 'Le champ code barre est obligatoire' });   
    }
    else
    {
        const sql = 'INSERT INTO Emprunts (tabletteEmpruntee) VALUES (?);';
        // console.log(sql);
        

        db.query(sql, cb, (err, result) => {
            if(err)
            {
                console.log("Erreur lors de l'ajout du code barre tablette : " + err);
                console.log(sql);
                
                res.status(500).send({ error: 'Erreur serveur' });
                return;
            }
            else
            {
                res.status(201).send({ message: "Code barre ajouté avec succès !", id: result.inserId });
            }
        });
    }
});

router.get('/tablette/:num', (req, res) => { //Get la tablette associée à l'emprunt num
    const num = req.params.num;
    const data = {};

    const sql = 'SELECT tabletteEmpruntee FROM Emprunts WHERE numeroEmprunt="' + num + '";';

    db.query(sql, (err, result) => {
        console.log("Requete pour obtenir le numero de la tablette empruntee au numeroEmprunt " + num);
        
        if(err)
        {
            console.log("Erreur lors de l'obtention de la tablette empruntee");
            res.status(500).send({error: "Erreur serveur"});
        }
        else
        {
            if(result == "")
            {
                console.log("Tablette non trouvee pour le numero de l'emprunt " + num);
                res.status(404).send({message: "Il n'existe pas de tablette empruntee pour ce numero d'emprunt"});
            }
            else
            {
                console.log("Obtention de la tablette qui est empruntee pour le numero " + num);
                data.emprunt = result;
                retourLigne(2);
                res.json(data);
            }
        }
    });
});

router.get('/visiteur/identite/:num', (req, res) => {
    const num = req.params.num;
    const data = {};

    const sql = 'SELECT nomVisiteur, prenomVisiteur, mailVisiteur, photoVisiteur FROM Emprunts WHERE numeroEmprunt="' + num + '";';

    db.query(sql, (err, result) => {
        console.log("Requete pour obtenir l'identite du visiteur avec le numero de l'emprunt : " + num);

        if(err)
        {
            console.log("Erreur lors de l'obtention de l'identite du visiteur");
            res.status(500).send({error: "Erreur serveur"});            
        }
        else
        {
            if(result == "")
            {
                console.log("Identite du visiteur non trouve pour le numero d'emprunt : " + num);
                res.status(404).send({message: "Il n'y a pas d'identite pour ce numero d'emprunt"});
            }
            else
            {
                console.log("Obtention de l'identite du visiteur pour le numero : " + num);
                data.emprunt = result;
                retourLigne(2);
                res.json(data);
            }
        }
        
    });
});

router.get('/date/emprunt/:num', (req, res) => {
    const num = req.params.num;
    const data = {};

    const sql = 'SELECT dateEmprunt FROM Emprunts WHERE numeroEmprunt="' + num + '";';

    db.query(sql, (err, result) => {
        console.log("Requete pour demander date d'emprunt de l'emprunt numero " + num);

        if(err) 
        {
            console.log("Erreur lors de l'obtention de la date d'emprunt");
            res.status(500).send({error: "Erreur serveur"});
        }
        else
        {
            if(result == "")
            {
                console.log("Date d'emprunt du visiteur non trouvee pour le numero d'emprunt : " + num);
                res.status(404).send({message: "Il n'y a pas de date d'emprunt pour ce numero d'emprunt"});
            }
            else
            {
                console.log("Obtention de la date d'emprunt du visiteur pour le numero : " + num);
                data.emprunt = result;
                retourLigne(2);
                res.json(data);
            }
        }
    });
});

router.get('/date/rendu/:num', (req, res) => {
    const num = req.params.num;
    const data = {};

    const sql = 'SELECT dateRendu FROM Emprunts WHERE numeroEmprunt="' + num + '";';

    db.query(sql, (err, result) => {
        console.log("Requete pour demander date de rendu de l'emprunt numero " + num);

        if(err) 
        {
            console.log("Erreur lors de l'obtention de la date de rendu");
            res.status(500).send({error: "Erreur serveur"});
        }
        else
        {
            if(result == "")
            {
                console.log("Date de rendu du visiteur non trouvee pour le numero d'emprunt : " + num);
                res.status(404).send({message: "Il n'y a pas de date de rendu pour ce numero d'emprunt"});
            }
            else
            {
                console.log("Obtention de la date de rendu du visiteur pour le numero : " + num);
                data.emprunt = result;
                retourLigne(2);
                res.json(data);
            }
        }
    });
});

router.get('/dates/:num', (req, res) => {
    const num = req.params.num;
    const data = {};

    const sql = 'SELECT dateEmprunt, dateRendu FROM Emprunts WHERE numeroEmprunt="' + num + '";';

    db.query(sql, (err, result) => {
        console.log("Requete pour demander les dates de l'emprunt numero " + num);

        if(err) 
        {
            console.log("Erreur lors de l'obtention des dates");
            res.status(500).send({error: "Erreur serveur"});
        }
        else
        {
            if(result == "")
            {
                console.log("Dates du visiteur non trouvees pour le numero d'emprunt : " + num);
                res.status(404).send({message: "Il n'y a pas de dates pour ce numero d'emprunt"});
            }
            else
            {
                console.log("Obtention de dates du visiteur pour le numero : " + num);
                data.emprunt = result;
                retourLigne(2);
                res.json(data);
            }
        }
    });
});


module.exports = router;