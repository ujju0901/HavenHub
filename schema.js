const Joi = require("joi");
const Listing = require("./models/listing");
const Review = require("./models/review");
const review = require("./models/review");

module.exports.ListingSchema = Joi.object({
  Listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.object().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().allow("", null),
  }).required(),
});

module.exports.ReviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().required(),
  }).required(),
});
