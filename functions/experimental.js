/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

const database = admin.database();

const db = admin.firestore();
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.json({ name: "defaultName", time: "00:05:20", customId: "default" });
});

// exports.getItem = functions.https.onRequest((request, response) => {
//   const customId = request.params.customId;
//   const body = database.ref('projects').child(customId).toJSON();
//   response.json(body);
// });

// exports.postItem = functions.https.onRequest((request, response) => {
//   const customId = request.params.customId;
//   const name = request.params.name;
//   const time = request.params.time;

//   const path = database.ref('projects/' + customId);
//   path.update({name: name, time: time})
//   response.send("OK");
// });

const projectsRef = db.collection("projects");

// exports.getItem = functions.https.onRequest((req, res) => {
//   const customId = req.query.customId;
//   let body;

//   projectsRef.get().then((querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//       if (doc.data.customId === customId) {
//         body = doc.data();
//         return;
//       }
//       console.log(doc.id, " => ", doc.data());
//     });
//   });
//   res.json(body);
//   res.end();
// });

exports.getItem = functions.https.onRequest((req, res) => {
  const customId = req.query.customId;
  // let body = projectsRef.doc(customId)
  // let body;
  var docRef = projectsRef.doc(customId);

  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        // body = doc.data();
        console.log("Document data:", doc.data());
        res.json(doc.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        res.send("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
      res.send("Server Error");
    });
  // res.json(body);
  res.end();
});

exports.postItem = functions.https.onRequest((req, res) => {
  //projectsRef.add(req.body);
  const customId = req.body.customId;
  projectsRef.doc(customId).set(req.body);
  res.send("OK");
});
