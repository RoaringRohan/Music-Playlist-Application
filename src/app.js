const express = require('express');
const {MongoClient} = require('mongodb');

const url = "mongodb+srv://rdatta8:Rajatroro1!@se3316-webtech.lnvqrnd.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);

const app = express();

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

async function listDatabases(client){
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};
