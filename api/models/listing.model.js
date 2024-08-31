import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    category: {
      type: String,
    },
    regularPrice: {
      type: Number,
    },
    discountPrice: {
      type: Number,
    },
    bathrooms: {
      type: Number,
    },
    bedrooms: {
      type: Number,
    },
    furnished: {
      type: String,
    },
    parking: {
      type: String,
    },
    type: {
      type: String,
    },
    offer: {
      type: String,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
