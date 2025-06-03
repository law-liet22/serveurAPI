const express = require("express");
const router = express.Router();
const db = require('../config/connexionMysql.cjs');
const req = require("express/lib/request");

const bcrypt = require('bcrypt'); // Module de hashage
const saltRounds = 10; // Nombre de tours pour le sel

async function hashPassword(plainPassword) // Fonction pour hasher un mdp
{
    const hash = await bcrypt.hash(plainPassword, saltRounds); // Hash avec un sel
    return hash; // Retourne la valeur hashée
}

async function verifyPassword(plainPassword, hashedPassword) // Fonction pour vérifier un mdp lors de connexion
{
    const match = await bcrypt.compare(plainPassword, hashedPassword); // On compare les deux versions
    return match; // True si bon, False si non
}

function getPassword(email) {
  return new Promise((resolve, reject) => {
    // On prépare la requête SQL pour récupérer le mot de passe haché
    const sql = `SELECT motDePasse FROM compteEmployes WHERE email ='${email}'`;

    // On utilise un paramètre ? pour éviter l'injection SQL
    db.query(sql, (err, result) => {   
      if (err) {
        // En cas d'erreur SQL, on rejette la promesse
        return reject(err);
      }

      if (result.length === 0) {
        // Si aucun résultat, on rejette aussi
        return reject(new Error("Aucun utilisateur trouvé avec cet email"));
      }

      // Sinon, on résout la promesse avec le mot de passe haché
      resolve(result[0].motDePasse);
    });
  });
}


async function newUser(req, res)
{
    const email = req.body.email;
    const password = req.body.password;
    const typeCompte = req.body.typeCompte;

    if(!email || ! password || !typeCompte)
    {
        res.status(403).send({error: `Tous les champs sont obligatoires.`});
    }

    const motDePasse = await hashPassword(password);

    const sql = `INSERT INTO compteEmployes (email, motDePasse, typeCompte) VALUES (?, '${motDePasse}', '${typeCompte}');`;
    
    db.query(sql, [email], (err, result) => {
        if(err)
        {
            console.error(`Erreur lors de l'enregistrement des informations de compte utilisateur : `, err);
            return res.status(500).send({error: "Erreur serveur"});
        }
        
        res.status(201).send({message: `Utilisateur enregistré avec succès dans la base de données.`});
    });
}

async function verifyUser(req, res)
{
    const email = req.body.email;
    const password = req.body.password;

    if(!email || !password)
    {
        return(res.status(400).send({message: `Les champs email et password sont obligatoires.`}));
    }

    const emailHash = await getPassword(email);
    const verifSql = `SELECT motDePasse FROM compteEmployes WHERE email='${email}';`;
    const ok = await verifyPassword(password, emailHash);

    if(ok)
    {
        const sql = `SELECT email, motDePasse FROM compteEmployes WHERE email='${email}' AND motDePasse = '${password}';`;

        db.query(sql, (err, results) => {
            console.log(`Requete envoyee pour savoir si le compte avec l'email ${email} existe et si le mot 
            de passe correspond.`);

            if(err)
            {
                console.error(`Erreur lors de l'obtention des informations de compte utilisateur : `, err);
                res.status(500).send({error: "Erreur serveur"});
            }
            else
            {
                console.log(`L'utilisateur avec l'email ${email} existe`);
                res.status(200).send({message: `Les informations de conenxion sont bien correctes.`})
            }
        });
    }
    else
    {
        return res.status(404).send({message: `Identifiant ou mot de passe incorrect.`});
    }
}

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
// const urlencodedParser = bodyParser.urlencoded();

router.get('/', (req, res) => {
    const data = {};

    db.query('SELECT email FROM compteEmployes', (err, results) => {
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
    verifyUser(req, res);
});

router.post('/register', (req, res) => {
    newUser(req, res);
});

module.exports = router;