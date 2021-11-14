import { connect } from "mongoose";

const URI= process.env.MONGODB_URL;
connect(`${URI}`,{
  useCreateIndex:true,
  useFindAndModify:false,
  useNewUrlParser:true,
  useUnifiedTopology:true,
},(err)=>{
  if(err) throw err;

  console.log("Mongodb connection successfully.");
})