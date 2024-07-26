const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: {
      type: String,
      default: "listingimage",
    },

    url: {
      type: String,
      default:
        "https://unsplash.com/photos/3d-render-modern-building-exterior-uuohG3N0O8o",
      set: (v) =>
        v === ""
          ? "https://unsplash.com/photos/3d-render-modern-building-exterior-uuohG3N0O8o"
          : v,
    },
  },
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
