import express from 'express';
import routes from './app/routes/index.js';
import DBConection from './app/config/db.js';

const {
    PORT
} = process.env;

const app = express();
const port = PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get('/', function (req, res) { res.status(404).end('Not found'); });

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(routes);

app.listen(port, () => {
    console.log(`Server running on port: ${port}`)
    DBConection.once("open", () => {
        console.log("MongoDB database conection established successfully")
    })
});