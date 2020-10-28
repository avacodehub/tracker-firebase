/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */

//подключение библиотек firestore, которые позволят настроить подключение
//к базе данных и функциям (cloud-functions)

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://xamarin-tracker.firebaseio.com"
});

/**
 * создается соединенией (db) к базе данных firestore с помощью 
 * admin. Далее с помощью этого соединения будет осуществляться доступ 
 * к коллекции 'projects'
 */

const db = admin.firestore();
const DB_NAME = 'projects'

//тестовый endpoint, используется для проверки доступности cloud-functions
//так как совершенно не зависит от базы данных

app.get('/hello-world', (req, res) => {
  return res.status(200).send('Hello World!');
});

// upsert
// 
app.post('/api/create', (req, res) => {
  (async () => {
      try {
        await db.collection(DB_NAME).doc('/' + req.body.id + '/')
            .set(req.body.item);
        return res.status(200).send();
      } catch (error) {
        console.log(error);
        return res.status(500).send(error);
      }
    })();
});

// read item
app.get('/api/read/:item_id', (req, res) => {
  (async () => {
      try {
          const document = db.collection(DB_NAME).doc(req.params.item_id);
          let item = await document.get();
          let response = item.data();
          return res.status(200).send(response);
      } catch (error) {
          console.log(error);
          return res.status(500).send(error);
      }
      })();
  });

// read all
app.get('/api/read', (req, res) => {
  (async () => {
      try {
          let query = db.collection(DB_NAME);
          let response = [];
          await query.get().then(querySnapshot => {
          let docs = querySnapshot.docs;
          for (let doc of docs) {
              const selectedItem = {
                  id: doc.id,
                  item: doc.data().item
              };
              response.push(selectedItem);
          }
          });
          return res.status(200).send(response);
      } catch (error) {
          console.log(error);
          return res.status(500).send(error);
      }
      })();
  });

// update
app.put('/api/update/:item_id', (req, res) => {
(async () => {
  try {
      const document = db.collection(DB_NAME).doc(req.params.item_id);
      await document.update({
          item: req.body.item
      });
      return res.status(200).send();
  } catch (error) {
      console.log(error);
      return res.status(500).send(error);
  }
  })();
});

// delete
app.delete('/api/delete/:item_id', (req, res) => {
(async () => {
  try {
      const document = db.collection(DB_NAME).doc(req.params.item_id);
      await document.delete();
      return res.status(200).send();
  } catch (error) {
      console.log(error);
      return res.status(500).send(error);
  }
  })();
});

exports.app = functions.https.onRequest(app);