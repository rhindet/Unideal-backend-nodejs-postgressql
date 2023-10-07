


var admin = require("firebase-admin");

var serviceAccount = require("../delivery-app-unideal-firebase-adminsdk-kpofp-8f2e28da09.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://delivery-app-unideal-default-rtdb.firebaseio.com"
});

const db = admin.database();

module.exports = db;