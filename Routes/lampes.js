const express = require("express"); //Express
const router = express.Router(); //Utilisation des routes

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
// const urlencodedParser = bodyParser.urlencoded();

const db = require('../config/connexionMysql.cjs'); //Infos connexion BDD
const { ChartBar } = require("lucide-react");

function retourLigne(nbrBr = 1)
{
    for(i = 0; i < nbrBr; i++)
    {
        console.log(" ");
    }
}

router.get('/', (req, res) => {
    const data = {};
    
    const sql = 'SELECT * FROM Lampes;'
    db.query(sql, (err, results) => {
        if(err)
        {
            console.error("Erreur lors de la requete " + err);
            res.status(500).send("Erreur serveur");
            return;            
        }
        else if(results == '')
        {
            console.log("Aucune lampe n'a ete trouvee");
            res.status(404).send({message: "Aucune lampe n'a ete trouvee dans la base de donnees"})
        }
        else
        {
            data.tablettes = results;
            res.json(data);
        }
    });
    retourLigne(2);
});

router.post('/ajouter', (req, res) => {
    const code_hexa = req.body;
    const cl = code_hexa.code_hexa //Récupération du code_hexa dans le body de la requête
    console.log(`Requete post pour ajouter lampe pour code_hexa=${cl}`);
    
  
    // Requête SQL pour vérifier si une lampe avec le code existe
    const verifSql = 'SELECT * FROM Lampes WHERE code_hexa="'+ cl + '";' 

    // Si pas de body "code_hexa" donné
    if(!code_hexa)
    {
        return res.status(400).send({error: "Il est nécessaire de remplir le champs code_hexa"});
    }

    // Envoi de la requête SQL
    db.query(verifSql, (err, result) => {

        // Prise en charge d'erreur (si err)
        if(err)
        {
            console.error("Erreur lors de la verification de la presence d'une lampe avec le code " + cl + "\n Erreur : " + err);
            return res.status(500).send({error: "Erreur serveur"});
        }

        // Sinon si le résultat de la requête SQL n'est pas vide (signifie lampe existante)
        else if(result != "")
        {
            console.error("Il existe deja une lampe avec le code " + cl);
            return res.status(404).send({message: "Il existe déjà une lampe avec le code " + cl});
        }

        // Sinon on peut POST
        else
        {
            console.log("Il n'y a aucune lampe avec le code " + cl);

            // Requête SQL pour insérer un enregistrement dans le champ code_hexa
            const sql = 'INSERT INTO Lampes (code_hexa) VALUES (?);';

            // Envoi de la requête SQL 
            db.query(sql, cl, (err, result) => {

                    // Si err, erreur serveur
                    if(err)
                    {
                        console.error("Erreur lors de l'ajout de la lampe avec le code hexadecimal : " + cl + "\n Erreur: " + err);
                        res.status(500).send({error: "Erreur serveur"});
                    }

                    // Sinon, confirmation d'ajout
                    else
                    {
                        res.status(201).send({message: "Lampe ajoutée avec succès !", id: result.insertId});
                    }
                }
            );
        }
    });
    retourLigne(2); //Retour à la ligne 2 fois dans la console pour améliorer le confort visuel
});

router.patch('/modifier/:cl', (req, res) => {
    const cl = req.params.cl;
    
    const code_hexa = req.body;

    const verfiSql = 'SELECT * FROM Lampes WHERE code_hexa="' + cl + '";';
    if(!code_hexa)
    {
        return res.status(400).send({error: "Il est nécessaire de remplir le champs code_hexa"});
    }

    db.query(verfiSql, (err, result) => {
        if(err)
        {
            console.error("Erreur lors de la verification de la presence d'une lampe avec le code " + cl + "\n Erreur : " + err);
            return res.status(500).send({error: "Erreur serveur"});
        }
        else if(result == "")
        {
            console.error("Il n'existe pas de lampe pour le code hexa " + cl);
            return res.status(404).send({message: "Il n'existe pas de lampe avec le code " + cl});
        }
        else
        {
            console.log("Il y'a une lampe avec le code " + cl);

            const sql = 'UPDATE Lampes SET code_hexa=(?) WHERE code_hexa="' + cl + '";';
            db.query(sql, code_hexa.code_hexa, (err, result) => {
                    if(err)
                    {
                        console.error("Erreur lors de la mise à jour de la lampe avec le code hexadecimal : " + cl + "\n Erreur: " + err);
                        res.status(500).send({error: "Erreur serveur"});
                    }
                    else
                    {
                        res.status(200).send({message: "Lampe mise à jour avec succès !" + `\n Avait comme cl ${cl}, modifié en ${code_hexa.code_hexa}`, nbrAffecte: result.affectedRows});
                    }
                }
            );
        }
    });
    retourLigne(2);
});

router.delete('/supprimer/:cl', (req, res) => {
    const cl = req.params.cl;

    const verifSql = 'SELECT * FROM Lampes WHERE code_hexa="' + cl + '";';

    db.query(verifSql, (err, result) => {
        if(err)
        {
            console.error("Erreur lors de la verification de la presence d'une lampe avec le code " + cl + "\n Erreur : " + err);
            return res.status(500).send({error: "Erreur serveur"});
        }
        else if(result == "")
        {
            console.error("Il n'existe pas de lampe pour le code hexa " + cl);
            return res.status(404).send({message: "Il n'existe pas de lampe avec le code " + cl});
        }
        else
        {
            console.log("Il y'a une lampe avec le code " + cl);

            const sql = 'DELETE FROM Lampes WHERE code_hexa="' + cl + '";';
            db.query(sql, (err, result) => {
                if(err)
                    {
                        console.error("Erreur lors de la suppression de la lampe avec le code hexadecimal : " + cl + "\n Erreur: " + err);
                        res.status(500).send({error: "Erreur serveur"});
                    }
                    else
                    {
                        res.status(200).send({message: "Lampe supprimée avec succès !" + `\n Avait comme cl ${cl}`, nbrAffecte: result.affectedRows});
                    }
                }
            );
        }
    });
    retourLigne(2);
});
module.exports = router;