// const express = require('express');
// const mysql = require('mysql2');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const app = express();

// app.use(cors());
// app.use(bodyParser.json());

// // Connexion MySQL
// const db = mysql.createConnection({
//   host: '10.20.8.132',
//   user: 'chloe',
//   password: 'ciel',
//   database: 'app_db_lifi'
// });

// db.connect((err) => {
//   if (err) {
//     console.error("Erreur de connexion :", err);
//   } else {
//     console.log("Connecté à la base de données MySQL !");
//   }
// });

// // GET - toutes les œuvres
// app.get('/api/oeuvres', (req, res) => {
//   const sql = 'SELECT * FROM oeuvres';
//   db.query(sql, (err, results) => {
//     if (err) return res.status(500).json({ error: 'Erreur serveur' });
//     res.json(results);
//   });
// });

// // POST - ajouter une œuvre
// app.post('/api/oeuvres', (req, res) => {
//   const { nom_oeuvre, nom_auteur, date_oeuvre, id_hexa, url, description } = req.body;

//   if (!nom_oeuvre || !nom_auteur || !date_oeuvre || !id_hexa || !url || !description) {
//     return res.status(400).send({ error: 'Tous les champs sont requis.' });
//   }

//   const sql = 'INSERT INTO oeuvres (nom_oeuvre, nom_auteur, date_oeuvre, id_hexa, url, description) VALUES (?, ?, ?, ?, ?, ?)';
//   db.query(sql, [nom_oeuvre, nom_auteur, date_oeuvre, id_hexa, url, description], (err, result) => {
//     if (err) return res.status(500).send({ error: 'Erreur serveur' });
//     res.status(201).send({ message: 'Œuvre ajoutée', id: result.insertId });
//   });
// });

// // PUT - modifier une œuvre
// app.put('/api/oeuvres/:id', (req, res) => {
//   const id = req.params.id;
//   const { nom_oeuvre, nom_auteur, date_oeuvre, id_hexa, url, description } = req.body;

//   const sql = 'UPDATE oeuvres SET nom_oeuvre = ?, nom_auteur = ?, date_oeuvre = ?, id_hexa = ?, url = ?, description = ? WHERE id_oeuvre = ?';
//   db.query(sql, [nom_oeuvre, nom_auteur, date_oeuvre, id_hexa, url, description, id], (err, result) => {
//     if (err) return res.status(500).send({ error: 'Erreur serveur' });
//     if (result.affectedRows === 0) return res.status(404).send({ error: 'Œuvre non trouvée' });
//     res.send({ message: 'Œuvre modifiée' });
//   });
// });

// // DELETE - supprimer une œuvre
// app.delete('/api/oeuvres/:id', (req, res) => {
//   const id = req.params.id;
//   const sql = 'DELETE FROM oeuvres WHERE id_oeuvre = ?';
//   db.query(sql, [id], (err, result) => {
//     if (err) return res.status(500).send({ error: 'Erreur serveur' });
//     if (result.affectedRows === 0) return res.status(404).send({ error: 'Œuvre non trouvée' });
//     res.status(204).send();
//   });
// });

// // Démarrer le serveur sur le port 3010
// app.listen(3010, () => {
//   console.log('Serveur démarré sur http://10.20.8.132:3010');
// });
