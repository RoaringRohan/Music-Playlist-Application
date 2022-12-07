const express = require('express');
const {MongoClient} = require('mongodb');

const url = "mongodb+srv://user:roots@se3316-webtech.lnvqrnd.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);

// Connecting to Database

async function start() {
  try {
      await client.connect();
      console.log("Connected correctly to server");

      await listDatabases(client);

  } catch (err) {
      console.log(err.stack);
  }
  finally {
      await client.close();
  }
}

start().catch(console.dir);

// Prints all Databases
async function listDatabases(client){
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

// API Connection and Endpoints
const app = express();
app.use(express.json());
const port = 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
