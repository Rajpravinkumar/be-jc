import mongoose from "mongoose";

const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "JOB_SEEKING" })
    .then(() => console.log("Connected to the database"))  
    .catch((e) => console.error("DB error", e));  
};

export default dbConnection;
