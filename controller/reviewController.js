
const Listing=require("../models/listing.js");
const Review=require("../models/review.js"); //review schema

module.exports.createReview=async(req, res) => {
    let id=req.params.id;
     let listing = await Listing.findById(id);
     let newReview = new Review(req.body.review);
      
     newReview.author=req.user._id;
     //console.log(newReview);
     listing.reviews.push(newReview);
 
     await newReview.save();
     await listing.save();
     req.flash("success","New Review Created");
     res.redirect(`/listings/${listing._id}`);
 }

 module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
 
    if(!reviewId){
     req.flash("error","you are requested for the page doesn't exist ");
     res.redirect(`/listings/${id}`);
 }
    req.flash("success"," Review Deleted");
    
    
    res.redirect(`/listings/${id}`);
 }