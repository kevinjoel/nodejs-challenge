const {
    NODE_ENV
} = process.env;

const DBConfig = {
    host: "mongodb://localhost:27017/",
    database: NODE_ENV == "development" ? "challenge_dev" : 'challenge_prod'
}

export default DBConfig;