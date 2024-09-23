const mongoose = require("mongoose");
const review = require("./review");
const { object, ref } = require("joi");
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
        "https://images.unsplash.com/photo-1611602132416-da2045990f76?q=80&w=1974&auto=format&fit=crop&ixlib=rb-",
      set: (v) =>
        v === ""
          ? "https://images.unsplash.com/photo-1611602132416-da2045990f76?q=80&w=1974&auto=format&fit=crop&ixlib=rb-"
          : v,
    },
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
