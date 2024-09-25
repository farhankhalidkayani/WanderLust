const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main()
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

const initDb = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
};
initDb()
  .then(() => {
    console.log("Done");
  })
  .catch((err) => {
    console.log(err);
  });
