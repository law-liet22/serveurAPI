const express = require("express");
const router = express.Router();
const db = require('../config/connexionMysql.cjs');
const req = require("express/lib/request");

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
// const urlencodedParser = bodyParser.urlencoded();

router.get('/', (req, res) => {
    const data = {};

    db.query('SELECT * FROM compteEmployes', (err, results) => {
        if (err) {
            console.error("Erreur lors de la requete : ", err);
            res.status(500).send("Erreur serveur");
            return;
        }
        else if(results == '')
        {
            console.log("Aucun compte n'a ete trouve");
            res.status(404).send({message: "Aucun compte n'a ete trouvé dans la base de données"})
        }
        else
        {
            data.comptes = results;
            res.json(data);
        }
    });
});

router.post('/verif', (req, res) => {
    const data = {};

    const {email, password } = req.body;

    if(!email || !password)
    {
        return(res.status(400).send({message: `Les champs email et password sont obligatoires.`}));
    }

    const sql = `SELECT email, motDePasse FROM compteEmployes WHERE email='${email}' 
    AND motDePasse = '${password}';`;

    db.query(sql, (err, results) => {
        console.log(`Requete envoyee pour savoir si le compte avec l'email ${email} existe et si le mot 
        de passe correspond.`);

        if(err)
        {
            console.error(`Erreur lors de l'obtention des informations de compte utilisateur`);
            res.status(500).send({error: "Erreur serveur"});
        }
        else if(results == "")
        {
                console.log(`Mot de passe ou email incorrect`);
                res.status(404).send({message: `L'email ou le mot de passe est incorrect`});
        }
        else
        {
            console.log(`L'utilisateur avec l'email ${email} existe`);
            return res.status(200).send({message: `Les informations de conenxion sont bien correctes.`})
        }
    });
});

module.exports = router;