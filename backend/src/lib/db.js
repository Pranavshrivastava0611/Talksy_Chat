import mongoose from "mongoose"


export const conncetDb = async ()=>{
    try{
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDb connected : " + conn.connection.host);
    }catch(error){
        console.log("MongoDb conncetion error : " , error);
    }

}