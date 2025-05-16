require('dotenv').config();

function retourLigne(nbrBr = 1)
{
    for(i = 0; i < nbrBr; i++)
    {
        console.log(" ");
    }
}

const bodyParser = require('body-parser')

const firsEndpoint = "/api/v1";
const tablettesRoutes = require("./Routes/tablettes");
const empruntsRoutes = require('./Routes/emprunts');
const oeuvresRoutes = require('./Routes/oeuvres');
const dataRoutes = require('./Routes/data');
const lampesRoute = require('./Routes/lampes');

const express = require('express'); //Créer des serveurs web en Node.js
const app = express();  //Cette ligne crée une instance de l'application Express, qui est utilisée pour configurer et démarrer le serveur.

const PORT = process.env.PORT || 3000; //Port défini avec la variable d'environnement sinon 3000
const db = require('./config/connexionMysql.cjs'); //Ce qui permet de connecter à mysql

//Verification de la connexion
db.connect(err => {
    if (err) {
        console.error('Erreur de connexion a la base de donnees:', err);
        return;
    }
    console.log("Connection MySQL !");
});

app.use(express.json()); //Gérer les réponses Json --- middleware
// app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// Import des différents modules créés pour l'API
app.use(firsEndpoint + '/tablettes', tablettesRoutes);
app.use(firsEndpoint + '/emprunts', empruntsRoutes);
app.use(firsEndpoint + '/oeuvres', oeuvresRoutes);
app.use(firsEndpoint + '/data', dataRoutes);
app.use(firsEndpoint + '/lampes', lampesRoute);

// Demarrer le serveur
app.listen(PORT, () => console.log(`Serveur API sur http://localhost:${PORT}`));
retourLigne(2);