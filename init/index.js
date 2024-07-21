const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MongooseURL = "mongodb://127.0.0.1:27017/HavenHub";

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MongooseURL);
}

const initDB = async () => {
  Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("Data was inzilized ");
};

initDB();
