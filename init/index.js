const mongoose=require("mongoose"); 
const initData=require("./data.js"); //initialised data 
const Listing=require("../models/listing.js"); //designed schema

const mongo_Url="mongodb://127.0.0.1:27017/wanderlust";  //creating db with name wanderlust
main()
.then((res)=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
   
    await mongoose.connect(mongo_Url);
}

const initDb= async ()=>{
await Listing.deleteMany({});
initData.data=initData.data.map((obj)=>({...obj,owner:"65e0ebb8fbc2a83362a739a9"}));
await Listing.insertMany(initData.data);
console.log("data was initialised");
}
initDb();