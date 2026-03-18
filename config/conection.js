const { MongoClient } = require("mongodb");

const state = {
  db: null
};

module.exports.connect = (done) => {

  const url = process.env.MONGO_URI;   // ✅ use env variable
  const dbname = "xonify";

  MongoClient.connect(url)
    .then(client => {
      state.db = client.db(dbname);
      console.log("MongoDB Atlas Connected ✅");
      done();
    })
    .catch(err => {
      console.log("DB Error ❌", err);
      done(err);
    });
};

module.exports.get = () => {
  return state.db;
};