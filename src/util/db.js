const { MongoClient, ServerApiVersion } = require('mongodb');

const client = new MongoClient(process.env.DBURI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

async function connectDB() {
    try {
        await client.connect();
    } catch (err) {
        throw err;
    }
}

function getClient() {
    return client;
}

module.exports = {
    connectDB,
    getClient
};
