import mongoose from "mongoose";

const { Schema } = mongoose;

// Define the Listing schema
const listingSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true, // Automatically trim whitespace
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ["apartment", "condos", "offices", "homes & villas", "commercial"], // Restrict to specific categories
    },
    regularPrice: {
      type: Number,
      min: 0, // Ensure price is non-negative
    },
    discountPrice: {
      type: Number,
      min: 0, // Ensure price is non-negative
    },
    bathrooms: {
      type: Number,
      min: 0, // Ensure number of bathrooms is non-negative
    },
    bedrooms: {
      type: Number,
      min: 0, // Ensure number of bedrooms is non-negative
    },
    furnished: {
      type: String,
      enum: ["yes", "no"], // Restrict to specific values
    },
    parking: {
      type: String,
      enum: ["street", "garage"], // Restrict to specific parking types
    },
    type: {
      type: String,
      enum: ["sale", "rent"], // Restrict to specific listing types
    },
    offer: {
      type: String,
      enum: ["yes", "no"], // Restrict to specific offer statuses
    },
    imageUrls: {
      type: [String], // Use an array of strings for image URLs
      required: [true, "Image URLs are required"],
      validate: {
        validator: (v) => v.length > 0,
        message: "At least one image URL is required",
      },
    },
    userRef: {
      type: mongoose.Schema.Types.ObjectId, // Use ObjectId for user reference
      required: [true, "User reference is required"],
      ref: "User", // Reference the User model
    },
  },
  { timestamps: true }
);

// Create the Listing model
const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
