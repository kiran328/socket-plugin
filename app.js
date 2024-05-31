const { initializeApp } = require("firebase/app");
const { getDatabase, ref, onValue } = require("firebase/database");
const WebSocketServer = require("ws").Server;

const firebaseConfig = {
  apiKey: "AIzaSyDSeIeLRM7rxxvhcoxlsHeaT75licd3p-8",
  authDomain: "brand-luminaire.firebaseapp.com",
  databaseURL: "https://brand-luminaire-default-rtdb.firebaseio.com",
  projectId: "brand-luminaire",
  storageBucket: "brand-luminaire.appspot.com",
  messagingSenderId: "372532793873",
  appId: "1:372532793873:web:0e54d4aa3b8825844617b0",
  measurementId: "G-DNC0DNYJC6",
};

const wss = new WebSocketServer({ port: 8081 });

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dataRef = ref(database, "queries");

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log(`received: ${message}`);
  });
  onValue(dataRef, async (snapshot) => {
    const allDocs = [];
    for (let doc in snapshot.val()) {
      allDocs.push({
        key: doc,
        ...snapshot.val()[doc],
      });
    }
    const pendingDocs = allDocs.filter((doc) => !doc.updatedAt);
    ws.send(JSON.stringify(pendingDocs));
  });
});
