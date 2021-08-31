import mongoose from "mongoose";

const {
    NODE_ENV
} = process.env;

const db_name = NODE_ENV == "development" ? "challenge_dev" : 'challenge_prod';
mongoose.connect(`mongodb://localhost:27017/${db_name}`, { useUnifiedTopology: true, useNewUrlParser: true });
const conection = mongoose.connection;

export default conection;