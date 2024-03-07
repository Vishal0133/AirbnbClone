const express=require("express");
const router=express.Router({ mergeParams: true });
const wrapAsync=require("../utils/wrapAsync.js"); //to handle error
const Review=require("../models/review.js"); //review schema
const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js");

const reviewController=require("../controller/reviewController.js");





//Reviews post Route 
router.post("/", validateReview,isLoggedIn, wrapAsync(reviewController.createReview));


//Review Delete Route

router.delete("/:reviewId",isReviewAuthor,isLoggedIn,wrapAsync(reviewController.destroyReview));

module.exports=router;