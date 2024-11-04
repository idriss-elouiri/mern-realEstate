import Listing from "../../modules/listing/listing.model.js";
import { errorHandler } from "../../utils/error.js";

// Helper function to build query filters from request parameters
const buildFilters = (req) => {
  const { category, offer, furnished, parking, type, searchTerm, address } = req.query;

  return {
    name: { $regex: searchTerm || "", $options: "i" },
    address: { $regex: address || "", $options: "i" },
    category: category && category !== "none" ? category : { $in: ["apartment", "condos", "offices", "homes & villas", "commercial"] },
    offer: offer || { $in: ["no", "yes"] },
    furnished: furnished || { $in: ["no", "yes"] },
    parking: parking && parking !== "none" ? parking : { $in: ["street", "garage"] },
    type: type && type !== "all" ? type : { $in: ["sale", "rent"] },
  };
};

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }
    if (req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(401, "You can only delete your own listings!"));
    }

    await Listing.findByIdAndDelete(req.params.id);
    return res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }
    if (req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(401, "You can only update your own listings!"));
    }

    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }
    return res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const filters = buildFilters(req);
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const listings = await Listing.find(filters)
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
