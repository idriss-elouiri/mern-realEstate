import express from "express";
import { verifyToken } from "../../utils/verifyUser.js";
import * as listingController from "./listing.controller.js";
import { validateZod } from "../../middlewares/validate-zod.js";
import { listingSchema } from "./listing.shcema.js";

const router = express.Router();

router.post(
  "/create",
  verifyToken,
  validateZod(listingSchema),
  listingController.createListing
);

router.get("/get", listingController.getListings);

router.delete("/delete/:id", verifyToken, listingController.deleteListing);

router.put("/update/:id", verifyToken, listingController.updateListing);

router.get("/get/:id", listingController.getListing);

export default router;
