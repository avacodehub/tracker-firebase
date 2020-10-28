/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */

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

const db = admin.firestore();
const DB_NAME = 'projects'

// upsert
app.post('/api/upsert', (req, res) => {
  (async () => {
      try {
        await db.collection(DB_NAME).doc('/' + req.body.customId + '/')
            .set(req.body);
        return res.status(200).send();
      } catch (error) {
        console.log(error);
        return res.status(500).send(error);
      }
    })();
});

// read item
app.get('/api/read/:customId', (req, res) => {
  (async () => {
      try {
          const document = db.collection(DB_NAME).doc(req.params.customId);
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

exports.app = functions.https.onRequest(app);