module.exports = {
    apps: [{
        name: "Nodejs challege",
        script: "node --experimental-modules ./server.js",
        env_production: {
            PORT: 3001,
            NODE_ENV: "production"
        },
        env_development: {
            PORT: 3001,
            NODE_ENV: "development"
        }
    }]
}