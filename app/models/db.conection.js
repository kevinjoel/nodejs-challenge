import mongoose from "mongoose";
import DBConfig from '../config/db.config.js';

mongoose.connect(
    DBConfig.host + DBConfig.database,
    { useUnifiedTopology: true, useNewUrlParser: true }
);

const conection = mongoose.connection;

export default conection;