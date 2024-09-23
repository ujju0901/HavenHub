const express = require("express");
const app = express();

const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/warpAsync.js");
const ExpressError = require("./utils/ExpressError");
const { ListingSchema, ReviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

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

app.listen(8080, () => {
  console.log("Server is running...");
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

const validateListing = (req, res, next) => {
  let { error } = ListingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(404, error);
  }
  next();
};

const validateReview = (req, res, next) => {
  let { error } = ReviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(404, error);
  }
  next();
};
// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My vacation Home",
//     description: "this is near to toronto city",
//     price: 1200,
//     location: "Toronto ,ON",
//     country: "Canada",
//   });
//   await sampleListing.save();
//   console.log("data saved sucessful");
//   res.send("sucessful");
// });

app.get("/listings", async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("listings/index.ejs", { alllistings });
});

app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  console.log(listing);
  res.render("listings/show.ejs", { listing });
});

app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  console.log(listing);
  res.render("listings/edit.ejs", { listing });
});

app.post("/listing/:id", async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

app.delete("/listing/:id", async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});

// Review Post Route

app.post(
  "/listings/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save(); //reviews
    res.redirect(`/listings/${listing._id}`);
  })
);
//delete review

app.delete(
  "/listing/:id/reviews/:reviewID",
  wrapAsync(async (req, res) => {
    const { id, reviewID } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    res.redirect(`/listings/${id}`);
  })
);

app.all("*", (err, req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statuscode = 500, message = "Somethings Went wrong" } = err;
  res.status(statuscode).render("listings/Error.ejs", { message });
});
