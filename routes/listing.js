const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js"); //to handle error

const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controller/listingController.js");

//multer
const multer = require('multer');
const { storage, cloudinary } = require("../cloudConfig.js"); // Destructure storage and cloudinary

const upload = multer({ storage: storage }); // Pass storage as an object property

// refer docs
router.route("/")
  .get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));






//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm );

    router.route("/:id")
    .get(  wrapAsync(listingController.showListing))
    .put(isOwner,isLoggedIn,upload.single('listing[image]'), validateListing,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner ,wrapAsync(listingController.destroyListing));
    
    //edit route
    router.get("/:id/edit",isLoggedIn, wrapAsync(listingController.renderEditForm));


    module.exports=router;