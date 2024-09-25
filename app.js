const exp = require("constants");
const express = require("express");
const mongoose = require("mongoose");
const methodOverrid = require("method-override");
const engine = require("ejs-mate");
const path = require("path");
const Listing = require("./models/listing");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverrid("_method"));
app.engine("ejs", engine);

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
app.get("/", (req, res) => {
  res.send("<a href='/listings'>All listings</a>");
});
app.get("/listings", async (req, res) => {
  const data = await Listing.find({});
  res.render("listings/index.ejs", { listings: data });
});
app.get("/listings/new", (req, res) => {
  res.render("listings/newForm.ejs");
});
app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/listing.ejs", { listing });
});

app.post("/listings", async (req, res) => {
  const listing = req.body;
  const listing1 = new Listing(listing);
  await listing1.save();
  res.redirect("/listings");
});

app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

app.put("/listings/:id", async (req, res) => {
  const listing = req.body;
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, listing);
  res.redirect(`/listings/${id}`);
});
app.delete("/listings/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

app.listen(3000);
